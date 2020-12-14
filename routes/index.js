const express = require('express');
const { route } = require('./auth.route');
const router = express.Router();
const auth = require('./auth.route');
const user = require('./users.route');

//const uploads = require('./uploads.route');


router.use('/auth', auth);
router.use('/user', user);

//router.use('/uploads',uploads);

module.exports = router;
