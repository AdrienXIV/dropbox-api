const auth = require('express').Router();
const usersController = require('../controllers/user.controller');

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
auth.patch('/reset-password/:str', usersController.resetPassword);

module.exports = auth;
