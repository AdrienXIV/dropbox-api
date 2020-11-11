var bcrypt = require('bcrypt');
var models = require('../models');
var jwtutils = require('../utils/jwt.utils');


// routes

module.exports = {
    register: function(req, res)
    {
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword

        if(email == null || username == null || password == null){
            return res.status(400).json({'error': 'missing parameters'});
        }
        if(confirmPassword != password){
            return res.status(400).json({'error': 'password do not match'});
        }
        if(password.length < 6){
            return res.status(400).json({'error': 'password sould be at lease 6 characters' });
        }
    // verifie pseudo length mail regex , password 
        models.User.findOne({
            attributes : ['email'],
            where: {email : email}
        })
        .then(function(userfound){
            if(!userfound){
                bcrypt.hash(password, 5, function(err, bcryptedPassword){
                    var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: bcryptedPassword,
                        isAdmin: 0
                    })

                    .then(function(newUser){
                        return res.status(201).json({'userId': newUser.id});
                    })
                    .catch(function(err) {
                        return res.status(500).json({'error':'cannot add user'});
                    });
                    });
            }
            else{
            return res.status(409).json({'error': 'cannot add user'});
            }
         });
        },
    
    login: function(req, res)
    {
        var email = req.body.email;
        var password = req.body.password;
        if(email == null || password == null){
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.User.findOne({
            attributes : ['email'],
            where: {email : email}
        })
        .then(function(userfound){
        if(userfound){
            bcrypt.compare(password,userfound.password,function(errBycrip,resBycript){
                if(resBycript){
                    return res.status(200).json({
                        'userId' : newUser.id,
                        'token' : jwtutils.generateTokrnForUser(userfound)
                    });
                }else{
                    return res.status(400).json({'error': 'invalid password'});
                }
            });
        }else{
            return res.status(404).json({'error': 'user not exist'});
        }           
        })
        .catch(function (err) {
            return res.status(500).json({'error': ' unable to verify user'});
            
        });
    }
}
