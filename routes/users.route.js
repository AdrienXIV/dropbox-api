const user = require('express').Router();

const usersController = require('../controllers/user.controller');

/**
 * GET
 */

user.get('/getprofil', usersController.getprofil);

/**
 * PUT
 */
user.put('/editprofil', usersController.editprofil);

/**
 * DELETE
 */
user.delete('/profile', usersController.deleteProfile);

module.exports = user;
