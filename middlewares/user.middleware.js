const User = require('../models/user.model');
const { checkToken } = require('../utils/jwt.utils');

exports.verifyUserToken = (req, res, next) => {
  if (!req.headers.authorization) res.sendStatus(401);
  else if (!checkToken(req.headers.authorization)) res.sendStatus(403);
  else next();
};
exports.verifyUserRequestQueryId = async (req, res, next) => {
  /*const id = req.query.id;
  const email = myCache.get(id);
  if (!id) return res.sendStatus(401);
  const user = await User.findOne({ email });
  return !user ? res.sendStatus(403) : next();*/
  next();
};
