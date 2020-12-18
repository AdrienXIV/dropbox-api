const express = require('express');
const { route } = require('./auth.route');
const router = express.Router();
const auth = require('./auth.route'),
  share = require('./share.route');

const { verifyUserToken } = require('../middlewares/user.middleware');

router.use('/auth', auth);
router.use('/share', verifyUserToken, share);

module.exports = router;
