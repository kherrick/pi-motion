var async = require('async'),
    wd = require('wd'),
    sauceConnect = require('sauce-connect-launcher'),
    TapProducer = require('tap').Producer,
    runner = require('./');

var testSrc = [
    '(function() {',
        'console.log("TAP version 13");',
        'console.log("# beep");',
        'console.log("ok 1 should be equal");',
        'console.log("ok 2 should be equal");',
        'console.log("");',
        'console.log("1..2");',
        'console.log("# tests 2");',
        'console.log("# pass 2");',
        'console.log("");',
        'console.log("# ok");',
    '})();'
].join('\r\n');

var user = process.env.SAUCE_USER,
    key = process.env.SAUCE_KEY;
if (!user || !key) {
    console.log('Set SAUCE_USER and SAUCE_KEY to your SauceLabs credentials');
    process.exit(1);
}

var browser = wd.remote('ondemand.saucelabs.com', 80, user, key),
    id = 'test-' + Date.now(),
    tunnel,
    success = false;

run();

function run() {
    async.series([
        startTunnel,
        startBrowser,
        test,
        stop
    ], complete);
}

function stop(callback) {
    async.parallel([
        stopTunnel,
        stopBrowser
    ], callback);
}

function startTunnel(callback) {
    console.log('Opening tunnel to SauceLabs');

    var options = {
        username: user,
        accessKey: key,
        tunnelIdentifier: id
    };

    sauceConnect(options, function(err, t) {
        if (err) {
            callback(err);
        }

        tunnel = t;
        console.log('Tunnel opened');
        callback();
    });
}

function stopTunnel(callback) {
    console.log('Closing tunnel');
    tunnel.close(function() {
        console.log('Tunnel closed');
        callback();
    });
}

function startBrowser(callback) {
    console.log('Starting browser');
    browser.init({
        browserName: 'chrome',
        'tunnel-identifier': id,
        name: 'Test browser'
    }, function(err) {
        if (err) {
            return callback(err);
        }

        console.log('Started browser');
        callback();
    });
}

function stopBrowser(callback) {
    console.log('Stopping browser');
    browser.quit(function() {
        console.log('Stopped browser');
        callback();
    });
}

function test(callback) {
    runner(testSrc, browser, function(err, results) {
        if (err) {
            console.error(err);
            return callback();
        }

        var output = TapProducer.encode(results);
        console.log('TAP Results:');
        console.log(output);

        if (!results.ok) {
            console.error('Tests did not pass');
            return callback();
        }

        success = true;
        callback();
    });
}

function complete(err) {
    if (err) {
        console.error('Error occurred');
        console.error(err);
        process.exit(1);
    }

    if (success) {
        console.log('Success!');
    } else {
        console.log('Tests failed');
        process.exit(1);
    }
}
