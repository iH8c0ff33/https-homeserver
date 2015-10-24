//Setup
var router = require('express').Router();
//Router - index - '/'
router.get('/', function (req, res) {
  res.send('request processed');
});
router.get('/login', function (req, res) {
  res.render('login');
});
//Exports
module.exports = router;
