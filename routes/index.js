//Setup
var router = require('express').Router();
//Router - index - '/'
router.get('/', function (req, res) {
  res.send('request processed');
});
//Exports
module.exports = router;
