pi-motion
========
###About
Successfully utilized on a Raspberry Pi 2 Model B.

![alt tag](https://github.com/kherrick/pi-motion/blob/master/images/pi-motion-board.jpg) ![alt tag](https://github.com/kherrick/pi-motion/blob/master/images/pi-motion-breadboard.png)

###Development
* Get the required dependencies:
  * `cd /opt`
  * `sudo curl -O https://iojs.org/dist/v2.0.1/iojs-v2.0.1-linux-armv7l.tar.gz`
  * `sudo tar -xzpvf iojs-v2.0.1-linux-armv7l.tar.gz`
  * `sudo ln -s /opt/iojs-v2.0.1-linux-armv7l/bin/node /usr/local/bin/node`
  * `sudo ln -s /opt/iojs-v2.0.1-linux-armv7l/bin/npm /usr/local/bin/npm`

* Clone the repository:
  * `cd ~`
  * `git clone https://github.com/kherrick/pi-motion`
  * `cd pi-motion`
  * `bin/init.sh`

* Run unit tests, and see a coverage report:
  * `bin/gulp test`
  * `bin/gulp test-coverage`

![alt tag](https://github.com/kherrick/pi-motion/blob/master/images/pir-sensor-enabled.png) ![alt tag](https://github.com/kherrick/pi-motion/blob/master/images/charts.png)

###Configure and Launch
Check out the [config file](https://github.com/kherrick/pi-motion/blob/master/app/config.js) and change the options to access the web application from another browser (TV, phone, etc.). Next, serve the web app and cylon wiring app:

* `cd ~/pi-motion`
* `bin/gulp serve`

With just the defaults set, open a browser on the Pi, and go to [https://localhost:3000](https://localhost:3000) to view the [Robeaux](https://github.com/hybridgroup/robeaux) dashboard that is built into the Cylon.js framework (be sure to allow the browser to view the content behind the self signed certificate). Then browse to [http://localhost](http://localhost) to view the web application.

###Read more
View a write up about the project @ [http://karlherrick.com/dev/2015/04/29/pi-motion/](http://karlherrick.com/dev/2015/04/29/pi-motion/)

[![Build Status](https://travis-ci.org/kherrick/pi-motion.svg?branch=master)](https://travis-ci.org/kherrick/pi-motion)
