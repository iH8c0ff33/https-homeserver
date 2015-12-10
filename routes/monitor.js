////////////////////
// Monitor Router //
////////////////////
var router = require('express').Router();
var waitSession = require(__dirname+'/../config/wait-save.js');

router.get('/raid', function (req, res, next) {
  res.render('monitor/raid');
});
module.exports = router;
