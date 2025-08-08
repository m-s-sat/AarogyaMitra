const express = require('express');
const { createUser, getUser, loginUser, logout, setForgotPassToken, forgotpass, updateProfile, createHospital } = require('../control/auth');
const router = express.Router();
const passport = require('passport');
const { isAuth } = require('../common/common');

router
    .post('/login',passport.authenticate('local'),loginUser)
    .post('/register',createUser)
    .get('/getuser',getUser)
    .get('/logout',logout)
    .get('/google',passport.authenticate('google',{
        scope: ["profile", "email"]
    }))
    .get('/google/callback', passport.authenticate("google"), (req,res)=>{

        res.redirect('http://localhost:5173/dashboard')
    })
    .post('/reset-request',setForgotPassToken)
    .post('/password-reset',forgotpass)
    .patch('/profileupdate', isAuth ,updateProfile)
    .post('/hospitalreg', createHospital);

exports.router = router;