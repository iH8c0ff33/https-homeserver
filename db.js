var Sequelize = require('sequelize');
var crypto    = require('crypto');
var db        = new Sequelize('postgres://www@localhost:5432/homeserver');
var User = require(__dirname+'/models/user.js')(Sequelize, db);
User.sync({ force: true }).then(function () {
  crypto.randomBytes(32, function (err, salt) {
    crypto.pbkdf2('prova', salt, 4096, 512, 'sha256', function (err, hash) {
      User.create({
        username: 'daniele',
        salt: salt,
        permissionLevel: 10
      }).then(function () {
        console.log('success fired');
      }, function (err) {
        console.log('error fired');
        console.log(err);
        var errors = err.errors;
        for (var index = 0, last = errors.length; index < last; index++) {
          console.log(errors[index].path);
        }
      });
    });
  });
});
