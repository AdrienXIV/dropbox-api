const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'iu0aMCsaepPy6ULphSX5PT32oPvKkM5dPl131knIDq9Cr8OUzzACsuBnpSJ_rE9XkGjmQVawcvyCHLiM4Kr6NA';

exports.generateTokenForUser = user => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    JWT_SIGN_SECRET,
    {
      expiresIn: '12h',
    },
  );
};
