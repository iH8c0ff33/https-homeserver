var Sequelize = require('sequelize');
var crypto = require('crypto');
var email = require('emailjs');
var db = new Sequelize('postgres://www@localhost:5432/homeserver');
var emailServer = email.server.connect({
  user: 'auth.homeserver@gmail.com',
  password: 'very!strong?password|',
  host: 'smtp.gmail.com',
  ssl: true
});

var Email = db.define('emails', {
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  permissionLevel: Sequelize.INTEGER
});
var Token = db.define('tokens', {
  refreshToken: {
    type: Sequelize.BLOB,
    unique: true
  }
});
var Session = db.define('sessions', {
  sessionToken: {
    type: Sequelize.BLOB,
    unique: true
  },
  validUntil: Sequelize.DATE
});
Email.hasMany(Token, { as: 'Tokens' });
Email.hasMany(Session, { as: 'Sessions' });

Email.sync({ force: true }).then(function () {
  Token.sync({ force: true });
  Session.sync({ force: true });
});
