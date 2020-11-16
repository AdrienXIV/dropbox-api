//imports
const express = require('express');
const uploadsController = require('../controllers/uploads.controller');

//routes
const uploads = express.Router();
//users routes
uploads.post('/uploads', uploadsController.listfile);

module.exports = uploads;