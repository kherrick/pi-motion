(function() {
  'use strict';

var config = require('./config'),
    database = require('./database.js')(
      'databases/charts.sqlite'
    ),
    robot = require('./robot.js'),
    server = require('./server.js');

  //load cylon and web apis
  robot.setup(config.cylonApiIpAddress, config.cylonApiPort, database);
  robot.start();

  //load http server
  server(config.httpServerIpAddress, config.httpServerPort, database);

})();
