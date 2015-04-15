# sauce-results

[![NPM](https://nodei.co/npm/sauce-results.png)](https://nodei.co/npm/sauce-results/)

[![Build Status](https://drone.io/github.com/conradz/sauce-results/status.png)](https://drone.io/github.com/conradz/sauce-results/latest)
[![Dependency Status](https://gemnasium.com/conradz/sauce-results.png)](https://gemnasium.com/conradz/sauce-results)

Helper to publish the results of a [Sauce Labs](https://saucelabs.com/) test
job. Then you can use the awesome
[status images](https://saucelabs.com/docs/status-images).

Example status image:

[![Selenium Test Status](https://saucelabs.com/browser-matrix/sauce-results-test.svg)](https://saucelabs.com/u/sauce-results-test)

Simply call the function with the options object and a callback function.

## Example

```js
var results = require('sauce-results');

results({
    user: sauceUser,
    key: sauceKey,
    job: sauceJobId,
    passed: true
}, function(err) {
    // Handle err if it exists
});
```

## Options

 * `user`: The Sauce Labs username for the tests
 * `key`: The Sauce Labs key for the provided user
 * `job`: The Sauce Labs job ID. If none is provided, it will retrieve the last job ID.
 * `passed`: Boolean indicating if the job passed or not

## Credits

Thanks goes to @rvagg for doing something like this in
[brtapsauce](https://github.com/rvagg/brtapsauce). This module was split out
from the larger project and rewritten based on his code.

