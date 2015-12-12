// Index router
var router = require('express').Router();
// GET /
router.get('/', function (req, res) {
  if (!req.user) {
    return res.render('index');
  }
  res.render('index', { user: req.user });
});
// GET /login
router.get('/login', function (req, res) {
  if (req.user) { return res.redirect('/'); }
  res.render('login', { error: req.flash('login-error'), message: req.flash('login-message') });
});
// GET /register
router.get('/register', function (req, res) {
  if (req.user) { return res.redirect('/'); }
  res.render('register', { error: req.flash('register-error') });
});
module.exports = router;
