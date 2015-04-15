var http = require('http'),
    wdTap = require('wd-tap'),
    serve = require('serve-script');

function runner(src, browser, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    var port = 8000,
        app = serve({ src: src }),
        server = http.createServer(app);
    if (typeof options.port !== 'undefined') {
        port = options.port;
    }

    server.timeout = options.serverTimeout || 1000;

    startServer();

    function startServer() {
        server.listen(port, function(err) {
            if (err) { return callback(err); }
            port = server.address().port;

            runTests();
        });
    }

    function runTests() {
        var url = 'http://localhost:' + port + '/',
            testOptions = { timeout: options.timeout };
        wdTap(url, browser, testOptions, testsComplete);
    }

    function testsComplete(err, data) {
        server.close(function() {
            callback(err, data);
        });
    }
}

module.exports = runner;
