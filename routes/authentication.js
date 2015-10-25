///////////////////////////
// Authentication router //
///////////////////////////
var router = require('express').Router();

module.exports = function (passport) {
  router.get('/login', function (req, res) {
    res.render('login');
  });
  router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        console.log(info);
        return res.render('login', info)
      }
      req.login(user, function (err) {
        if (err) { return next(err); }
        return res.redirect('/auth/test');
      });
    })(req, res, next);
  });
  router.get('/logout' , function (req, res) {
    req.logout();
    res.redirect('/auth/login');
  });
  router.get('/test', function (req, res) {
    if (req.user) { return res.send('you are ok'); }
    res.send('you are not ok');
  });
  return router;
}
