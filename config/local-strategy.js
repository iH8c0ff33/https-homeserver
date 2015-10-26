////////////////////
// Local Strategy //
////////////////////
var LocalStrategy  = require('passport-local').Strategy;
var crypto         = require('crypto');

module.exports = function (User) {
  var myStrategy = new LocalStrategy(function (username, password, done) {
    User.findOne({ where: { username: username } }).then(function (user) {
      if (!user) { return done(null, false, {message: 'wrong username'}); }
      crypto.pbkdf2(password, user.salt, 4096, 512, 'sha256', function (err, hash) {
        if (err) { throw err; }
        if (hash.toString('hex') == user.passwordHash.toString('hex')) {
          return done(null, user); } else { return done(null, false, req.flash('login-error', 'wrong password'));
        }
      });
    }, function (err) { return done(null, false, req.flash('login-error', 'wrong username')); });
  });
  return myStrategy;
};
