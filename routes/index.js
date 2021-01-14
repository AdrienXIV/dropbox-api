const express = require('express');
const router = express.Router();
const auth = require('./auth.route'),
  share = require('./share.route'),
  user = require('./users.route');

const { verifyUserToken } = require('../middlewares/user.middleware');

router.use('/auth', auth);
router.use('/share', verifyUserToken, share);
router.use('/user', verifyUserToken, user);

module.exports = router;
