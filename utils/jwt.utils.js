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
exports.parseAuthorization = (authorization ) => {
  return (authorization != null) ? authorization.replace('Bearer ','') : null;
}
exports.getUserEmail = authorization => {
  var userEmail = '';
  var verifyToken = exports.parseAuthorization(authorization);
  if(verifyToken != null){
    try{
      const jwtToken =jwt.verify(verifyToken, process.env.JWT_SIGN_SECRET);
      if(jwtToken != null)
        userEmail = jwtToken.userEmail;
    }catch(err) {}
  }
  return userEmail;
}
