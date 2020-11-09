require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// PORT
const PORT = process.env.PORT || 5000;

// MIDDLEWARE

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// cors
app.use(cors());

// LANCEMENT SERVEUR
try {
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
  });
} catch (error) {
  console.error(error);
}
