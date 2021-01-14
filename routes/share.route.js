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
share.post('/new-folder', shareController.uploadFolder);
/**
 * PUT
 */
share.put('/save-code-file', shareController.saveCodeFile);

module.exports = share;
