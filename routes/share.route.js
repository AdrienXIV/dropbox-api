//imports
const express = require('express');
const shareController = require('../controllers/share.controller');

//routes
const share = express.Router();

/**
 * GET
 */

/**
 * POST
 */
share.post('/new-files', shareController.uploadFiles);

/**
 * PATCH
 */

module.exports = share;
