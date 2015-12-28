/////////////////
// Keys config //
/////////////////
var fs = require('fs');

module.exports = {
  key: fs.readFileSync(__dirname+'/../privkey.pem'),
  cert: fs.readFileSync(__dirname+'/../cert.pem')
};
