require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, {
      pass: process.env.DB_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('MongoDB connecté');
  } catch (error) {
    console.log('Erreur lors de la connexion à MongoDB : ' + error);
  }
})();

module.exports = mongoose;
