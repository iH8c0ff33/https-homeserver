var router          = require('express').Router();
var waitSession     = require(__dirname+'/../config/wait-save.js');
var isAuthenticated = require(__dirname+'/../config/checkauth.js');
var isOwner         = require(__dirname+'/../config/checkowner.js');

module.exports = function (User) {
  router.post('/*', isAuthenticated, isOwner, function (req, res, next) {
    var error = false;
    if (!req.body.newemail) { req.flash('update-error', 'Sorry. New email field cannot be blank.'); error = true }
    if (!req.body.permissionLevel) { req.flash('update-error', 'Sorry. New permission level field cannot be blank.'); error = true; }
    if (error) {
      return waitSession(req, res, next, function (err) {
        if (err) { return next(err); }
        res.redirect('/user/manage/'+req.url.slice(1));
      });
    }
    User.findOne({ where: { username: req.url.slice(1) } }).then(function (user) {
      if (!user) { return res.send('user not found'); }
      user.update({
        email: req.body.newemail,
        permissionLevel: req.body.permissionLevel
      }).then(function (user) {
        req.flash('update-message', 'Successfully updated user '+user.username);
        return waitSession(req, res, next, function (err) {
          if (err) { return next(err); }
          res.redirect('/user/manage/'+req.url.slice(1));
        });
      }, function (err) {
        req.flash('update-error', 'Sorry. This email is already taken.');
        return waitSession(req, res, next, function (err) {
          if (err) { return next(err); }
          res.redirect('/user/manage/'+req.url.slice(1));
        });
      });
    })
  });
  return router;
}
