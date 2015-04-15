# wd-tap-runner

[![NPM](https://nodei.co/npm/wd-tap-runner.png?compact=true)](https://nodei.co/npm/wd-tap-runner/)

[![Build Status](https://drone.io/github.com/conradz/wd-tap-runner/status.png)](https://drone.io/github.com/conradz/wd-tap-runner/latest)
[![Dependency Status](https://gemnasium.com/conradz/wd-tap-runner.png)](https://gemnasium.com/conradz/wd-tap-runner)

Easily run TAP-producing JS unit tests in the browser, automated by WebDriver
with Node.js. This is a helper module for
[wd-tap](https://npmjs.org/package/wd-tap), this module sets up the test page
and HTTP server for you (using
[serve-script](https://npmjs.org/package/serve-script)).

## Example

The browser you are testing must have access to `localhost`, either running
locally or through a tunnel.

```js
var runner = require('wd-tap-runner'),
    wd = require('wd'),
    browserify = require('browserify');

var myCode = browserify().add('./test.js').bundle(),
    browser = wd.remote();

browser.init(function() {
    runner(src, browser, { port: 8000 }, function(err, results) {
        // results is parsed using tap-parser
        browser.quit();
    });
});
```

## Reference

### `runner(src, browser, [options], callback)`

Runs the tests in the browser. The browser must have access to `localhost`,
either run the browser locally or open a tunnel to the remote browser.

`src` may be a stream or string of JS code that contains the tests that will
be run. The JS code may output TAP output to the web browser console using
`console.log(line)`. The test page automatically displays the console output in
the document.

`browser` is the WebDriver browser (created by
[wd](https://npmjs.org/package/wd)) that the tests will be run in.

`options` is an optional object that may include the following:

 * `port`: The port the HTTP server will use
 * `timeout`: The timeout for the tests (in seconds). See the
   [wd-tap](https://github.com/conradz/wd-tap) documentation.
 * `serverTimeout`: The timeout for HTTP connections to the server. Default
   2000 (milliseconds).

`callback` will be called with either an error or the TAP test results, parsed
using [tap-parser](https://npmjs.org/package/tap-parser). Note that the error
will be null even if some tests failed; the results indicate what tests passed
or failed.
