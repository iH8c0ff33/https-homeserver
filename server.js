//Setup
var express       = require('express');
var https         = require('https');
var fs            = require('fs');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var Sequelize     = require('sequelize');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var app           = express();
var index         = require(__dirname+'/routes/index.js');
var port          = process.env.PORT || 4433;
//ExpressSettings
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//Passport init
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//Database
var db = new Sequelize('postgres://www@localhost:5432/homeserver');
var User = db.define('users', {
  username: {
    type: Sequelize.STRING(24),
    unique: true,
    validate: {
      notNull: true
    }
  },
  passwordHash: {
    type: Sequelize.BLOB,
    validate: {
      notNull: true
    }
  },
  salt: {
    type: Sequelize.BLOB,
    validate: {
      notNull: true
    }
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      notNull: true
    }
  }
});
User.sync();
//Routes
app.use('/', index);
//Static
app.use(express.static(__dirname+'/public/'));
//Passport config
passport.use(new LocalStrategy(function (username, password, done) {
  User.findOne({
    where: {
      username: username
    }
  }).then(function (user) {
    if (!user) { return done(null, false); }
    crypto.pbkdf2(password, user.salt, 4096, 512, 'sha256', function (err, hash) {
      if (err) { throw err; }
      if (hash == user.passwordHash) { return done(null, user); }
    });
  }, function (err) {});
}));
//HTTPS
var httpsOptions = {
  key: fs.readFileSync(__dirname+'/key.pem'),
  cert: fs.readFileSync(__dirname+'/cert.pem')
};
//Start
https.createServer(httpsOptions, app).listen(port);
