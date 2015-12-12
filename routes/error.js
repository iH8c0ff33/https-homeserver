// Error router
var router = require('express').Router();

// GET /error/auth
router.get('/auth', function (req, res) {
  res.render('error/auth');
});
module.exports = router;
