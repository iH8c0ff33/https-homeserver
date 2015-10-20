//Setup
var express = require('express');
var https   = require('https');
var fs      = require('fs');
var app     = express();
var index = require(__dirname+'/routes/index.js');
var port    = process.env.PORT || 4433;
//HTTPS
var httpsOptions = {
  key: fs.readFileSync(__dirname+'/key.pem'),
  cert: fs.readFileSync(__dirname+'/cert.pem')
};
//Routes
app.use('/', index);
//Start
https.createServer(httpsOptions, app).listen(port);
