(function() {
  'use strict';

  var config = {
      httpPort: 80,
      apiPort: 3000,
      httpIpAddress: '127.0.0.1',
      apiIpAddress: '127.0.0.1'
    },
    database = require('./database.js')(
      'databases/charts.sqlite'
    ),
    robot = require('./robot.js'),
    server = require('./server.js');

  //load cylon and web apis
  robot.setup(config.apiIpAddress, config.apiPort, database);
  robot.start();

  //load http server
  server(config.httpIpAddress, config.httpPort, database);

})();
