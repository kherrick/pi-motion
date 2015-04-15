var fs = require('fs');
var file = 'databases/charts.sqlite';
var exists = fs.existsSync(file);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
  db.run('CREATE TABLE "charts" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , "date" DATE, "time" TIME, "sensor" INTEGER NOT NULL  DEFAULT 0)');
});

db.close();
