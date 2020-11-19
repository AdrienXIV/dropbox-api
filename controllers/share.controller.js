const _ = require('lodash');

exports.uploadFiles = (req, res) => {
  // récupérer l'email avec le token pour accéder au dossier utilisateur
  const name = req.headers.name;
  const path = `./uploads/${name}/`;
  //loop all files
  _.forEach(_.keysIn(req.files.myFiles), key => {
    let myFiles = req.files.myFiles[key];

    //move photo to uploads directory
    myFiles.mv(path + myFiles.name, error => {
      if (error) res.status(500).json({ error });
      return;
    });
  });
  res.sendStatus(201);
};
