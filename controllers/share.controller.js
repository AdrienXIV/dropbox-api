const { isArray } = require('lodash');
const _ = require('lodash');
const fs = require('fs');
const { getToken } = require('../utils/jwt.utils');

exports.uploadFiles = (req, res) => {
  // si l'utilisateur envoie aucun fichier
  if (!req.files?.myFiles) return res.status(400).json({ error: 'Aucun fichier' });

  const myFiles = req.files.myFiles;
  // récupérer l'email avec le token pour accéder au dossier utilisateur
  const { email } = getToken(req.headers.authorization);
  const path = `./uploads/${email}/`;

  // récupération de tous les fichiers s'il y'en a plusieurs
  if (isArray(myFiles)) {
    const errorFiles = [];

    _.forEach(_.keysIn(myFiles), key => {
      const file = myFiles[key];
      // déplacement des fichiers vers le répertoire de l'utilisateur
      file.mv(path + file.name, err => {
        if (err) errorFiles.push(file.name);
      });
    });
    // s'il y'a eu des erreurs
    return errorFiles.length > 0
      ? res.status(400).json({ error: `Erreur lors du transfert des fichiers : ${errorFiles.join(', ')}` })
      : res.status(201).json({ message: `${myFiles.length} fichiers transférés` });
  } else {
    const file = myFiles;
    // déplacement du fichier vers le répertoire de l'utilisateur
    file.mv(path + file.name, err => {
      return err
        ? res.status(500).json({ error: 'Problème lors de la récupération du fichier' })
        : res.status(201).json({ message: `1 fichier transféré` });
    });
  }
};

exports.sendFileNames = (req, res) => {
  // récupérer l'email avec le token pour accéder au dossier utilisateur
  const { email } = getToken(req.headers.authorization);
  const path = `./uploads/${email}/`;
  try {
    const files = fs.readdirSync(path);
    return res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des fichiers' });
  }
};
