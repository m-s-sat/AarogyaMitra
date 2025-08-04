const express = require('express');
const { createUser, getUser } = require('../control/auth');
const router = express.Router();
const passport = require('passport');

router.post('/login',passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/auth/login',
})).post('/register',createUser).get('/getuser',getUser);

exports.router = router