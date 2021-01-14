const user = require('express').Router();

const usersController = require('../controllers/user.controller');

/**
 * GET
 */

user.get('/', usersController.getprofil);

/**
 * PUT
 */
user.put('/', usersController.editprofil);

/**
 * DELETE
 */
user.delete('/', usersController.deleteProfile);

module.exports = user;
