require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

// cache
const NodeCache = require('node-cache');
global.myCache = new NodeCache();

// DB connexion
global.bdd = require('./database');

// PORT
 const PORT= process.env.PORT || (process.argv[2] || 5000);

// routes
const routes = require('./routes');

// MIDDLEWARE
// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  }),
);
const corsOptions = {
  origin: 'https://groupe6-imie.ddns.net',
  optionsSuccessStatus: 200, // For legacy browser support
};
//add other middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors
app.use(cors());
app.use(routes);

// LANCEMENT SERVEUR
try {
  if(!module.parent){ 
  http.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
    // initialisation de nodemailer
    require('./utils/mail').nodeMailerConnection();
    // création du répertoire de stockage s'il n'existe pas
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('uploads');
    }
  });
}
} catch (error) {
  console.error(error);
}

app.get('/', (req, res) => {
  res.status(200).send('Groupe 6');
});
module.exports = app;
