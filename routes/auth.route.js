//imports
const express = require('express');
const usersController = require('../controllers/user.controller');

//routes
const auth = express.Router();
//users routes
auth.post('/register', usersController.register);
auth.post('/login', usersController.login);
auth.post('/editprofil', usersController.editprofil);
auth.get('/getprofil', usersController.getprofil);

module.exports = auth;
