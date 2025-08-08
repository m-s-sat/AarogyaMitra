// backend/index.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const bcrypt = require('bcrypt');

const authRouter = require('./routes/auth');
const User = require('./model/auth');
const HospitalReg = require('./model/hospitalreg');
const { setupNotification } = require('./control/auth');
const { setupWelcomeNotifications, scheduleWeeklyTrackerReminders } = require('./control/cronjob');
const localStrategy = require('passport-local').Strategy;
const googleStrategy = require('passport-google-oauth2').Strategy;

const server = express();

const isProduction = process.env.NODE_ENV === 'production';

// Middlewares
server.use(express.json());
server.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
server.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction
    }
}));
server.use(passport.initialize());
server.use(passport.session());

passport.use("local", new localStrategy(async function verify(username, password, done) {
    try {
        const user = await User.findOne({ $or: [{ username: username }, { phone: username }] });

        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) return done(err);
                if (!result) return done(null, false, { message: "Invalid username or password" });
                return done(null, user);
            });
        } else {
            const hospital = await HospitalReg.findOne({ $or: [{ "admin.email": username }, { "admin.phone": username }] });
            if (!hospital) {
                return done(null, false, { message: "Invalid Username or Password" });
            }
            bcrypt.compare(password, hospital.admin.password, (err, result) => {
                if (err) return done(err);
                if (!result) return done(null, false, { message: "Invalid Username or Password" });
                return done(null, hospital);
            });
        }
    } catch (err) {
        return done(err);
    }
}));

passport.use("google", new googleStrategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ username: profile.email });
        if (!user) {
            user = new User({
                username: profile.email,
                password: "google",
                name: profile.displayName,
                avatar: profile.picture,
                preferredLanguage: 'en',
                role: 'patient'
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, cb) => {
    const identifier = {
        id: user._id,
        role: user.role
    };
    cb(null, identifier);
});

passport.deserializeUser(async (identifier, cb) => {
    try {
        if (identifier.role === 'hospital') {
            const hospital = await HospitalReg.findById(identifier.id);
            cb(null, hospital);
        } else {
            const user = await User.findById(identifier.id);
            cb(null, user);
        }
    } catch (err) {
        cb(err, null);
    }
});

async function main() {
    await mongoose.connect(process.env.MONGOURI);
    console.log('MongoDB connected');
    scheduleWeeklyTrackerReminders();
}
main().catch(err => console.log(err));


server.use('/auth', authRouter.router);

server.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
});