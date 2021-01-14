require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.generateTokenForUser = user => {
  return jwt.sign(
    {
      sub: Math.sqrt(Math.pow(Math.PI, Math.exp(Math.PI))),
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SIGN_SECRET,
    {
      expiresIn: '24h',
      algorithm: 'HS384',
    },
  );
};

exports.checkToken = token => {
  try {
    const decoded = jwt.verify(token.split('Baerer ')[1], process.env.JWT_SIGN_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

exports.getToken = token => {
  try {
    return jwt.verify(token.split('Baerer ')[1], process.env.JWT_SIGN_SECRET);
  } catch (error) {
    return false;
  }
};
