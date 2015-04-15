'use strict';

var assert = require('assert'),
  date = new Date(1970, 0, 1, 0, 0, 0);

describe('date module', function() {
  it('year should be formatted', function (done) {
    var dateTime = require('../../app/dateTime.js')(date),
      formattedYear = dateTime.Y('-').get();

    assert.strictEqual(formattedYear, '1970-', 'year was not formatted properly');
    done();
  });

  it('month should be formatted', function (done) {
    var dateTime = require('../../app/dateTime.js')(date),
      formattedMonth = dateTime.m('-').get();

    assert.strictEqual(formattedMonth, '01-', 'month was not formatted properly');
    done();
  });

  it('day should be formatted', function (done) {
    var dateTime = require('../../app/dateTime.js')(date),
      formattedDay = dateTime.d('_').get();

    assert.strictEqual(formattedDay, '01_', 'day was not formatted properly');
    done();
  });

  it('hour should be formatted', function (done) {
    var dateTime = require('../../app/dateTime.js')(date),
      formattedHour = dateTime.H('-').get();

    assert.strictEqual(formattedHour, '00-', 'hour was not formatted properly');
    done();
  });

  it('minute should be formatted', function (done) {
    var dateTime = require('../../app/dateTime.js')(date),
      formattedMinute = dateTime.M('-').get();

    assert.strictEqual(formattedMinute, '00-', 'minute was not formatted properly');
    done();
  });

  it('second should be formatted', function (done) {
    var dateTime = require('../../app/dateTime.js')(date),
      formattedSecond = dateTime.S('-').get();

    assert.strictEqual(formattedSecond, '00-', 'second was not formatted properly');
    done();
  });

  it('date string should be formatted', function (done) {
    var dateTime = require('../../app/dateTime.js')(date),
      formattedDate = dateTime.Y('-').m('-').d('-').H('.').M('.').S().get();

    assert.strictEqual(formattedDate, '1970-01-01-00.00.00', 'date string was not formatted properly');
    done();
  });
});
