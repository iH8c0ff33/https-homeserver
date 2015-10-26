/////////////
// Express //
/////////////
var express        = require('express');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var session        = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var flash          = require('express-flash');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var app            = express();
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
var db           = new Sequelize(dbConfig.url, { logging: console.log });
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
app.use(flash());
////////////
// Routes //
////////////
app.use('/', require(__dirname+'/routes/index.js'));
app.use('/auth', require(__dirname+'/routes/authentication.js')(passport, sessionStore));
app.use(express.static(__dirname+'/public/'));
/////////////
// 404/500 //
/////////////
app.use(function (req, res) {
  res.render('error', {
    status: '404 Not Found',
    message: 'Sorry. The page you requested was not found on this server.'
  });
});
app.use(function (err, req, res, next) {
  res.render('error', {
    status: 'Server Error',
    message: 'Sorry. Something has gone wrong with your request, we\'ll try to fix this problem soon.'
  });
});
/////////////////////
// Passport config //
/////////////////////
var passportSerialize = require(__dirname+'/config/passport-serialize.js')(User);
passport.use('local-login', require(__dirname+'/config/local-strategy.js')(User));
passport.use('local-register', require(__dirname+'/config/local-signup-strategy.js')(User));
passport.serializeUser(passportSerialize.serialize);
passport.deserializeUser(passportSerialize.deserialize);
////////////
// Server //
////////////
https.createServer(require(__dirname+'/config/keys.js'), app).listen(port);
