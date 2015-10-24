//Setup
var express   = require('express');
var https     = require('https');
var fs        = require('fs');
var Sequelize = require('sequelize');
var app       = express();
var index     = require(__dirname+'/routes/index.js');
var port      = process.env.PORT || 4433;
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
//Start
https.createServer(httpsOptions, app).listen(port);
