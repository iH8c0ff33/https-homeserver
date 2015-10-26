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
  res.render('index', { username: req.user.username });
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
module.exports = router;
