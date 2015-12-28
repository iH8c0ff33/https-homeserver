///////////////////////////
// Serialize/Deserialize //
///////////////////////////
module.exports = function (User) {
  var serialize = function (user, done) {
    done(null, user.id);
  };
  var deserialize = function (id, done) {
    User.findById(id).then(function (user) {
      done(null, user);
    }, function (err) {
      done(err, null);
    });
  };
  var functions = {
    serialize: serialize,
    deserialize: deserialize
  };
  return functions;
};
