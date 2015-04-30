module.exports = function(address, port, database) {
  'use strict';

  var express = require('express'),
    app = express();

  //main page
  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });

  //chart JSON route
  app.get('/chart/:year(\\d+)/:month(\\d+)/:day(\\d+)/:hour(\\d+)', function (req, res) {
    var chartData = {},
      query = 'SELECT * FROM charts WHERE date = "' + req.params.year + '-' +
        req.params.month + '-' + req.params.day + '" AND time BETWEEN "' +
        req.params.hour + ':00:00" AND "' + req.params.hour + ':59:59"',
      chart = {
        build: function() {
          if (database.exists) {
            database.connection.each(query, function(err, row) {
              chartData[row.id] = {
                year: row.date.substring(0, 4),
                month: row.date.substring(5, 7),
                day: row.date.substring(8, 10),
                hour: row.time.substring(0, 2),
                minute: row.time.substring(3, 5),
                second: row.time.substring(6, 8),
                sensor: row.sensor
              };
            }, this.complete);
          }
        },
        complete: function() {
          res.type('text/plain');
          res.status(200);
          res.send(JSON.stringify(chartData));
        }
      };

    chart.build();
  });

  //public resources
  app.use(express.static(__dirname + '/public/'));

  //404 page
  app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404');
  });

  //500 page
  app.use(function (err, req, res) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500');
  });

  //start listening
  app.listen(port, address, function() {
    console.log('Express started on http://' + address +  ':' + port);
  });
};
