const express = require('express');
const router = express.Router();
const auth = require('./auth.route'),
  share = require('./share.route');

const { verifyUserToken, verifyUserRequestQueryId } = require('../middlewares/user.middleware');

router.use('/auth', auth);
router.use('/share', share);

module.exports = router;
