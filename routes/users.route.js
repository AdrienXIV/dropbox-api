//imports
const express = require('express');
const usersController = require('../controllers/user.controller');

const user = express.Router();
/**
 * GET
 */

user.get('/getprofil', usersController.getprofil);

/**
 * PUT
 */
user.put('/editprofil', usersController.editprofil);

module.exports = user;
