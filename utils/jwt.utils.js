require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.generateTokenForUser = user => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SIGN_SECRET,
    {
      expiresIn: '12h',
    },
  );
};

exports.getToken = token => {
  try {
    return jwt.verify(token.split('Baerer ')[1], process.env.JWT_SIGN_SECRET);
  } catch (error) {
    return false;
  }
};