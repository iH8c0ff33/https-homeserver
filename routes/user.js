/////////////////
// User router //
/////////////////
var router = require('express').Router();
var waitSession = require(__dirname+'/../config/wait-save.js');

module.exports = function (User) {
  ///////////
  // /info //
  ///////////
  router.get('/info', function (req, res, next) {
    if (!req.user) { return res.redirect('/authenticate'); }
    res.render('info', { user: req.user });
  });
  /////////////
  // /manage //
  /////////////
  router.get('/manage', function (req, res, next) {
    if (!req.user) { return res.redirect('/authenticate'); }
    if (req.user.permissionLevel < 10) { return res.render('error', {
      title: 'Insufficient Permission',
      message: 'Sorry. You need permission level greater than 9 to view this page.',
      link: '/',
      linkText: 'Take Me Home'
    }); }
  });
  return router;
};
