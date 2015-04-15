(function() {
  'use strict';

  var config = {
      apiPort: 3000,
      apiIpAddress: '127.0.0.1'
    },
    polymer = require('./polymer'),
    robot = require('./robot');

  $(document).ready(function() {
    robot.setup(config.apiIpAddress, config.apiPort);
    polymer(robot);

    //weird hack to get the default page to load in Firefox
    //without refreshing the page once.
    window.location.href='http://127.0.0.1/#home';
  });
})();
