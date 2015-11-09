/////////////////
// User router //
/////////////////
var router = require('express').Router();
var waitSession = require(__dirname+'/../config/wait-save.js');

module.exports = function (User) {
  router.use('/manage', require(__dirname+'/manage.js')(User));
  ///////////
  // /info //
  ///////////
  router.get('/info', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/auth'); }
    res.render('user/info', { user: req.user, session: req.session });
  });
  return router;
};
