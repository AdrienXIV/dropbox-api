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
  if (password.length < 6) {
    res.status(400).json({ error: 'Mot de passe trop court' });
  }
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
      res.status(201).json({ message: 'Utilisateur inséré en base de données' });
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
      console.log(userDocument);
      return bcrypt.compare(password, userfound.password);
    })
    .then(resBycript => {
      if (resBycript) {
        res.status(200).json({
          message: 'user exist',
          token: token.generateTokenForUser(userDocument),
        });
      } else {
        res.status(400).json({ error: 'invalid password' });
      }
    })
    .catch(error => {
      console.error(error);
      if (error.code === 404) res.status(404).json({ error: "Utilisateur n'existe pas" });
      // erreur serveur
      else res.status(500).json({ error });
    });
};

exports.forgotPassword = (req, res) => {
  const str = randomstring.generate({
    length: 48,
    charset: 'alphanumeric',
  });
  myCache.set(str, String(req.body.email), 900); // 15min
  // envoi du lien de réinitialisation par mail
  sendMailForgotPassword(req.body.email, str);
  res.sendStatus(200);
};

exports.resetPassword = (req, res) => {
  console.log(req.params.str);
  const email = myCache.get(req.params.str);
  let userDocument = {};
  console.log(myCache.getStats());
  User.findOne({ email })
    .then(user => {
      if (!user) throw { code: 404 };
      userDocument = user;
      return bcrypt.hash(req.body.password, 10);
    })
    .then(hash => {
      return userDocument.set({ password: hash }).save();
    })
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.error(error);
      if (error.code === 404) res.status(404).json({ error: 'Lien expiré' });
      else res.status(500).json({ error });
    });
};
