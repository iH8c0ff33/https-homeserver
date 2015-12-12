var router          = require('express').Router();
var waitSession     = require(__dirname+'/../config/wait-save.js');
var isAuthenticated = require(__dirname+'/../config/checkauth.js');
var isAuthorized    = require(__dirname+'/../config/checkauthorized.js');
// /monitor/raid
router.get('/raid', isAuthenticated, isAuthorized, function (req, res, next) {
  res.render('monitor/raid', { user: req.user });
});
// /monitor/network
router.get('/network', isAuthenticated, isAuthorized, function (req, res, next) {
  res.render('monitor/network', { user: req.user });
});
module.exports = router;
