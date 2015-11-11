/////////////////
// User router //
/////////////////
var router = require('express').Router();
var crypto = require('crypto');
var waitSession = require(__dirname+'/../config/wait-save.js');

module.exports = function (User) {
  router.use('/manage', require(__dirname+'/manage.js')(User));
  //////////////
  // /account //
  //////////////
  router.get('/account', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/auth'); }
    res.render('user/account', { user: req.user, session: req.session, error: req.flash('password-error') });
  });
  //////////////////////
  // /change-password //
  //////////////////////
  router.post('/change-password', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/auth'); }
    var error = false;
    if (!req.body.oldpassword) { req.flash('password-error', 'Sorry. Old password field seems to be blank.'); error = true; }
    if (!req.body.newpassword) { req.flash('password-error', 'Sorry. New password field seems to be blank.'); error = true; }
    if (req.body.newpassword != req.body.confirmpassword) { req.flash('password-error', 'Sorry. New passwords don\'t match'); error = true; }
    if (error) {
      return waitSession(req, res, next, function (err) {
        if (err) { return next(err); }
        res.redirect('/user/account');
      });
    }
    crypto.pbkdf2(req.body.oldpassword, req.user.salt, 4096, 512, 'sha256', function (err, hash) {
      if (err) { return next(err); }
      console.log(hash);
      console.log(req.user.passwordHash);
      if (hash.equals(req.user.passwordHash)) {
        crypto.randomBytes(32, function (err, salt) {
          if (err) { return next(err); }
          crypto.pbkdf2(req.body.newpassword, salt, 4096, 512, 'sha256', function (err, hash) {
            User.findOne({ where: { username: req.user.username } }).then(function (user) {
              user.update({
                salt: salt,
                passwordHash: hash
              }).then(function (user) {
                req.session.regenerate(function () {
                  req.flash('login-message', 'You password was changed successfully, you need to login now.');
                  return waitSession(req, res, next, function (err) {
                    if (err) { return next(err); }
                    res.redirect('/login');
                  });
                });
              });
            });
          });
        });
      } else {
        req.flash('password-error', 'Sorry. Inserted old password isn\'t correct.');
        return waitSession(req, res, next, function (err) {
          if (err) { return next(err); }
          res.redirect('/user/account');
        });
      }
    });
  });
  return router;
};
