/////////////////////
// Signup Strategy //
/////////////////////
var LocalStrategy  = require('passport-local').Strategy;
var crypto         = require('crypto');

module.exports = function (User) {
  var myStrategy = new LocalStrategy('local-signup', { passReqToCallback: true }, function (req, username, password, done) {
    User.findOne({ where: { username: username } }).then(function (user) {
      if (user) { return done(null, false, req.flash('signup-error', 'email already taken'))} else {
        crypto.randomBytes(32, function (err, salt) {
          if (err) { throw err; }
          crypto.pbkdf2(password, salt, 4096, 512, 'sha256', function (err, hash) {
            User.create({
              username: username,
              passwordHash: hash,
              salt: salt,
              email: req.body.email,
              permissionLevel: 0
            }).then(function (user) {
              return done(null, user);
            }, function (err) {
              return done(null, false);
            });
          });
        });
      }
    }, function (err) { return done(err); });
  });
};
