module.exports = (grunt) ->

  grunt.initConfig
    mocha_debug:
      options:
        reporter: 'dot'
        ui: 'tdd'
      browserdebug:
        options:
          phantomjs: true
          listenPort: 8887
          listenAddress: '0.0.0.0'
          enableHtmlReporter: true
          src: 'test/browser.js'
      nodebug:
        options:
          check: 'test/nodebug.*'
          src: 'test/nodebug.js'
      debug:
        options:
          check: 'test/debug.*'
          src: 'test/debug.js'


  grunt.loadTasks('tasks')

  grunt.loadNpmTasks('grunt-release')

  grunt.registerTask('default', ['mocha_debug'])
