require('dotenv').config();
const { isArray, values } = require('lodash');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { getToken } = require('../utils/jwt.utils');
const libre = require('libreoffice-convert');
const codeExtension = ['.html', '.js', '.css', '.sql', '.php', 'ts', '.json', '.xml'];
const extensions = [
  {
    ext: '.pdf',
    type: 'application/pdf',
  },
  { ext: '.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { ext: '.doc', type: 'application/msword' },
  { ext: '.xls', type: 'application/vnd.ms-excel' },
  { ext: '.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { ext: '.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  { ext: '.ppt', type: 'application/vnd.ms-powerpoint' },
  { ext: '.txt', type: 'text/html; charset=utf-8' },
  { ext: '.sh', type: 'text/html; charset=utf-8' },
  { ext: '.png', type: 'image/png' },
  { ext: '.PNG', type: 'image/png' },
  { ext: '.jpg', type: 'image/jpg' },
  { ext: '.jpeg', type: 'image/jpeg' },
  { ext: '.JPEG', type: 'image/jpeg' },
];
exports.uploadFiles = (req, res) => {
  // si l'utilisateur envoie aucun fichier
  if (!req.files?.myFiles) return res.status(400).json({ error: 'Aucun fichier' });

  const myFiles = req.files.myFiles;
  // récupérer l'email avec le token pour accéder au dossier utilisateur
  const { email } = getToken(req.headers.authorization);
  const pathname = `./uploads/${email}/`;

  // récupération de tous les fichiers s'il y'en a plusieurs
  if (isArray(myFiles)) {
    const errorFiles = [];

    _.forEach(_.keysIn(myFiles), key => {
      const file = myFiles[key];
      // déplacement des fichiers vers le répertoire de l'utilisateur
      file.mv(pathname + file.name, err => {
        if (err) errorFiles.push(file.name);
      });
    });
    // s'il y'a eu des erreurs
    return errorFiles.length > 0
      ? res.status(500).json({
          error: `Erreur lors du transfert des fichiers : ${errorFiles.join(', ')}`,
        })
      : res.status(201).json({ message: `${myFiles.length} fichiers transférés` });
  } else {
    const file = myFiles;
    // déplacement du fichier vers le répertoire de l'utilisateur
    file.mv(pathname + file.name, err => {
      return err
        ? res.status(500).json({ error: 'Problème lors de la récupération du fichier' })
        : res.status(201).json({ message: `1 fichier transféré` });
    });
  }
};

exports.uploadFolder = (req, res) => {
  // si l'utilisateur envoie aucun fichier
  if (!req.files?.myFiles) return res.status(400).json({ error: 'Aucun fichier' });

  const myFiles = req.files.myFiles;
  const filenames = req.body.names;
  const errorFiles = [];

  // récupérer l'email avec le token pour accéder au dossier utilisateur
  const { email } = getToken(req.headers.authorization);
  const pathname = `./uploads/${email}/`;
  myFiles.forEach((file, index) => {
    file.mv(pathname + filenames[index], err => {
      if (err) errorFiles.push(file.name);
    });
  });

  // s'il y'a eu des erreurs
  return errorFiles.length > 0
    ? res.status(500).json({
        error: `Erreur lors du transfert des fichiers : ${errorFiles.join(', ')}`,
      })
    : res.status(201).json({ message: `${myFiles.length} fichiers transférés` });
};

exports.sendFileNames = (req, res) => {
  // récupérer l'email avec le token pour accéder au dossier utilisateur
  const { email } = getToken(req.headers.authorization);
  const pathname = `./uploads/${email}/${req.query.path}`;

  const fileNames = [],
    dirNames = [];

  try {
    const files = fs.readdirSync(pathname);
    files.forEach((file, i) => {
      // on n'envoie pas le nom de dossier temporaire
      if (file !== 'tmp') {
        // on envoie que les noms de dossiers
        if (fs.lstatSync(`${pathname}${file}`).isDirectory()) dirNames.push(file);
        // on envoie que les noms de fichiers
        else fileNames.push(file);
      }
    });
    return res.status(200).json({ files: fileNames, dirs: dirNames });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des fichiers' });
  }
};

exports.sendFile = async (req, res) => {
  // récupérer l'email avec l'id du paramètre de la requete pour accéder au dossier utilisateur
  const { email } = getToken(req.headers.authorization);
  const pathname = `./uploads/${email}/${req.query.pathname}${req.params.filename}`;

  const codeExt = codeExtension.find(value => req.params.filename.search(value) !== -1);

  if (codeExt) {
    const file = fs.readFileSync(pathname, { encoding: 'utf8' });
    return res.status(200).json({ file, isCode: true, ext: codeExt.split('.')[1] });
  } else
    try {
      const ext = path.extname(pathname);
      if (ext !== '.pdf') {
        const file = fs.readFileSync(pathname);
        libre.convert(file, '.pdf', undefined, (err, done) => {
          if (err) {
            console.log(`Error converting file: ${err}`);
            throw { code: 500, message: 'Erreur lors de la lecture du fichier ' + req.params.filename };
          }
          return res.status(200).json({ file: done.toString('base64'), isCode: false });
        });
      } else {
        console.log('ext: ', ext);
        const file = fs.readFileSync(pathname, { encoding: 'base64' });
        return res.status(200).json({ file, isCode: false });
      }
    } catch (error) {
      console.error(error);
      if (error.code === 500) return res.status(500).json({ error: error.message });
      else return res.status(500).json({ error: 'Erreur lors de la récupération du fichier' });
    }
};

exports.saveCodeFile = (req, res) => {
  // récupérer l'email avec l'id du paramètre de la requete pour accéder au dossier utilisateur
  const { email } = getToken(req.headers.authorization);
  const data = req.body.code;
  const pathname = `./uploads/${email}/${req.body.path}`;
  const filename = pathname.split('/');
  try {
    fs.writeFileSync(pathname, data);
    res.status(200).json({ message: `Fichier ${filename[filename.length - 1]} enregistré !` });
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la sauvegarde du fichier ${filename[filename.length - 1]}` });
  }
};
