/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  'use strict';

	  var config = __webpack_require__(1),
	    polymer = __webpack_require__(2),
	    robot = __webpack_require__(3);

	  $(document).ready(function() {
	    robot.setup(config.cylonApiIpAddress, config.cylonApiPort);
	    polymer(robot);

	    //weird hack to get the default page to load in Firefox
	    //without refreshing the page once.
	    window.location.href='http://' + config.httpServerIpAddress + '/#home';
	  });
	})();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  chartApiPort: 80,
	  cylonApiPort: 3000,
	  httpServerPort: 80,
	  chartServerIpAddress: '127.0.0.1',
	  cylonApiIpAddress: '127.0.0.1',
	  httpServerIpAddress: '127.0.0.1',
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
	  'use strict';

	  var ajax, pages, scaffold,
	    cache = {},
	    charts = __webpack_require__(4),
	    config = __webpack_require__(1),
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

	      charts().showChart(date, pad(hour.value));

	      template.updateChart = function() {
	        date = year.value + '/' + pad(month.value) + '/' + pad(day.value);

	        charts().showChart(date, pad(hour.value));
	      };

	      $(window).on('throttledresize', function () {
	        date = year.value + '/' + pad(month.value) + '/' + pad(day.value);

	        charts().showChart(date, pad(hour.value));
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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
	      sensor = __webpack_require__(5);

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
	  'use strict';

	  return {
	    showChart : function(date, hour) {
	      var config = __webpack_require__(1),
	        $progressBar = $('#charts .progress-bar'),
	        dataTable = new google.visualization.DataTable(),
	        annotationChart = new google.visualization.AnnotationChart(
	          document.querySelector('#chart')
	        ),
	        drawChart = function(json) {
	          var rowsToAdd = [];

	          dataTable.addColumn('date', 'Date');
	          dataTable.addColumn('number', '');

	          $.each(json, function(id, row) {
	            $.each(row, function() {
	              rowsToAdd.push(
	                [
	                  new Date(
	                    row.year,
	                    row.month,
	                    row.day,
	                    row.hour,
	                    row.minute,
	                    row.second
	                  ),
	                  row.sensor
	                ]
	              );
	            });
	          });

	          dataTable.addRows(rowsToAdd);
	          annotationChart.draw(
	            dataTable,
	            {
	              displayAnnotations: false,
	              displayZoomButtons: false
	            }
	          );
	        };

	      google.load(
	        'visualization',
	        '1',
	        { 'packages': ['annotationchart'] }
	      );

	      $.ajax(
	        {
	          url: 'http://' + config.chartServerIpAddress + '/chart/' + date + '/' + hour,
	          dataType: 'json',
	          cache: false,
	          beforeSend: function() {
	            $progressBar.css('visibility', 'visible');
	          }
	        }
	      ).done(function (data) {
	          $progressBar.css('visibility', 'hidden');

	          if (Object.keys(data).length === 0) {
	            document.querySelector('#no-chart-data-toast').show();

	            return;
	          }

	          drawChart(data);
	        }
	      );
	    }
	  };
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  activated: function() {
	    'use strict';
	    $('circle').css('fill', '#57b663');
	  },
	  deactivated: function() {
	    'use strict';
	    $('circle').css('fill', '#eb7670');
	  }
	};

/***/ }
/******/ ]);