////////////////////
// Login Strategy //
////////////////////
var LocalStrategy  = require('passport-local').Strategy;
var crypto         = require('crypto');

module.exports = function (User) {
  var myStrategy = new LocalStrategy({ passReqToCallback: true }, function (req, username, password, done) {
    User.findOne({ where: { username: username } }).then(function (user) {
      if (!user) { return done(null, false, req.flash('login-error', 'Oops! This username isn\'t registered.')); }
      crypto.pbkdf2(password, user.salt, 4096, 512, 'sha256', function (err, hash) {
        if (err) { throw err; }
        if (hash.toString('hex') == user.passwordHash.toString('hex')) {
          return done(null, user); } else { return done(null, false, req.flash('login-error', 'Oops! Wrong password.'));
        }
      });
    }, function (err) { return next(err); });
  });
  return myStrategy;
};
