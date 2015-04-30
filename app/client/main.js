(function() {
  'use strict';

  var config = require('../config'),
    polymer = require('./polymer'),
    robot = require('./robot');

  $(document).ready(function() {
    robot.setup(config.cylonApiIpAddress, config.cylonApiPort);
    polymer(robot);

    //weird hack to get the default page to load in Firefox
    //without refreshing the page once.
    window.location.href='http://' + config.httpServerIpAddress + '/#home';
  });
})();
