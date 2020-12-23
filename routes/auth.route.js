const auth = require('express').Router();
const usersController = require('../controllers/user.controller');

/**
 * POST
 */
auth.post('/register', usersController.register);
auth.post('/login', usersController.login);
auth.post('/forgot-password', usersController.forgotPassword);
auth.get('/monprofil',usersController.getEditUser);
auth.put('/modifierprofil',usersController.postEditUser);
auth.delete('/deleteprofil',usersController.deleteUser);

/**
 * PUT
 */
auth.put('/reset-password/:str', usersController.resetPassword);

module.exports = auth;
