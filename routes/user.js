/////////////////
// User router //
/////////////////
var router = require('express').Router();
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
    res.send(req.body);
  })
  return router;
};
