////////////////////
// Session config //
////////////////////
module.exports = function (sessionStore) {
  var sessionConfig = {
    secret: 'stograncazzo',
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60
    },
    resave: false, //Don't enable (will break with sequelize)
    saveUninitialized: true, //Need to enable to use flashes
    store: sessionStore
  }
  return sessionConfig;
}
