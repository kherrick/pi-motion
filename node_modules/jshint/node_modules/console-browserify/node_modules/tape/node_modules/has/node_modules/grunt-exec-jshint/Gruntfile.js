module.exports = function(grunt) {

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

  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['exec_jshint']);
};
