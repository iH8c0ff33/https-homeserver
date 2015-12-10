////////////////////
// Monitor Router //
////////////////////
var router = require('express').Router();
var waitSession = require(__dirname+'/../config/wait-save.js');
///////////
// /raid //
///////////
router.get('/raid', function (req, res, next) {
  res.render('monitor/raid', { user: req.user });
});
//////////////
// /network //
//////////////
router.get('/network', function (req, res, next) {
  res.render('monitor/network', { user: req.user });
});
module.exports = router;
