module.exports = {
  Cylon: null,
  start: function() {
    'use strict';

    this.Cylon.start();
  },
  setup: function (address, port, database) {
    'use strict';

    this.Cylon = require('cylon');

    this.Cylon.api(
      {
        host: address,
        port: port
      }
    );

    this.Cylon.robot({
      name: 'pi-motion',
      dateTime: require('./dateTime.js'),
      events: [
        'toggled',
        'is_toggled',
        'activated',
        'deactivated'
      ],
      toggled: false,
      connections: {
        raspi: {
          adaptor: 'raspi'
        }
      },
      devices: {
        button: {
          driver: 'button',
          pin: 3
        },
        signal: {
          driver: 'button',
          pin: 12
        },
        power: {
          driver: 'direct-pin',
          pin: 11
        }
      },
      commands: function() {
        return {
          toggle: this.toggle,
          isToggled: this.isToggled
        };
      },
      work: function() {
        this.button.on('release', function() {
          this.toggle();
        }.bind(this));
      },
      toggle: function() {
        var count = 40,
          powerDownMessage = 'Powering down the PIR sensor.',
          powerUpMessage = 'Powering up the PIR sensor... Please wait about ' +
            count + ' seconds (and keep still) while it initializes...';

        //toggled, so keep the button state
        this.toggled = !this.toggled;

        //emit it so SSE, socket.io, and others can grab it
        this.emit('toggled', this.toggled);

        if (this.toggled === true) {
          console.log(powerUpMessage);
          this.power.digitalWrite(1);

          //delay 40 seconds until enabling the signal events
          after((count).seconds(), function() {
            this.signal.on('push', this.activated.bind(this));
            this.signal.on('release', this.deactivated.bind(this));
          }.bind(this));

          //return it so it'll show up on a direct get request
          return this.toggled;
        }

        console.log(powerDownMessage);
        this.power.digitalWrite(0);

        //return it so it'll show up on a direct get request
        return this.toggled;
      },
      isToggled: function() {
        //emit it so SSE, socket.io, and others can grab it
        this.emit('is_toggled', this.toggled);

        //return it so it'll show up on a direct get request
        return this.toggled;
      },
      activated: function() {
        var msg = 'PIR sensor activated.',
          getDateTime = this.dateTime(
            new Date()
          ).Y('-').m('-').d('_').H(':').M(':').S().get(),
          dateTime = getDateTime.split('_'),
          date = dateTime[0],
          time = dateTime[1];

        database.connection.run('INSERT INTO charts (date,time,sensor) VALUES (\'' + date + '\',\'' + time + '\', 0)');
        database.connection.run('INSERT INTO charts (date,time,sensor) VALUES (\'' + date + '\',\'' + time + '\', 1)');

        //log it, so the server side console will see it
        console.log(msg);

        //emit it so SSE, socket.io, and others can grab it
        this.emit('activated', msg);

        //return it so it'll show up on a direct get request
        return msg;
      },
      deactivated: function() {
        var msg = 'PIR sensor deactivated.',
          getDateTime = this.dateTime(
            new Date()
          ).Y('-').m('-').d('_').H(':').M(':').S().get(),
          dateTime = getDateTime.split('_'),
          date = dateTime[0],
          time = dateTime[1];

        database.connection.run('INSERT INTO charts (date,time,sensor) VALUES (\'' + date + '\',\'' + time + '\', 1)');
        database.connection.run('INSERT INTO charts (date,time,sensor) VALUES (\'' + date + '\',\'' + time + '\', 0)');

        //log it, so the server side console will see it
        console.log(msg);

        //emit it so SSE, socket.io, and others can grab it
        this.emit('deactivated', msg);

        //return it so it'll show up on a direct get request
        return msg;
      }
    });
  }
};
