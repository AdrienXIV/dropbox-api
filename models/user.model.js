const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const User = new Schema(
  {
    email: {
      type: String,
      match: [/\S+@\S+.\S+/, 'courriel invalide'],
      required: [true, 'courriel manquant'],
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, 'mot de passe manquant'],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('users', User);
