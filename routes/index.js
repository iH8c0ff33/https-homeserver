//Setup
var router = require('express').Router();
//Router - index - '/'
router.get('/', function (req, res) {
  res.redirect('/auth/login');
});
router.get('/login', function (req, res) {
  var error = req.flash('error');
  res.render('login', { message: error[0] });
});
//Exports
module.exports = router;
