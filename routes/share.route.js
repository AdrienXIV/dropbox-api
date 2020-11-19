//imports
const express = require('express');
const shareController = require('../controllers/share.controller');

const _ = require('lodash');
//routes
const share = express.Router();

/**
 * GET
 */

/**
 * POST
 */
share.post('/new', (req, res) => {
  let path = './uploads/';
  let data = [];
  //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
  //let file = req.files.photos;
  //loop all files
  _.forEach(_.keysIn(req.files.photos), key => {
    console.log(key);
    let photo = req.files.photos[key];

    //move photo to uploads directory
    photo.mv('./uploads/' + photo.name);

    //push file details
    data.push({
      name: photo.name,
      mimetype: photo.mimetype,
      size: photo.size,
    });
  });

  //send response
  res.send({
    status: true,
    message: 'File is uploaded',
    data,
  });
});

/**
 * PATCH
 */

module.exports = share;
