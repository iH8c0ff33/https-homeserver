//////////////////
// Error router //
//////////////////
var router = require('express').Router();

///////////////////
// /authenticate //
///////////////////
router.get('/auth', function (req, res) {
  res.render('error/auth');
});
module.exports = router;
