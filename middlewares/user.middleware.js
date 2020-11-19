const { checkToken } = require('../utils/jwt.utils');

exports.verifyUserToken = (req, res, next) => {
  if (!req.headers.authorization) res.sendStatus(401);
  if (!checkToken(req.headers.authorization)) res.sendStatus(403);
  next();
};
