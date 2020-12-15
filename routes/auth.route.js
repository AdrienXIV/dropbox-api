//imports
const express = require('express');
const usersController = require('../controllers/user.controller');

//routes
const auth = express.Router();

/**
 * POST
 */
auth.post('/register', usersController.register);
auth.post('/login', usersController.login);


module.exports = auth;
