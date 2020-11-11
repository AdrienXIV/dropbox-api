var bcrypt = require('bcrypt');
var models = require('../models/user.model');

exports.register = (req, res) => {
  console.log(req.body);

  res.status(200).json({ message: 'ça marche' });
};

exports.login = (req, res) => {};
