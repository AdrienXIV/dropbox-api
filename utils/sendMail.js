require('dotenv').config();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

// Create a SMTP transport object
const transport = nodemailer.createTransport({
  service: 'Gmail',
  host: ' smtp.gmail.com',
  port: 465,
  secure: true, // upgrade later with STARTTLS  host: "smtp.gmail.com",
  tls: {
    ciphers: 'SSLv3',
  },
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
// verify connection configuration
transport.verify(function (error, success) {
  if (error) {
    console.error('Echec lors de la connexion à GMAIL avec Nodemailer');
  } else {
    console.log('Nodemailer prêt');
  }
});
/*
const message = {
  from: `Groupe 6 - IMIE <${process.env.EMAIL_USER}>`, // sender address
  to: 'adri_00@hotmail.fr', // list of receivers
  subject: 'Hello ✔', // Subject line
  text: 'Hello world?', // plain text body
  html: '<b>Hello world?</b>', // html body
};
// envoie du mail
transport.sendMail(message, function (error) {
  if (error) {
    console.log('Error mail');
    console.log(error.message);
    return;
  }
  // if you don't want to use this transport object anymore, uncomment following line
  transport.close(); // close the connection pool
});
*/
exports.transport = transport;
