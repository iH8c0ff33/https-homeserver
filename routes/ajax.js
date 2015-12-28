// AJAX Router
var router          = require('express').Router();
var isAuthenticated = require(__dirname+'/../config/checkauth.js');
var isAuthorized    = require(__dirname+'/../config/checkauth.js');

module.exports = function (Series, Series2) {
  // GET /ajax/temp-data
  router.get('/temp-data', isAuthenticated, isAuthorized, function (_req, res, next) {
    Series.findAll().then(function (series) {
      var data = [];
      for (var current = 0, length = series.length; current < length; current++) {
        data.push([series[current].time.getTime(), series[current].value]);
      }
      res.send(JSON.stringify(data));
    }, function (err) { return next(err); });
  });
  // GET /ajax/fan-data
  router.get('/fan-data', isAuthenticated, isAuthorized, function (_req, res, next) {
    Series2.findAll().then(function (series) {
      var data = [];
      for (var current = 0, length = series.length; current < length; current++) {
        data.push([series[current].time.getTime(), series[current].value]);
      }
      res.send(JSON.stringify(data));
    }, function (err) { return next(err); });
  });
  return router;
};
