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
parseAuthorization = (authorization) => {
  return (authorization != undefined) ? authorization.replace('Bearer ','') : null;
}
exports.getUserEmail = authorization => {
  var userEmail = '';
  var verifyToken = parseAuthorization(authorization);
  if(verifyToken != null){
    try{
      const jwtToken =jwt.verify(verifyToken, process.env.JWT_SIGN_SECRET);
      if(jwtToken != null)
        userEmail = jwtToken.email;
    }catch(err) {}
  }
  return userEmail;
}
