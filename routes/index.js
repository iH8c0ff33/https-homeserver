//////////////////
// Index router //
//////////////////
var router = require('express').Router();

router.get('/', function (req, res) {
  if (!req.user) {
    return res.render('index');
  }
  res.render('index', { username: req.user.username });
});
router.get('/login', function (req, res) {
  var error = req.flash('error');
  res.render('login', { message: error[0] });
});
router.get('/daw', function (req, res) {// Sample error
  res.send(req.casdas());
});
module.exports = router;
