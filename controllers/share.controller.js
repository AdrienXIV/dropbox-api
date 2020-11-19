const { isArray } = require('lodash');
const _ = require('lodash');
const { getToken } = require('../utils/jwt.utils');

exports.uploadFiles = (req, res) => {
  if (!req.files?.myFiles) return res.status(400).json({ error: 'Aucun fichier' });
  // récupérer l'email avec le token pour accéder au dossier utilisateur
  const { email } = getToken(req.headers.authorization);
  const path = `./uploads/${email}/`;

  // récupération de tous les fichiers s'il y'en a plusieurs
  if (isArray(req.files.myFiles)) {
    _.forEach(_.keysIn(req.files.myFiles), key => {
      let myFiles = req.files.myFiles[key];

      //move photo to uploads directory
      myFiles.mv(path + myFiles.name, error => {
        if (error) res.status(500).json({ error: 'Problème lors de la récupération des fichiers' });
        return;
      });
    });
  } else {
    let myFiles = req.files.myFiles;

    //move photo to uploads directory
    myFiles.mv(path + myFiles.name, error => {
      if (error) res.status(500).json({ error: 'Problème lors de la récupération du fichier' });
      return;
    });
  }
  res.sendStatus(201);
};
