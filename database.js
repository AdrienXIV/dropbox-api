require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, {
  pass: process.env.DB_PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connecté');
});

module.exports = mongoose;
