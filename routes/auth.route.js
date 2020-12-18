//imports
const express = require('express');
const usersController = require('../controllers/user.controller');

//routes
const auth = express.Router();
//users routes

/**
 * GET
 */

/**
 * POST
 */
auth.post('/register', usersController.register);
auth.post('/login', usersController.login);
auth.post('/forgot-password', usersController.forgotPassword);

/**
 * PATCH
 */
auth.patch('/reset-password', usersController.resetPassword);

module.exports = auth;
