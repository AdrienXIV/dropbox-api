require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// cache
const NodeCache = require('node-cache');
global.myCache = new NodeCache();

// DB connexion
global.bdd = require('./database');

// PORT
const PORT = process.env.PORT || 5000;

// routes
const routes = require('./routes/');

// MIDDLEWARE

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  }),
);
//add other middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// routes
app.use(routes);

// LANCEMENT SERVEUR
try {
  http.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
    // initialisation de nodemailer
    require('./utils/mail').nodeMailerConnection();
  });
} catch (error) {
  console.error(error);
}

app.get('/', (req, res) => {
  res.status(200).send('Groupe 6');
});
