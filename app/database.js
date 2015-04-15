module.exports = function(filename) {
  'use strict';

  var fs = require('fs'),
    exists = fs.existsSync(filename),
    sqlite3 = require('sqlite3').verbose(),
    connection = new sqlite3.Database(filename);

  return {
  	connection: connection,
  	exists: exists
  };
};
