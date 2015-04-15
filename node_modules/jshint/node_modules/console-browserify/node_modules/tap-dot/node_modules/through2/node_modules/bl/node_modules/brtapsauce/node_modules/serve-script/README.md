# serve-script

[![NPM](https://nodei.co/npm/serve-script.png?compact=true)](https://nodei.co/npm/serve-script/)

[![Build Status](https://drone.io/github.com/conradz/serve-script/status.png)](https://drone.io/github.com/conradz/serve-script/latest)
[![Dependency Status](https://gemnasium.com/conradz/serve-script.png)](https://gemnasium.com/conradz/serve-script)

Easily serve plain JS scripts to the browser with auto-generated HTML.

It will automatically create the HTML page that the JS script will run in, and
will show the console output (using `console.log`, etc.) on the page.

![Show console output](http://i.cloudup.com/jXpFzRO1zG.png)

## Example

```js
var serve = require('serve-script'),
    http = require('http');

var src = 'alert("Hello World!");';
http.createServer(serve({ src: src })).listen(8000);

// View http://localhost:8000/ in your browser to be alerted
```

Also with [Express](https://github.com/visionmedia/express):

```js
var express = require('express'),
    serve = require('serve-script');

var src = 'alert("Hello World!);';
express()
    .use(server({ src: src }))
    .listen(8000);
```

## Options

Pass the options object as the first argument to the `serve-script` function.
It will return a function that can be used as a request listener for a server
that will serve the automatically generated HTML and JS code.

The returned function can also be used as
[Connect](http://www.senchalabs.org/connect/) middleware.

### src

The `src` option can be either a string, stream, or a function. If it is a
function, it must call the provided callback with an optional error and a string
or stream.

Examples:

```js
server({
    src: 'alert("Hello World!");'
});
```

```js
server({
    src: browserify().add('test.js').bundle()
});
```

```js
serve({
    src: function(callback) {
        callback(myError, mySource);
    }
});
```

### noConsole

The `noConsole` argument will disable the console redirection when it is `true`.
By default, the generated HTML page will display the output that was printed to
the console with `console.log`. If `noConsole` is true, this behavior is
disabled.

## serve-script(1)

Creates an HTTP server that serves the provided JS script to browsers. To make
available globally, install with `npm install -g serve-script`.

Usage: `serve-script [file] [options]`

`file` specifies the JS file to serve. If no file is provided, uses stdin.

### Options

 * `-p, --port`: The HTTP port to listen on (default 8000).
 * `--no-console`: Do not show `console.log` output on the web page.

