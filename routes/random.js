var router          = require('express').Router();
var crypto          = require('crypto');
var waitSession     = require(__dirname+'/../config/wait-save.js');
var isAuthenticated = require(__dirname+'/../config/checkauth.js');
var isOwner         = require(__dirname+'/../config/checkowner.js');

module.exports = function (User) {
  router.get('/*', isAuthenticated, isOwner, function (req, res, next) {
    User.findOne({ where: { username: req.url.slice(1) } }).then(function (user) {
      if (!user) { return res.send('user not found'); }
      crypto.randomBytes(6, function (err, passwordHex) {
        if (err) { return next(err); }
        var password = passwordHex.toString('hex');
        crypto.randomBytes(32, function (err, salt) {
          crypto.pbkdf2(password, salt, 4096, 512, 'sha256', function (err, hash) {
            user.update({
              passwordHash: hash,
              salt: salt
            }).then(function (user) {
              req.flash('update-message', user.username+' updated with random password:  '+password);
              return waitSession(req, res, next, function (err) {
                if (err) { return next(err); }
                res.redirect('/user/manage'+req.url);
              });
            });
          });
        });
      });
    });
  });
  return router;
}
