// Projects router
var router          = require('express').Router();
var isAuthenticated = require(__dirname+'/../config/checkauth.js');
var isAuthorized    = require(__dirname+'/../config/checkauth.js');
// GET /projects/chart
router.get('/chart', isAuthenticated, isAuthorized, function (req, res, _next) {
  res.render('projects/chart', { user: req.user });
});
module.exports = router;
