# grunt-mocha-debug

> Grunt task for running mocha tests on node.js/phantomjs

## Getting Started
```shell
npm install grunt-mocha-debug --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mocha-debug');
```

### Overview

This task will run mocha test suites on background node/phantomjs processes.

For node.js testing it will check specified files for 'debugger'
statements(nothing fancy like ast walk, just simple regex search so the
debugger statement can only have trailing spaces on the line). If any file
matches the search, the mocha runner process will be started with the
--debug-brk argument so the code can be stepped with node-inspector.

For phantomjs testing, it will start a background phantomjs instance and reuse
it across test runs. That means if the task is triggered again by
grunt-contrib-watch it will only issue a 'reload' command to the test
page(instead of starting a new phantomjs process for each run like
grunt-mocha). Task will start an express instance to serve the test
page which is how phantomjs loads the page(any normal web browser can access
it too).

The 'reporter', 'ui', 'checkLeaks' and 'globals' are also configurable and
seamless adapted to both types of test runs. There's also a 'reporterOutput'
options which can be set to a filename to receive the reporter's output(useful
for reporters like markdown)


### Sample configuration


```coffeescript
grunt.initConfig
  mocha_debug:
    options:
      # Only search for 'debugger' in the original coffeescript sources(the
      # default is to check only the test files)
      check: 'src/**/*.coffee'
      reporter: 'nyan'
    browser:
      options:
        ui: 'tdd'
        checkLeaks: true
        globals: ['jquery']
        reporter: 'markdown'
        reporterOutput: './results.mkd'
        # Port that express will listen on(default is a random port)
        listenPort: 8888 
        # Address that express will listen on(default is 127.0.0.1)
        listenAddress: '0.0.0.0'
        # Enable phantomjs testing(node.js is the default)
        phantomjs: true
        # Files to test(possibly a concatenated/browserified version of your
        # commonjs project)
        src: 'build/browser/test.js'
    nodejs:
      options:
        src: 'build/nodejs/**/*.js'
```

No other setup other than configuring the grunt task is necessary(phantomjs
will be installed automatically).
