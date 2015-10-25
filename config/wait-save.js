//////////////////
// Wait session //
//////////////////
// This function waits for the session to be saved before executing a callback
module.exports = function (req, res, next, callback) {
  req.session.save(function (err) {
    return callback(err);
  });
};
