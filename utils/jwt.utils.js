var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'edfA1765RTGZERFGFazsdgtg456Gqsdffdc';
module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData.id
        })
        JWT_SIGN_SECRET,
        {
            expireIn: '1h'
        }
    }
}