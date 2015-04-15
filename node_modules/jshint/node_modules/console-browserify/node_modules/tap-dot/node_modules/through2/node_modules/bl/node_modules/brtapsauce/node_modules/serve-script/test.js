var test = require('tap').test,
    http = require('http'),
    express = require('express'),
    request = require('request'),
    through = require('through'),
    serve = require('./');

function createServer(options, callback) {
    var server = http.createServer(serve(options));
    handleServer(server, callback);
}

function createExpressServer(options, callback) {
    var app = express().use(serve(options)),
        server = http.createServer(app);
    handleServer(server, callback);
}

function handleServer(server, callback) {
    server.listen(0, function(err) {
        if (err) {
            return callback(err);
        }

        var url = 'http://localhost:' + server.address().port + '/';
        callback(null, server, url);
    });
}

function testScript(options, script, t) {
    createServer(options, function(err, server, url) {
        t.notOk(err);

        request(url + 'script.js', function(err, r, body) {
            t.notOk(err);
            t.equal(r.statusCode, 200);
            t.equal(body, script);

            server.close(function() {
                t.end();
            });
        });
    });
}

test('serve home page', function(t) {
    createServer({ src: '' }, function(err, server, url) {
        t.notOk(err);
        request(url, function(err, r, body) {
            t.notOk(err);
            t.equal(r.statusCode, 200);
            t.equal(body.indexOf('<!DOCTYPE html>'), 0);
            t.notEqual(body.indexOf('<div id="output"'), -1);
            t.notEqual(body.indexOf('(function'), -1);
            t.notEqual(body.indexOf('<script>'), -1);
            t.notEqual(body.indexOf('<style>'), -1);

            server.close(function() {
                t.end();
            });
        });
    });
});

test('skip output when noConsole is true', function(t) {
    createServer({ src: '', noConsole: true }, function(err, server, url) {
        t.notOk(err);

        request(url, function(err, r, body) {
            t.notOk(err);
            t.equal(r.statusCode, 200);
            t.equal(body.indexOf('<script>'), -1);
            t.equal(body.indexOf('<style>'), -1);
            t.equal(body.indexOf('<div id="output"'), -1);

            server.close(function() {
                t.end();
            });
        });
    });
});

test('serve js script', function(t) {
    var script = 'alert("Hello World!");',
        options = { src: script };
    testScript(options, script, t);
});

test('serve js script from Buffer', function(t) {
    var script = 'alert("Hello World!");',
        options = { src: new Buffer(script, 'utf8') };
    testScript(options, script, t);
});

test('serve js from callback function', function(t) {
    var script = 'alert("Hello World!");',
        options = {
            src: function(callback) {
                process.nextTick(function() { callback(null, script); });
            }
        };
    testScript(options, script, t);
});

test('serve js from stream in callback function', function(t) {
    var script = 'alert("Hello World!");',
        options = {
            src: function(callback) {
                var stream = through();
                process.nextTick(function() {
                    stream.queue(script, 'utf8');
                    stream.end();
                });

                callback(null, stream);
            }
        };
    testScript(options, script, t);
});

test('handle error in source callback', function(t) {
    var options = {
        src: function(callback) {
            callback(new Error('Test error'));
        }
    };

    createServer(options, function(err, server, url) {
        t.notOk(err);

        request(url + 'script.js', function(err, r) {
            t.notOk(err);
            t.equal(r.statusCode, 500);

            server.close(function() {
                t.end();
            });
        });
    });
});

test('handle error event on source stream', function(t) {
    var options = {
        src: function(callback) {
            var stream = through();
            process.nextTick(function() {
                stream.emit('error', new Error('Test'));
                stream.end();
            });

            callback(null, stream);
        }
    };

    createServer(options, function(err, server, url) {
        t.error(err, 'created server');
        request(url + 'script.js', function(err, r) {
            t.error(err, 'requested script');
            t.equal(r.statusCode, 500);

            server.close(function() {
                t.end();
            });
        });
    });
});

test('serve 404 for invalid file', function(t) {
    createServer({ src: '' }, function(err, server, url) {
        t.notOk(err);

        request(url + 'not_found', function(err, r) {
            t.notOk(err);
            t.equal(r.statusCode, 404);

            server.close(function() {
                t.end();
            });
        });
    });
});

test('serve from Express server', function(t) {
    createExpressServer({ src: '' }, function(err, server, url) {
        t.notOk(err);

        request(url, function(err, r) {
            t.notOk(err);
            t.equal(r.statusCode, 200);

            server.close(function() {
                t.end();
            });
        });
    });
});

test('serve 404 from Express', function(t) {
    createExpressServer({ src: '' }, function(err, server, url) {
        t.notOk(err);
        request(url + 'not_found', function(err, r) {
            t.notOk(err);
            t.equal(r.statusCode, 404);
            server.close(function() { t.end(); });
        })
    })
});
