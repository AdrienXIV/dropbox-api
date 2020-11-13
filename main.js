require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');
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

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// cors
app.use(cors());
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
