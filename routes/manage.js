var router = require('express').Router();

module.exports = function (User) {
  /////////////
  // /manage //
  /////////////
  router.get('/', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/permission'); }
    if (req.user.permissionLevel < 6) { return res.render('error/error', {
      title: 'Insufficient Permission',
      message: 'Sorry. You need permission level greater than 5 to view this page.',
      link: '/',
      linkText: 'Take Me Home'
    }); }
    User.findAll().then(function (users) {
      res.render('user/manage', { user: req.user, users: users });
    });
  });
  ////////
  // /* //
  ////////
  router.get('/*', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/permission'); }
    if (req.user.permissionLevel < 10) { return res.render('error/error', {
      title: 'Insufficient Permission',
      message: 'Sorry. You need permission level greater than 9 to view this page.',
      link: '/',
      linkText: 'Take Me Home'
    }); }
    User.findOne({ where: { username: req.url.slice(1) } }).then(function (user) {
      return res.render('user/manage-user', { user: req.user, manageUser: user });
    }, function (err) {
      return next(err);
    });
  });
  return router;
};
