///////////////////////////
// Authentication router //
///////////////////////////
var router = require('express').Router();
var waitSession = require(__dirname+'/../config/wait-save.js');

module.exports = function (passport, sessionStore) {
  ////////////
  // /login //
  ////////////
  router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        req.flash('error', info.message);
        return waitSession(req, res, next, function (err) {
          if (err) { return next(err); }
          res.redirect('/login');
        });
      }
      req.login(user, function (err) {
        if (err) { return next(err); }
        return waitSession(req, res, next, function (err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      });
    })(req, res, next);
  });
  /////////////
  // /logout //
  /////////////
  router.get('/logout' , function (req, res) {
    req.logout();
    res.redirect('/login');
  });
  ///////////
  // /test //
  ///////////
  router.get('/test', function (req, res) {
    if (req.user) { return res.send('you are ok'); }
    res.send('you are not ok');
  });
  return router;
}
