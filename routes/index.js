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
  res.render('login', { message: req.flash('login-error')[0] });
});
///////////////
// /register //
///////////////
router.get('/register', function (req, res) {
  if (req.user) { return res.redirect('/'); }
  res.render('register', { error: req.flash('register-error') });
});
///////////////////
// /authenticate //
///////////////////
router.get('/authenticate', function (req, res) {
  res.render('authenticate');
});
module.exports = router;
