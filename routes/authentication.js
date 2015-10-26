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
    var error = false;
    if (!req.body.username) { req.flash('login-error', 'Sorry. Username field seems to be blank.'); error = true; }
    if (!req.body.password) { req.flash('login-error', 'Sorry. Password field seems to be blank.'); error = true; }
    if (error) {
      return waitSession(req, res, next, function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });
    }
    passport.authenticate('local-login', function (err, user, info) {
      if (err) { return next(err); }
      if (!user) {
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
  router.get('/logout' , function (req, res, next) {
    req.logout();
    return waitSession(req, res, next, function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
  ///////////////
  // /register //
  ///////////////
  router.post('/register', function (req, res, next) {
    var error = false;
    if (!req.body.username) { req.flash('register-error', 'Sorry. You must enter a username.'); error = true; }
    if (!req.body.password) { req.flash('register-error', 'Sorry. Password can\'t be blank.'); error = true; }
    if (!req.body.email) { req.flash('register-error', 'Sorry. Email can\'t be blank'); error = true; }
    if (error) {
      return waitSession(req, res, next, function (err) {
        if (err) { return next(err); }
        res.redirect('/register');
      });
    }
    passport.authenticate('local-register', function (err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        return waitSession(req, res, next, function (err) {
          if (err) { return next(err); }
          res.redirect('/register');
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
  ///////////
  // /test //
  ///////////
  router.get('/test', function (req, res) {
    if (req.user) { return res.send('you are ok'); }
    res.send('you are not ok');
  });
  return router;
}
