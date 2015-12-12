var router          = require('express').Router();
var isAuthenticated = require(__dirname+'/../config/checkauth.js');
var isOwner         = require(__dirname+'/../config/checkowner.js');

module.exports = function (User) {
  // GET /user/manage
  router.get('/', isAuthenticated, isOwner, function (req, res, next) {
    User.findAll().then(function (users) {
      res.render('user/manage', { user: req.user, users: users, listError: req.flash('list-error'), listMessage: req.flash('list-message') ,createError: req.flash('create-error'), createMessage: req.flash('create-message') });
    });
  });
  // GET /user/manage/*
  router.get('/*', isAuthenticated, isOwner, function (req, res, next) {
    User.findOne({ where: { username: req.url.slice(1) } }).then(function (user) {
      if (!user) { return res.send('user not found'); }
      return res.render('user/manage-user', { user: req.user, manageUser: user, updateError: req.flash('update-error'), updateMessage: req.flash('update-message') });
    }, function (err) {
      return next(err);
    });
  });
  return router;
};
