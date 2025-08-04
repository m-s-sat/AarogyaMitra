require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const server = express();
const authRoutes = require('./routes/auth');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const User = require('./model/auth');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');


server.use(express.json());
server.use(cors());
server.use(cookieParser());
server.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
}));
server.use(passport.initialize());
server.use(passport.session());

async function main(){
    await mongoose.connect(process.env.MONGOURI);
}

main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error(err);
});

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    },
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
});
server.use('/auth', authRoutes);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

