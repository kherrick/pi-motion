# grunt-exec-jshint

> Grunt wrapper for jshint command-line utility.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-exec-jshint --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-exec-jshint');
```

## The "exec_jshint" task

### Overview
In your project's Gruntfile, add a section named `exec_jshint` to the data object passed into `grunt.initConfig()`. Most jshint command line options are supported:

```js
grunt.initConfig({
  exec_jshint: {
    options: {
      reporter: 'jslint',
      showNonErrors: true,
      verbose: true
    },
    all: ['Gruntfile.js', 'tasks/*.js']
  }
});
```
