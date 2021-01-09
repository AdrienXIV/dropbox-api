const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const token = require('../utils/jwt.utils');
const { getToken } = require('../utils/jwt.utils');
const { sendMailRegister, sendMailForgotPassword } = require('../utils/mail');
const randomstring = require('randomstring');
const { fstat } = require('fs-extra');
const fs = require('fs');
const rimraf = require('rimraf');

exports.register = (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirm = req.body.confirm;
  const pathname = `./uploads/${email}/`;

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
      // création dossier
      fs.mkdirSync(pathname);
      // réponse serveur
      res.status(201).json({ token: token.generateTokenForUser(user) });
    })
    .catch(error => {
      console.error(error);
      if (error.code === 400) res.status(400).json({ error: 'Utilisateur déjà existant' });
      // erreur serveur
      else res.status(500).json({ error: 'Un problème avec le serveur est survenu' });
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
        res.status(400).json({ error: 'Couple email / mot de passe invalide' });
      }
    })
    .catch(error => {
      console.error(error);
      if (error.code === 404) res.status(404).json({ error: "L'utilisateur n'existe pas" });
      // erreur serveur
      else res.status(500).json({ error: 'Un problème avec le serveur est survenu' });
    });
};

exports.forgotPassword = (req, res) => {
  const email = req.body.email;
  const str = randomstring.generate({
    length: 48,
    charset: 'alphanumeric',
  });
  //TODO: verifier l'email en base de donnée
  User.findOne({ email })
    .then(userfound => {
      if (!userfound) throw { code: 404 };
      myCache.set(str, String(email), 900); // 15min
      // envoi du lien de réinitialisation par mail
      sendMailForgotPassword(email, str);
      res.status(200).json({ message: 'un email vous a été envoyer sur votre adresse email' });
    })
    .catch(error => {
      console.error(error);
      if (error.code === 404) res.status(404).json({ error: "Utilisateur n'existe pas" });
      // erreur serveur
      else res.status(500).json({ error: "erreur lors de l'envoi du mail" });
    });
};

exports.resetPassword = (req, res) => {
  const str = req.body.str;
  const email = myCache.get(str);
  console.log('email: ', email);
  const password = req.body.password;
  const confirm = req.body.confirm;

  if (confirm !== password) return res.status(400).json({ error: 'Les mots de passe ne sont pas identiques' });

  let userDocument = {};
  User.findOne({ email })
    .then(user => {
      if (!user) throw { code: 404 };
      // sauvegarde du document user
      userDocument = user;
      // hash du mdp
      return bcrypt.hash(password, 10);
    })
    .then(hash => {
      // mis à jour du nouveau mdp
      return userDocument.set({ password: hash }).save();
    })
    .then(user => {
      // suppression de la valeur du cache quand le mdp est mis à jour
      myCache.del(str);
      res.sendStatus(201);
    })
    .catch(error => {
      console.error(error);
      if (error.code === 404) res.status(404).json({ error: 'Lien expiré' });
      else res.status(500).json({ error: 'Un problème avec le serveur est survenu' });
    });
};

//recupération des données de l'utilisateurs avec verification de token
exports.getprofil = (req, res) => {
  var headerAuth = req.headers['authorization'];
  var { email } = token.getToken(headerAuth);

  User.findOne({ email })
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
      else res.status(500).json({ error: 'Un problème avec le serveur est survenu' });
    });
};

exports.editprofil = (req, res, next) => {
  var headerAuth = req.headers['authorization'];
  var { email } = token.getToken(headerAuth);
  var username = req.body.username;
  User.findOne({ email })
    .then(userfound => {
      if (!userfound) throw { code: 404 };
      return userfound.set(req.body).save();
    })
    .then(() => {
      res.status(201).json({ message: 'Profil modifié !' });
    })
    .catch(error => {
      if (error.code === 404) return res.status(404).json({ error: 'utilisateur innexistant' });
      else res.status(500).json({ error: 'Un problème avec le serveur est survenu' });
    });
};

exports.getEditUser = (req, res, next) => {
  const edit = req.query.edit;
  const { email } = getToken(req.headers.authorization);

  if (!edit) {
    return res.redirect('/');
  }
  const emailuser = req.params.email;
  User.findOne(emailuser)
    .then(user => {
      if (!user) {
        return res.redirect('/');
      }
      return res.status(200).json(user);
    })
    .catch(error => res.status(400).json({ error }));
};

exports.postEditUser = (req, res, next) => {
  User.updateOne({ emailuser: req.params.email }, { ...req.body, emailuser: req.params.email })
    .then(() => res.status(200).json({ message: 'profil modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteProfile = (req, res) => {
  const { email } = token.getToken(req.headers.authorization);
  const pathname = `./uploads/${email}/`;
  User.findOne({ email })
    .then(user => {
      if (!user) throw { code: 404 };
      return user.remove();
    })
    .then(() => {
      rimraf.sync(pathname);
      return res.status(201).json({ message: 'Profil supprimé !' });
    })
    .catch(error => {
      console.error(error);
      if (error.code === 404) res.status(404).json({ error: 'Utilisateur inexistant' });
      else res.status(500).json({ error: 'Un problème avec le serveur est survenu' });
    });
};
