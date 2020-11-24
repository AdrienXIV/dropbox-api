const share = require('express').Router();
const shareController = require('../controllers/share.controller');

/**
 * GET
 */
share.get('/files', shareController.sendFileNames);
share.get('/files/:filename', shareController.sendFile);
/**
 * POST
 */
share.post('/new-files', shareController.uploadFiles);

/**
 * PATCH
 */

module.exports = share;
