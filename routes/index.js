//////////////////
// Index router //
//////////////////
var router = require('express').Router();

///////
// / //
///////
router.get('/', function (req, res) {
  if (!req.user) {
    return res.render('index');
  }
  res.render('index', { user: req.user });
});
////////////
// /login //
////////////
router.get('/login', function (req, res) {
  if (req.user) { return res.redirect('/'); }
  res.render('login', { error: req.flash('login-error') });
});
///////////////
// /register //
///////////////
router.get('/register', function (req, res) {
  if (req.user) { return res.redirect('/'); }
  res.render('register', { error: req.flash('register-error') });
});
module.exports = router;
