//Setup
var express        = require('express');
var https          = require('https');
var fs             = require('fs');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var Sequelize      = require('sequelize');
var app            = express();
var index          = require(__dirname+'/routes/index.js');
var authentication = require(__dirname+'/routes/authentication.js');
var port           = process.env.PORT || 4433;
//ExpressSettings
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
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
//HTTPS
var httpsOptions = {
  key: fs.readFileSync(__dirname+'/key.pem'),
  cert: fs.readFileSync(__dirname+'/cert.pem')
};
//Routes
app.use('/', index);
app.use('/auth', authentication);
//Static
app.use(express.static(__dirname+'/public/'));
//Start
https.createServer(httpsOptions, app).listen(port);
