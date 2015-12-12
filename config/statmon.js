var util = require('util');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

function analyzeProperty(propertyName, linesArray, startLine, callback) {
  var propertyStartLine = startLine;
  var propertyStopLine = startLine;
  var propertyCurrentLine = startLine + 1;
  var property = [];
  if (propertyCurrentLine < linesArray.length) {// Check whether current line is the last line or not
    while (linesArray[propertyCurrentLine].indexOf(':') == -1) {
      propertyStopLine = propertyCurrentLine;
      propertyCurrentLine++;
    }
  }
  if (propertyName == 'config:') {
    var disks = [];
    var raidType = linesArray[propertyStartLine+3].split('\t').join('').split(' ').filter(String)[0];
    for (var current = propertyStartLine + 4, last = propertyStopLine; current <= propertyStopLine; current++) {
      disks.push(linesArray[current].split('\t').join('').split(' ').filter(String));
    }
    for (var current = 0, length = disks.length; current < length; current++) {
      var reason = '';
      if (disks[current][5]) {
        reason = reason.concat(disks[current][5]);
      }
      if (disks[current][6]) {
        reason = reason.concat(' '+disks[current][6]);
      }
      property[current] = {
        name: disks[current][0],
        state: disks[current][1],
        readErrors: disks[current][2],
        writeErrors: disks[current][3],
        checksumErrors: disks[current][4]
      };
      if (reason) {
        property[current].reason = reason;
      }
    }
    for (var current = 0, length = property.length; current < length; current++) {
      if (property[current].name.indexOf('/') == -1) {
        var diskState = execSync('sudo hdparm -C /dev/disk/by-id/'+property[current].name).toString('utf-8').split('\n').filter(String)[1];
        diskState = diskState.slice(diskState.indexOf('is:')+4).split(' ').filter(String).join('');
        property[current].diskState = diskState;
      }
    }
    return callback(property, propertyStopLine, raidType);
  }
  property = '';
  for (var propertyCurrentLine = propertyStartLine; propertyCurrentLine <= propertyStopLine; propertyCurrentLine++) {
    property = property.concat(linesArray[propertyCurrentLine]).concat(' ');
  }
  if (propertyName == 'see:') {
    property = property.split('\t').join('').split(' ').filter(String).join(' ');// Don't add spaces to dots
  } else {
    property = property.split('\t').join('').split('.').join('. ').split(' ').filter(String).join(' ');// Remove every '\t', add spaces after '.' and remove any multiple spaces
  }
  property = property.slice(propertyName.length+1);
  return callback(property, propertyStopLine);
}

function checkPool(callback) {
  exec('sudo zfs list', function (error, stdout, stderr) {
    var splitted = stdout.split('\n').filter(String);
    var pools = [];
    for (var i = 1, tot = splitted.length; i < tot; i++) {// For every line(in splitted)
      var fields = splitted[i].split(' ').filter(String);
      pools.push({
        name: fields[0],
        usedSpace: fields[1],
        availSpace: fields[2],
        mountPath: fields[4]
      });
    }
    var stdout = [];
    var configIndex = 0;
    for (var currentPool = 0, totalPools = pools.length; currentPool < totalPools; currentPool++) {// For every pool run zpool status
      stdout[currentPool] = execSync('sudo zpool status -v '+pools[currentPool].name).toString('utf-8').split('\n').filter(String);
      for (var currentLine = 0, totalLines = stdout[currentPool].length; currentLine < totalLines; currentLine++) {// For every line in zpool status
        if (stdout[currentPool][currentLine].indexOf('state:') > -1) {
          analyzeProperty('state:', stdout[currentPool], currentLine, function (property, newCurrentLine) {
            currentLine = newCurrentLine;
            pools[currentPool].poolState = property;
          });
        }
        if (stdout[currentPool][currentLine].indexOf('status:') > -1) {
          analyzeProperty('status:', stdout[currentPool], currentLine, function (property, newCurrentLine) {
            currentLine = newCurrentLine;
            pools[currentPool].poolStatus = property;
          });
        }
        if (stdout[currentPool][currentLine].indexOf('action:') > -1) {
          analyzeProperty('action:', stdout[currentPool], currentLine, function (property, newCurrentLine) {
            currentLine = newCurrentLine;
            pools[currentPool].poolAction = property;
          });
        }
        if (stdout[currentPool][currentLine].indexOf('scan:') > -1) {
          analyzeProperty('scan:', stdout[currentPool], currentLine, function (property, newCurrentLine) {
            currentLine = newCurrentLine;
            pools[currentPool].poolScan = property;
          });
        }
        if (stdout[currentPool][currentLine].indexOf('errors:') > -1) {
          analyzeProperty('errors:', stdout[currentPool], currentLine, function (property, newCurrentLine) {
            currentLine = newCurrentLine;
            pools[currentPool].poolErrors = property;
          });
        }
        if (stdout[currentPool][currentLine].indexOf('see:') > -1) {
          analyzeProperty('see:', stdout[currentPool], currentLine, function (property, newCurrentLine) {
            currentLine = newCurrentLine;
            pools[currentPool].poolActionSee = property;
          });
        }
        if (stdout[currentPool][currentLine].indexOf('config:') > -1) {
          analyzeProperty('config:', stdout[currentPool], currentLine, function (property, newCurrentLine, raidType) {
            currentLine = newCurrentLine;
            pools[currentPool].raidType = raidType;
            pools[currentPool].poolDisks = property;
          });
        }
      }
    }
    return callback(pools);
  });
}

function checkNet(callback) {
  var thisNet = [];
  var nlSplitted = [];
  var csvSplitted = [];
  execSync('sudo rm -f '+path.join('/', 'var', 'www', 'homeserver', 'netscan.csv'));
  exec('sudo fing -o table,csv,'+path.join("/", "var", "www", 'homeserver', "netscan.csv"), function (error, stdout, stderr) {
    if (error) {
      console.log('ERR: '+stderr);
    } else {
      fs.readFile(path.join("/", "var", "www", 'homeserver', "netscan.csv"), function (err, data) {
        if (err) {
          console.log(err);
        } else {
          nlSplitted = data.toString('utf-8').split('\n').filter(String);
          nlSplitted.forEach(function (current, index, array) {
            csvSplitted = current.split(';');
            thisNet[index] = {
              address: csvSplitted[0],
              name: csvSplitted[1],
              state: csvSplitted[2],
              lastChange: csvSplitted[3],
              hostname: csvSplitted[4],
              macAddress: csvSplitted[5],
              macVendor: csvSplitted[6]
            };
          });
          return callback(thisNet);
        }
      });
    }
  });
}

exports = module.exports = {
  checkPool: checkPool,
  checkNet: checkNet
}
