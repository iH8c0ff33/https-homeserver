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
var db           = new Sequelize(dbConfig.url, { logging: false });
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
////////////
// Routes //
////////////
app.use('/', require(__dirname+'/routes/index.js'));
app.use('/auth', require(__dirname+'/routes/authentication.js')(passport));
app.use(express.static(__dirname+'/public/'));
/////////////////////
// Passport config //
/////////////////////
var passportSerialize = require(__dirname+'/config/passport-serialize.js')(User);
passport.use(require(__dirname+'/config/local-strategy.js')(User));
passport.serializeUser(passportSerialize.serialize);
passport.deserializeUser(passportSerialize.deserialize);
////////////
// Server //
////////////
https.createServer(require(__dirname+'/config/keys.js'), app).listen(port);
