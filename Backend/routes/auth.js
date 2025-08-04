const express = require('express');
const router = express.Router();
const { createUser } = require('../control/auth');

router.post('/register', createUser);
// router.post('/login', loginUser);
// router.post('/logout', logoutUser);
// router.get('/check', checkAuth);

module.exports = router;
