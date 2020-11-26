require('dotenv').config();
const { isArray } = require('lodash');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { getToken } = require('../utils/jwt.utils');

// config pour convertir les fichiers en pdf
const CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
// Configure API key authorization: Apikey
const Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = process.env.CLOUD_MERSIVE_API_KEY;
const apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();
//

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
      ? res.status(400).json({
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

exports.sendFileNames = (req, res) => {
  //TODO: masquer le répertoire /tmp

  // récupérer l'email avec le token pour accéder au dossier utilisateur
  const { email } = getToken(req.headers.authorization);
  const pathname = `./uploads/${email}/`;
  try {
    const files = fs.readdirSync(pathname);
    return res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des fichiers' });
  }
};

exports.sendFile = async (req, res) => {
  // récupérer l'email avec l'id du paramètre de la requete pour accéder au dossier utilisateur
  const { email } = getToken(req.headers.authorization);
  console.log('email: ', email);
  const pathname = `./uploads/${email}/${req.params.filename}`;

  try {
    const ext = path.extname(pathname);
    if (ext !== '.pdf') {
      const tmpPathname = `./uploads/${email}/tmp/${req.params.filename}.pdf`;

      const inputFile = Buffer.from(fs.readFileSync(pathname).buffer); // File | Input file to perform the operation on.
      const callback = function (error, data, response) {
        if (error) {
          console.error(error);
        } else {
          fs.writeFileSync(tmpPathname, data);
          // récupération du fichier
          const file = fs.readFileSync(tmpPathname, { encoding: 'base64' });
          // suppression du fichier
          fs.unlinkSync(tmpPathname);
          return res.status(200).json(file);
        }
      };
      apiInstance.convertDocumentAutodetectToPdf(inputFile, callback);
      return;
    } else {
      const file = fs.readFileSync(pathname, { encoding: 'base64' });
      return res.status(200).json(file);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors de la récupération du fichier' });
  }
};
