//Setup
var express       = require('express');
var https         = require('https');
var fs            = require('fs');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var Sequelize     = require('sequelize');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto        = require('crypto');
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
    secret: 'stograncazzo',
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
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
  res.send('authenticated');
});
//Static
app.use(express.static(__dirname+'/public/'));
//Passport config
passport.use(new LocalStrategy(function (username, password, done) {
  console.log('username: '+username);
  console.log('password: '+password);
  User.findOne({ where: { username: username } }).then(function (user) {
    if (!user) { console.log('not found'); return done(null, false); }
    crypto.pbkdf2(password, user.salt, 4096, 512, 'sha256', function (err, hash) {
      if (err) { console.log('err'); throw err; }
      console.log(hash.toString('hex'));
      console.log(user.passwordHash.toString('hex'));
      if (hash.toString('hex') == user.passwordHash.toString('hex')) { console.log('match'); return done(null, user); } else { console.log('no match'); return done(null, false); }
    });
  }, function (err) { return done(err); });
}));
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
//HTTPS
var httpsOptions = {
  key: fs.readFileSync(__dirname+'/key.pem'),
  cert: fs.readFileSync(__dirname+'/cert.pem')
};
//Start
https.createServer(httpsOptions, app).listen(port);
