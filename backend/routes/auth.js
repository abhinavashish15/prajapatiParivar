const express = require('express');
const router = express.Router();
const AuthController = require('../controller/authController');

// User Registration
router.post('/signup', AuthController.signUp);

// User Login
router.post('/signin', AuthController.signIn);

module.exports = router;
