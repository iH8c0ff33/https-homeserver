var Sequelize = require('sequelize');
var crypto    = require('crypto');
var db        = new Sequelize('postgres://www@localhost:5432/homeserver');
var User = db.define('users', {
  username: {
    type: Sequelize.STRING(24),
    unique: true,
    allowNull: false
  },
  passwordHash: {
    type: Sequelize.BLOB,
    allowNull: false
  },
  salt: {
    type: Sequelize.BLOB,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
User.sync({ force: true }).then(function () {
  crypto.randomBytes(32, function (err, salt) {
    crypto.pbkdf2('prova', salt, 4096, 512, 'sha256', function (err, hash) {
      User.create({
        username: 'daniele',
        passwordHash: hash,
        salt: salt,
        email: 'daniele.monteleone.it@gmail.com'
      }).then(function () {return;});
    });
  });
});
