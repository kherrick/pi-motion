module.exports = {
  robot: null,
  setup: function(address, port) {
    'use strict';

    var baseUrl = 'https://' + address + ':' + port,
      events = {
        activatedEvent: new EventSource(
          baseUrl + '/api/robots/pi-motion/events/activated'
        ),
        deactivatedEvent: new EventSource(
          baseUrl + '/api/robots/pi-motion/events/deactivated'
        ),
        isToggledEvent: new EventSource(
          baseUrl + '/api/robots/pi-motion/events/is_toggled'
        )
      },
      sensor = require('./sensor');

    events.activatedEvent.onmessage = function(event) {
      sensor.activated();
      console.log(event.data);
    };

    events.deactivatedEvent.onmessage = function(event) {
      sensor.deactivated();
      console.log(event.data);
    };

    events.isToggledEvent.onmessage = function(event) {
      var isToggled = event.data === 'true',
        $statusBar = $('#sensor-status-bar');

      if (isToggled === true) {
        $statusBar.text('The sensor is enabled.');

        return;
      }

      $statusBar.text('The sensor is disabled.');
    };

    //check every second what the state of the button is
    setInterval(function() {
      $.post(baseUrl + '/api/robots/pi-motion/commands/isToggled', function() {
      });
    }.bind(this), 1000);
  }
};
