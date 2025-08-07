require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const session = require('express-session');
const passport = require('passport');
const User = require('./model/auth');
const localStrategy = require('passport-local').Strategy;
const googleStrategy = require('passport-google-oauth2').Strategy;
const bcrypt = require('bcrypt');
const { isAuth } = require('./common/common');
const server = express();
const cors = require('cors')

const isProduction = process.env.NODE_ENV === 'production';

server.use(session({
    secret:process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 100 * 60 * 60 * 24,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction
    }
}));

server.use(passport.initialize());
server.use(passport.session());
server.use(express.json());
server.use(cors({
    credentials: true,
    origin:'http://localhost:5173'
}));

passport.use("local", new localStrategy(async function verify(username, password, done){
    try{
        const user = await User.findOne({
            $or: [
                { username: username },
                { phone: username }
            ]
        });
        if(!user) return done(null, false, {message:"Invalid Username or Password"});
        bcrypt.compare(password, user.password, (err, result)=>{
            if(err) return done(err, false);
            if(!result) return done(null, false, {message:"Invalid username or password"});
            return done(null, user)
        });
    }
    catch(err){
        return done(err, false, {message:"Internal server error"});
    }
}));
passport.use("google", 
    new googleStrategy({
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
    }, async(accessToken, refreshToken, profile, done)=>{
        try{
            const user = await User.findOne({username:profile.email});
            const min = 1000000000;
            const max = 9999999999;
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            if(!user){
                const newUser = new User({
                    username: profile.email,
                    password: "google",
                    name: profile.displayName,
                    avatar: profile.picture,
                    preferredLanguage: 'en',
                    phone: String(randomNumber),
                    role: 'patient'
                })
                await newUser.save();
                return done(null, newUser);
            }
            
            return done(null, user);
        }
        catch(err){
            return done(err);
        }
    })
)

passport.serializeUser((user, cb)=>{
    cb(null, user);
});
passport.deserializeUser((user, cb)=>{
    cb(null, user);
});

async function main(){
    await mongoose.connect(process.env.MONGOURI);
}

main().then(()=>{
    console.log('mongodb connected');
}).catch((err)=>{
    console.log(err);
})

server.use('/auth',authRouter.router);

server.get('/',isAuth,(req,res)=>{
    res.json('hello this is login page');
})

server.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})