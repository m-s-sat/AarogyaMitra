const express = require('express');
const { createUser, getUser, loginUser, logout } = require('../control/auth');
const router = express.Router();
const passport = require('passport');

router
    .post('/login',passport.authenticate('local'),loginUser)
    .post('/register',createUser).get('/getuser',getUser)
    .get('/logout',logout)
    .get('/google',passport.authenticate('google',{
        scope: ["profile", "email"]
    }))
    .get('/google/callback', passport.authenticate("google"), (req,res)=>{
        console.log(req.user);
        res.redirect('http://localhost:5173/dashboard')
    });

exports.router = router