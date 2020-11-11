const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'iu0aMCsaepPy6ULphSX5PT32oPvKkM5dPl131knIDq9Cr8OUzzACsuBnpSJ_rE9XkGjmQVawcvyCHLiM4Kr6NA';
 
module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData.id
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    }
}