var spawn = require('child_process').spawn;
var path = require('path');

var cmd = path.join(
  __dirname, '..', 'node_modules', 'jshint', 'bin', 'jshint');

module.exports = function(grunt) {
  grunt.registerMultiTask('exec_jshint', 'Unfancy jshint task.', function() {
    var done = this.async();
    var options = this.options({});
    var defaultArgs = [];

    if (options.config) {
      defaultArgs.push('--config');
      defaultArgs.push(options.config);
    }

    if (options.reporter) {
      defaultArgs.push('--reporter');
      defaultArgs.push(options.reporter);
    }

    if (options.exclude) {
      defaultArgs.push('--exclude');
      defaultArgs.push(options.exclude);
    }

    if (options.showNonErrors) {
      defaultArgs.push('--show-non-errors');
    }

    if (options.verbose) {
      defaultArgs.push('--verbose');
    }

    if (options.extraExt) {
      defaultArgs.push('--extra-ext');
      defaultArgs.push(options.extraExt);
    }

    grunt.util.async.forEachSeries(this.files, function(f, next) {
      var args = defaultArgs.concat(f.src);
      var jshint = spawn(cmd, args, { stdio: 'inherit' });
      jshint.on('close', function(code) {
        if (code === 0) {
          grunt.log.ok(f.src.length + ' files lint free.');
          return done();
        }
        next(code);
      });
    
    }, function(err) { done(!err); });
  });

};
