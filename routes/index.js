//Setup
var router = require('express').Router();
//Router - index - '/'
router.get('/', function (req, res) {
  res.send('request processed');
});
router.get('/login', function (req, res) {
  console.log(req.flash('message'));
  res.render('login', { message: req.flash('message') });
});
router.get('/daw', function (req, res) {
  res.send(req.user);
});
//Exports
module.exports = router;
