/////////////////////
// Signup Strategy //
/////////////////////
var LocalStrategy  = require('passport-local').Strategy;
var crypto         = require('crypto');

module.exports = function (User) {
  var myStrategy = new LocalStrategy({ passReqToCallback: true }, function (req, username, password, done) {
    User.findOne({ where: { username: username } }).then(function (user) {
      if (user) { req.flash('register-error', 'username already taken'); return done(null, false)} else {
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
              return done(null, false, req.flash('register-error', 'email already taken'));
            });
          });
        });
      }
    }, function (err) { return done(err); });
  });
  return myStrategy;
};
