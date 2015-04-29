'use strict';

var gulp = require('gulp'),
  webpack = require('gulp-webpack'),
  jshint = require('gulp-jshint'),
  shell = require('gulp-shell');

gulp.task('default',
  ['serve']
);

gulp.task('compile-js',
  function() {
    var webpackConfig = require('./webpack.config.js');

    return gulp.src(webpackConfig.entry)
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest('./'));
  }
);

gulp.task('serve',
  ['compile-js'],
  shell.task('sudo node app/main.js')
);

gulp.task('lint',
  function() {
    return gulp.src('app/**/*.js')
      .pipe(jshint())
      .pipe(
        jshint.reporter(
          'default',
          { verbose: true }
        )
      );
  }
);

gulp.task('test',
  ['lint'],
  shell.task('npm run test')
);

gulp.task('test-coverage',
  shell.task('npm run coverage')
);

gulp.task('init-database',
  function() {
    var fs = require('fs');
    var file = 'databases/charts.sqlite';
    var exists = fs.existsSync(file);
    if (exists === false) {
      var sqlite3 = require('sqlite3').verbose();
      var db = new sqlite3.Database(file);

      db.serialize(function() {
        db.run('CREATE TABLE "charts" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , "date" DATE, "time" TIME, "sensor" INTEGER NOT NULL  DEFAULT 0)');
      });

      db.close();
    }
  }
);

