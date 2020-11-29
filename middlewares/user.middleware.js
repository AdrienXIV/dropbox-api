const User = require('../models/user.model');
const { checkToken } = require('../utils/jwt.utils');

exports.verifyUserToken = (req, res, next) => {
  if (!req.headers.authorization) res.sendStatus(401);
  else if (!checkToken(req.headers.authorization)) res.sendStatus(403);
  else next();
};
