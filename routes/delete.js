var router = require('express').Router();
var waitSession = require(__dirname+'/../config/wait-save.js');

module.exports = function (User) {
  router.get('/*', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/auth'); }
    if (req.user.permissionLevel < 10) { return res.render('error/error', {
      title: 'Insufficient permissions',
      message: 'Sorry. You need permission level greater than 9 to delete users',
      link: '/',
      linkText: 'Take me Home'
    }); }
    User.findOne({ where: { username: req.url.slice(1) } }).then(function (user) {
      if (!user) {
        req.flash('list-error', 'Sorry. Username not found');
        return waitSession(req, res, next, function (err) {
          if (err) { return next(err); }
          res.redirect('/user/manage#list');
        });
      }
      user.destroy().then(function () {
        req.flash('list-message', 'User '+req.url.slice(1)+' was successfully deleted');
        return waitSession(req, res, next, function (err) {
          if (err) { return next(err); }
          res.redirect('/user/manage#list');
        });
      });
    });
  });
  return router;
}
