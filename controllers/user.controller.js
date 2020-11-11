const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwttoken = require('../utils/jwt.utils');

exports.register = (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirm = req.body.confirm;
  // verifier si les deux mot de passe sont pareils
  if(confirm!= password){
    return res.status(400).json({'error': 'please put the same password'});
  }
  //rechercher si la personne exist dans la base
    // inserer un utilisateur et criptez mot de passe

  User.findOne({
    email : email 
},function(error,userfound){
      if(!userfound){
          bcrypt.hash(password, 5, function(err, bcryptedPassword){
              const newUser = User.create({
                  email: email,
                  username: username,
                  password: bcryptedPassword,
                  confirm: confirm,
              })

              .then(function(newUser){
                  return res.status(201).json({message: 'user insert correctly'});
              })
              .catch(function(err) {
                  return res.status(500).json({'error':'cannot add user'});
              });
              });
        }else{
        return res.status(409).json({'error': 'user already exist'});
        }
  }
);

}

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    email : email,
    },function(error,userfound){
        if(userfound){
          bcrypt.compare(password,userfound.password,function(errBycrip,resBycript){
            if(resBycript){
              return res.status(200).json({
                  message : 'user exist',
                  'token' : jwttoken.generateTokenForUser(userfound)
              });
            }else{
              return res.status(400).json({'error': 'invalid password'});
            }
          });
        }else{
          return res.status(400).json({'error': 'connexion echoué'});

        }
    })
  
}
