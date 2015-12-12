////////////////////
// Session config //
////////////////////
var fs = require('fs');

module.exports = function (sessionStore) {
  var sessionConfig = {
    secret: fs.readFileSync(__dirname+'/../secret.key').toString('utf8'),
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 30
    },
    resave: false, //Don't enable (will break with sequelize)
    saveUninitialized: true, //Need to be enabled to use flashes
    store: sessionStore
  }
  return sessionConfig;
}
