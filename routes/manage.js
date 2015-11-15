var router = require('express').Router();

module.exports = function (User) {
  /////////////
  // /manage //
  /////////////
  router.get('/', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/auth'); }
    if (req.user.permissionLevel < 6) { return res.render('error/error', {
      title: 'Insufficient permission',
      message: 'Sorry. You need permission level greater than 5 to view this page.',
      link: '/',
      linkText: 'Take me Home'
    }); }
    User.findAll().then(function (users) {
      res.render('user/manage', { user: req.user, users: users, listError: req.flash('list-error'), listMessage: req.flash('list-message') ,createError: req.flash('create-error'), createMessage: req.flash('create-message') });
    });
  });
  ////////
  // /* //
  ////////
  router.get('/*', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/auth'); }
    if (req.user.permissionLevel < 10) { return res.render('error/error', {
      title: 'Insufficient Permission',
      message: 'Sorry. You need permission level greater than 9 to view this page.',
      link: '/',
      linkText: 'Take me Home'
    }); }
    User.findOne({ where: { username: req.url.slice(1) } }).then(function (user) {
      if (!user) { return res.send('user not found'); }
      return res.render('user/manage-user', { user: req.user, manageUser: user, updateError: req.flash('update-error'), updateMessage: req.flash('update-message') });
    }, function (err) {
      return next(err);
    });
  });
  return router;
};
