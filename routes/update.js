var router = require('express').Router();
var waitSession = require(__dirname+'/../config/wait-save.js');

module.exports = function (User) {
  router.post('/*', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/auth'); }
    if (req.user.permissionLevel < 10) { return res.render('error/error', {
      title: 'Insufficient permissions',
      message: 'Sorry. You need permission level greater than 9 to update users',
      link: '/',
      linkText: 'Take me Home'
    }); }
    console.log(req.body);
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
