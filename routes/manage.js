var router = require('express').Router();

module.exports = function (User) {
  ////////
  // /* //
  ////////
  router.get('/*', function (req, res, next) {
    if (!req.user) { return res.redirect('/authenticate'); }
    if (req.user.permissionLevel < 10) { return res.render('error', {
      title: 'Insufficient Permission',
      message: 'Sorry. You need permission level greater than 9 to view this page.',
      link: '/',
      linkText: 'Take Me Home'
    }); }
    User.findOne({ where: { username: req.url.slice(1) } }).then(function (user) {
      return res.render('manage-user', { user: req.user, manageUser: user });
    }, function (err) {
      return next(err);
    });
  });
  return router;
};
