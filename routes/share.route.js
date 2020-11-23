//imports
const express = require('express');
const shareController = require('../controllers/share.controller');
const { verifyUserToken, verifyUserRequestQueryId } = require('../middlewares/user.middleware');

//routes
const share = express.Router();

/**
 * GET
 */
share.get('/files', verifyUserToken, shareController.sendFileNames);
share.get('/files/:filename', verifyUserRequestQueryId, shareController.sendFile);
/**
 * POST
 */
share.post('/new-files', verifyUserToken, shareController.uploadFiles);

/**
 * PATCH
 */

module.exports = share;
