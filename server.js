// Express
var express        = require('express');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var session        = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var flash          = require('express-flash');
var passport       = require('passport');
var app            = express();
app.locals.basedir = __dirname+'/views';
// HTTPS
var https = require('https');
var port  = process.env.PORT || 4433;
// Database
var Sequelize    = require('sequelize');
var dbConfig     = require(__dirname+'/config/database.js');
var db           = new Sequelize(dbConfig.url, { logging: console.log });
var sessionStore = new SequelizeStore({ db: db });
// Models
var User = require(__dirname+'/models/user.js')(Sequelize, db);
var Series = require(__dirname+'/models/series.js')(Sequelize, db);
var Series2 = require(__dirname+'/models/series2.js')(Sequelize, db);
// Express setup
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// Passport setup
app.use(session(require(__dirname+'/config/session.js')(sessionStore)));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Routes
app.use('/', require(__dirname+'/routes/index.js'));
app.use('/ajax', require(__dirname+'/routes/ajax.js')(Series, Series2));
app.use('/auth', require(__dirname+'/routes/authentication.js')(passport));
app.use('/error', require(__dirname+'/routes/error.js'));
app.use('/monitor', require(__dirname+'/routes/monitor.js'));
app.use('/projects', require(__dirname+'/routes/projects.js'));
app.use('/user', require(__dirname+'/routes/user.js')(User));
app.use(express.static(__dirname+'/public/'));
// 404/500
app.use(function (_req, res) {
  res.status(404).render('error/error', {
    title: '404 Not Found',
    message: 'Sorry. The page you requested was not found on this server.',
    link: '/',
    linkText: 'Take Me Home'
  });
});
app.use(function (err, _req, res) {
  console.log(err);
  res.status(500).render('error/error', {
    title: '500 Server Error',
    message: 'Sorry. Something has gone wrong with your request, we\'ll try to fix this problem soon.',
    link: '/',
    linkText: 'Take Me Home'
  });
});
// Passport config
var passportSerialize = require(__dirname+'/config/passport-serialize.js')(User);
passport.use('local-login', require(__dirname+'/config/local-strategy.js')(User));
passport.use('local-register', require(__dirname+'/config/local-signup-strategy.js')(User));
passport.serializeUser(passportSerialize.serialize);
passport.deserializeUser(passportSerialize.deserialize);
// Server
var server = https.createServer(require(__dirname+'/config/keys.js'), app).listen(port);
// Socket.io
var io      = require('socket.io')(server);
var statmon = require(__dirname+'/config/statmon.js');
io.on('connection', function (socket) {
  console.log('client connected with address: '+socket.client.conn.remoteAddress);
  socket.on('networkRequest', function() {
    statmon.checkNet(function (hosts) {
      socket.emit('networkHosts', hosts);
    });
  });
  socket.on('poolRequest', function() {
    statmon.checkPool(function (pools) {
      socket.emit('zfsPools', pools);
    });
  });
  socket.on('servicesRequest', function  () {
    statmon.checkServices(function (services) {
      socket.emit('servicesList', services);
    });
  });
});
