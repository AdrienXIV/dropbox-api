const auth = require('express').Router();
const usersController = require('../controllers/user.controller');

/**
 * POST
 */
auth.post('/register', usersController.register);
auth.post('/login', usersController.login);
auth.post('/forgot-password', usersController.forgotPassword);

/**
 * PUT
 */
auth.put('/reset-password/:str', usersController.resetPassword);

module.exports = auth;
