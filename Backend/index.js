require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const session = require('express-session');
const passport = require('passport');
const User = require('./model/auth');
const localStrategy = require('passport-local').Strategy;
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

passport.use(new localStrategy(async function verify(username, passsword, done){
    try{
        const user = await User.findOne({username:username});
        if(!user) return done(null, false, {message:"Invalid Username or Password"});
        bcrypt.compare(passsword, user.password, (err, result)=>{
            if(err) return done(err, false);
            if(!result) return done(null, false, {message:"Invalid username or password"});
            return done(null, user)
        });
    }
    catch(err){
        return done(err, false, {message:"Internal server error"});
    }
}));
passport.serializeUser((user, cb)=>{
    cb(null, {id:user.id, username: user.username, name:user.name, phone:user.phone, preferredLanguage:user.preferredLanguage, avatar:user.avatar});
});
passport.deserializeUser((user, cb)=>{
    cb(null, {id:user.id, username: user.username, name:user.name, phone:user.phone, preferredLanguage:user.preferredLanguage, avatar:user.avatar});
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
    console.log(req.user);
    res.json('hello this is login page');
})

server.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})