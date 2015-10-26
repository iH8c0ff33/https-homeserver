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
  return router;
};
