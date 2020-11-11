//imports
const express = require('express');
const usersController = require('./user.controller');

//routes
const auth = express.Router();
//users routes
auth.route('/register',usersController.register);
auth.route('/login',usersController.login);

module.exports = auth;