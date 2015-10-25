/////////////
// Express //
/////////////
var express        = require('express');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var session        = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var app            = express();
var index          = require(__dirname+'/routes/index.js');
///////////
// HTTPS //
///////////
var https = require('https');
var port  = process.env.PORT || 4433;
//////////////
// Database //
//////////////
var Sequelize    = require('sequelize');
var dbConfig     = require(__dirname+'/config/database.js');
var db           = new Sequelize(dbConfig.url);
var sessionStore = new SequelizeStore({ db: db });
////////////
// Models //
////////////
var User = require(__dirname+'/models/user.js')(Sequelize, db);
///////////////////
// Express setup //
///////////////////
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
////////////////////
// Passport setup //
////////////////////
app.use(session(require(__dirname+'/config/session.js')(sessionStore)));
app.use(passport.initialize());
app.use(passport.session());
//Routes
app.use('/', index);
app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      console.log(info);
      return res.render('login', info)
    }
    req.login(user, function (err) {
      if (err) { return next(err); }
      return res.redirect('/daw');
    });
  })(req, res, next);
});
app.get('/logout' , function (req, res) {
  req.logout();
  res.redirect('/login');
})
//Static
app.use(express.static(__dirname+'/public/'));
//Passport config
passport.use(require(__dirname+'/config/local-strategy.js')(User));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id).then(function (user) {
    done(null, user);
  }, function (err) {
    done(err, null);
  });
});

//Start
https.createServer(require(__dirname+'/config/keys.js'), app).listen(port);
