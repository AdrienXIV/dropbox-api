const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const token = require('../utils/jwt.utils');
const { sendMailRegister, sendMailForgotPassword } = require('../utils/mail');
const randomstring = require('randomstring');

exports.register = (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirm = req.body.confirm;
<<<<<<< HEAD

=======
>>>>>>> c5936f1db909e1c72a913159a5e8306a07511fc2
  /*if (password.length < 6) {
    res.status(400).json({ error: 'Mot de passe trop court' });
  }*/
  // verifier si les deux mot de passe sont pareils
  if (confirm !== password) {
    res.status(400).json({ error: 'Les mots de passe ne sont pas identiques' });
  }
  //rechercher si la personne exist dans la base
  // inserer un utilisateur et criptez mot de passe

  User.findOne({ email })
    .then(user => {
      // si l'utilisateur existe on lève une exception
      if (user) throw { code: 400 };
      // sinon on encode son mdp
      return bcrypt.hash(password, 10);
    })
    .then(hash => {
      // création d'un nouvel utilisateur
      return new User({
        username,
        email,
        password: hash,
      }).save();
    })
    .then(user => {
      // envoi d'un mail
      sendMailRegister(user.email);
      // réponse serveur
      res
        .status(201)
        .json({ message: 'Utilisateur inséré en base de données', token: token.generateTokenForUser(user) });
    })
    .catch(error => {
      console.error(error);
      if (error.code === 400) res.status(400).json({ error: 'Utilisateur déjà existant' });
      // erreur serveur
      else res.status(500).json({ error });
    });
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let userDocument = {};
  User.findOne({ email })
    .then(userfound => {
      // si l'utilisateur n'existe pas on lève une exception
      if (!userfound) throw { code: 404 };
      userDocument = userfound;
      return bcrypt.compare(password, userfound.password);
    })
    .then(resBycript => {
      if (resBycript) {
        // génération d'un id public pour les requetes de l'utilisateur
        // afin de récupérer ses fichiers
        const str = randomstring.generate({
          length: 48,
          charset: 'alphanumeric',
        });
        myCache.set(str, String(email), 86400); // 24h comme le token
        res.status(200).json({
          token: token.generateTokenForUser(userDocument),
        });
      } else {
<<<<<<< HEAD
        res.status(400).json({ error: 'Couple courriel/mot de passe incorrects' });
=======
        res.status(400).json({ error: 'Couple email / mot de passe invalide' });
>>>>>>> c5936f1db909e1c72a913159a5e8306a07511fc2
      }
    })
    .catch(error => {
      console.error(error);
<<<<<<< HEAD
      if (error.code === 404) res.status(404).json({ error: 'Utilisateur inéxistant' });
=======
      if (error.code === 404) res.status(404).json({ error: "L'utilisateur n'existe pas" });
>>>>>>> c5936f1db909e1c72a913159a5e8306a07511fc2
      // erreur serveur
      else res.status(500).json({ error });
    });
};
//recupération des données de l'utilisateurs avec verification de token
exports.getprofil = (req, res) => {
  var headerAuth = req.headers['authorization'];
  var { email } = token.getToken(headerAuth);

  User.findOne({ email: email })
    .then(user => {
      if (!user) throw { code: 404 };
      const data = {
        username: user.username,
        email: user.email,
      };
      res.status(200).json(data);
    })
    .catch(error => {
      if (error.code === 404) res.status(404).json({ error: "L'utilisateur n'existe pas" });
      else res.status(500).json({ error: 'Erreur serveur' });
    });
};
exports.editprofil = (req, res, next) => {
  var headerAuth = req.headers['authorization'];
  var { email } = token.getToken(headerAuth);
  var username = req.body.username;
  User.findOne({ email })
  .then(userfound => {
    if(!userfound) throw { code: 404 };
    userfound.updateOne({username: username },{$set: req.body},(err , rep) =>{
      if(!err && rep!=null )
        res.status(200).json({message :'Profil Modifier'});
      else
        res.status(404).json({message: ' échec de Modification'})
    })
    .catch(error => res.status(400).json({ error: 'utilisateur non trouvé' }));
});
}
