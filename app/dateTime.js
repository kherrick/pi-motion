module.exports = function(date) {
  'use strict';

    return {
      results: '',
      date: date,
      get: function () {
        return this.results;
      },
      Y: function(sep) {
        this.results += this.date.getFullYear();

        if (this.sep(sep)) {
          this.results += sep;
        }

        return this;
      },
      m: function(sep) {
        this.results += this.pad(this.date.getMonth() + 1);

        if (this.sep(sep)) {
          this.results += sep;
        }

        return this;
      },
      d: function(sep) {
        this.results += this.pad(this.date.getDate());

        if (this.sep(sep)) {
          this.results += sep;
        }

        return this;
      },
      H: function (sep) {
        this.results += this.pad(this.date.getHours());

        if (this.sep(sep)) {
          this.results += sep;
        }

        return this;
      },
      M: function (sep) {
        this.results += this.pad(this.date.getMinutes());

        if (this.sep(sep)) {
          this.results += sep;
        }

        return this;
      },
      S: function(sep) {
        this.results += this.pad(this.date.getSeconds());

        if (this.sep(sep)) {
          this.results += sep;
        }

        return this;
      },
      pad: function(val) {
        return (val < 10) ? ('0' + val) : val;
      },
      sep: function(sep) {
        return sep ? true: false;
      }
    };
};
