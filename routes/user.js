/////////////////
// User router //
/////////////////
var router = require('express').Router();
var crypto = require('crypto');
var waitSession = require(__dirname+'/../config/wait-save.js');

module.exports = function (User) {
  router.use('/manage', require(__dirname+'/manage.js')(User));
  router.use('/delete', require(__dirname+'/delete.js')(User));
  router.use('/update', require(__dirname+'/update.js')(User));
  router.use('/random', require(__dirname+'/random.js')(User));
  //////////////
  // /account //
  //////////////
  router.get('/account', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/auth'); }
    res.render('user/account', { user: req.user, session: req.session, passwordError: req.flash('password-error'), emailError: req.flash('email-error'), emailMessage: req.flash('email-message') });
  });
  //////////////////////
  // /change-password //
  //////////////////////
  router.post('/change-password', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/auth'); }
    var error = false;
    if (!req.body.oldpassword) { req.flash('password-error', 'Sorry. Old password field seems to be blank.'); error = true; }
    if (!req.body.newpassword) { req.flash('password-error', 'Sorry. New password field seems to be blank.'); error = true; }
    if (req.body.newpassword != req.body.confirmpassword) { req.flash('password-error', 'Sorry. New passwords don\'t match'); error = true; }
    if (error) {
      return waitSession(req, res, next, function (err) {
        if (err) { return next(err); }
        res.redirect('/user/account');
      });
    }
    crypto.pbkdf2(req.body.oldpassword, req.user.salt, 4096, 512, 'sha256', function (err, hash) {
      if (err) { return next(err); }
      console.log(hash);
      console.log(req.user.passwordHash);
      if (hash.equals(req.user.passwordHash)) {
        crypto.randomBytes(32, function (err, salt) {
          if (err) { return next(err); }
          crypto.pbkdf2(req.body.newpassword, salt, 4096, 512, 'sha256', function (err, hash) {
            User.findOne({ where: { username: req.user.username } }).then(function (user) {
              user.update({
                salt: salt,
                passwordHash: hash
              }).then(function (user) {
                req.session.regenerate(function () {
                  req.flash('login-message', 'You password was changed successfully, you need to login now.');
                  return waitSession(req, res, next, function (err) {
                    if (err) { return next(err); }
                    res.redirect('/login');
                  });
                });
              });
            });
          });
        });
      } else {
        req.flash('password-error', 'Sorry. Inserted old password isn\'t correct.');
        return waitSession(req, res, next, function (err) {
          if (err) { return next(err); }
          res.redirect('/user/account');
        });
      }
    });
  });
  router.post('/change-email', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/auth'); }
    var error = false;
    if (!req.body.password) { req.flash('email-error', 'Sorry. Password field seems to be blank.'); error = true; }
    if (!req.body.newemail) { req.flash('email-error', 'Sorry. Email field seems to be blank.'); error = true; }
    if (error) {
      return waitSession(req, res, next, function (err) {
        if (err) { return next(err); }
        res.redirect('/user/account#email');
      });
    }
    crypto.pbkdf2(req.body.password, req.user.salt, 4096, 512, 'sha256', function (err, hash) {
      if (hash.equals(req.user.passwordHash)) {
        User.findOne({ where: { username: req.user.username } }).then(function (user) {
          user.update({ email: req.body.newemail }).then(function (user) {
            req.flash('email-message', 'Your email was changed successfully.');
            return waitSession(req, res, next, function (err) {
              if (err) { return next(err); }
              res.redirect('/user/account#email');
            });
          }, function (err) {
            req.flash('email-error', 'Sorry. This email address is used by someone else');
            return waitSession(req, res, next, function (err) {
              if (err) { return next(err); }
              res.redirect('/user/account#email');
            });
          });
        });
      } else {
        req.flash('email-error', 'Sorry. The password you entered is not correct.');
        return waitSession(req, res, next, function (err) {
          if (err) { return next(err); }
          res.redirect('/user/account#email');
        });
      }
    });
  });
  router.post('/new-user', function (req, res, next) {
    if (!req.user) { return res.redirect('/error/auth'); }
    if (req.user.permissionLevel < 10) { return res.render('error/error', {
      title: 'Insufficient permissions',
      message: 'Sorry. You need permission level greater than 9 to create new users.',
      link: '/',
      linkText: 'Take me Home'
    }); }
    var error = false;
    if (!req.body.username) { req.flash('create-error', 'Sorry. Username field cannot be blank.'); error = true; }
    if (!req.body.email) { req.flash('create-error', 'Sorry. Email field cannot be blank.'); error = true; }
    if (!req.body.permissionLevel) { req.flash('create-error', 'Please select a permission level.'); error = true; }
    if (error) {
      return waitSession(req, res, next, function (err) {
        if (err) { return next(err); }
        res.redirect('/user/manage#create');
      });
    }
    User.findOne({ where: { username: req.body.username } }).then(function (user) {
      if (user) {
        req.flash('create-error', 'Sorry. This username is already taken.');
        return waitSession(req, res, next, function (err) {
          if (err) { return next(err); }
          res.redirect('/user/manage#create');
        });
      }
      crypto.randomBytes(6, function (err, passwordHex) {
        if (err) { return next(err); }
        var password = passwordHex.toString('hex');
        crypto.randomBytes(32, function (err, salt) {
          crypto.pbkdf2(password, salt, 4096, 512, 'sha256', function (err, hash) {
            User.create({
              username: req.body.username,
              passwordHash: hash,
              salt: salt,
              email: req.body.email,
              permissionLevel: req.body.permissionLevel
            }).then(function (user) {
              req.flash('create-message', user.username+' created with random password:  '+password);
              return waitSession(req, res, next, function (err) {
                if (err) { return next(err); }
                res.redirect('/user/manage#create');
              });
            }, function (err) {
              req.flash('create-error', 'Sorry. This email is used by someone else.');
              return waitSession(req, res, next, function (err) {
                if (err) { return next(err) }
                res.redirect('/user/manage#create');
              });
            });
          });
        });
      });
    });
  });
  return router;
};
