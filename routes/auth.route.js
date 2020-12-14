//imports
const express = require('express');
const usersController = require('../controllers/user.controller');

//routes
const auth = express.Router();

/**
 * GET
 */

auth.get('/getprofil', usersController.getprofil);
/**
 * POST
 */
auth.post('/register', usersController.register);
auth.post('/login', usersController.login);

/**
 * PUT
 */
auth.put('/editprofil', usersController.editprofil);

module.exports = auth;
