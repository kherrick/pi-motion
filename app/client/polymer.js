module.exports = function() {
  'use strict';

  var ajax, pages, scaffold,
    cache = {},
    charts = require('./charts'),
    config = require('../config'),
    defaultRoute = 'home',
    template = document.querySelector('#main'),
    initCharts = function() {
      var pad = function (int) {
          return (int <= 10) ? ('0' + int).slice(-2) : int;
        },
        year = document.querySelector('#year'),
        month = document.querySelector('#month'),
        day = document.querySelector('#day'),
        hour = document.querySelector('#hour'),
        date = year.value + '/' + pad(month.value) + '/' + pad(day.value);

      charts().showChart(date, hour.value);

      template.updateChart = function() {
        date = year.value + '/' + pad(month.value) + '/' + pad(day.value);

        charts().showChart(date, hour.value);
      };

      $(window).on('throttledresize', function () {
        date = year.value + '/' + pad(month.value) + '/' + pad(day.value);

        charts().showChart(date, hour.value);
      });
    },
    initSensor = function() {
      template.toggleSensor = function() {
        $.get(
          'https://' + config.cylonApiIpAddress + ':' + config.cylonApiPort + '/api/robots/pi-motion/commands/toggle',
          function() {}
        ).done(function (data) {
          var $progressBar = $('#sensor .progress-bar');

          /**
           * if the get request returns true, alert the user
           * otherwise make sure the elements are hidden
           */
          if (data.result === true) {
            var i,
              count = 40;

            //show the popup regarding waiting for initialization to finish
            document.querySelector('#init-sensor-toast').show();

            //show the progress bar
            $progressBar.css('visibility', 'visible');

            //increment the progress bar
            for (i = 1; i < (count + 1); i++) {
              (function(index) {
                setTimeout(function() {
                  var progress = (index / count) * 100;
                  document.querySelector('#init-sensor-progress-bar').value = progress;
                }, index * 1000);
              })(i); //jshint ignore:line
            }

            //hide the progress bar
            setTimeout(function() {
              $progressBar.css('visibility', 'hidden');
            }, (count + 1) * 1000);

            return;
          }

          $progressBar.css('visibility', 'hidden');
        });
      };
    };

  template.pages = [
    {
      name: 'Home',
      hash: 'home',
      url: 'home.html'
    },
    {
      name: 'PIR Sensor',
      hash: 'sensor',
      url: 'sensor.html'
    },
    {
      name: 'Charts',
      hash: 'charts',
      url: 'charts.html'
    }
  ];

  template.addEventListener('template-bound', function () {
    var keys = document.querySelector('#keys'),
      keysToAdd = Array.apply(null, template.pages).map(function (x, i) {
        return i + 1;
      }).reduce(function(x, y) {
        return x + ' ' + y;
      });

    scaffold = document.querySelector('#scaffold');
    ajax = document.querySelector('#ajax');
    pages = document.querySelector('#pages');
    keys.keys += ' ' + keysToAdd;
    this.route = this.route || defaultRoute;
  });

  template.keyHandler = function (event, detail) {
    var num = parseInt(detail.key);

    if (!isNaN(num) && num <= this.pages.length) {
      pages.selectIndex(num - 1);
      return;
    }

    switch (detail.key) {
      case 'left':
      case 'up':
        pages.selectPrevious();
        break;
      case 'right':
      case 'down':
        pages.selectNext();
        break;
      case 'space':
        detail.shift ? pages.selectPrevious() : pages.selectNext(); //jshint ignore:line
        break;
    }
  };

  template.menuItemSelected = function (event, detail) {
    if (detail.isSelected) {
      this.async(function() {
        if (!cache[ajax.url]) {
          ajax.go();
        }

        scaffold.closeDrawer();
      });
    }
  };

  template.ajaxLoad = function (event) {
    event.preventDefault();
  };

  template.onResponse = function (event, detail) {
    var article = detail.response.querySelector('#content'),
      html = article.innerHTML,
      url = detail.response.URL;

    cache[ajax.url] = html;

    this.injectBoundHTML(html, pages.selectedItem.firstElementChild);

    switch (url.substring(url.lastIndexOf('/') + 1)) {
      case 'sensor.html':
        initSensor();
        break;
      case 'charts.html':
        initCharts();
        break;
    }
  };
};
