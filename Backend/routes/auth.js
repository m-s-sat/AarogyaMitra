const express = require('express');
const { createUser, getUser, loginUser, logout } = require('../control/auth');
const router = express.Router();
const passport = require('passport');

router.post('/login',passport.authenticate('local'),loginUser).post('/register',createUser).get('/getuser',getUser).get('/logout',logout);

exports.router = router