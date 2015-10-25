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
    saveUninitialized: false, //No need to enable this since not using flashes
    store: sessionStore
  }
  return sessionConfig;
}
