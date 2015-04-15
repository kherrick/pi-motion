var request = require('request');

module.exports = results;

function results(options, callback) {
    getJob(options, gotJob);

    function gotJob(err, job) {
        if (err) {
            return callback(err);
        }

        var user = encodeURIComponent(options.user);
        job = encodeURIComponent(job);

        request({
            method: 'PUT',
            url: 'https://saucelabs.com/rest/v1/' + user + '/jobs/' + job,
            json: { passed: !!options.passed },
            auth: {
                user: options.user,
                pass: options.key
            }
        }, requested);
    }

    function requested(err, resp) {
        if (err) {
            return callback(err);
        }

        if (resp.statusCode < 200 || resp.statusCode >= 300) {
            return callback(new Error('Invalid response code from Sauce Labs: ' + resp.statusCode));
        }

        callback();
    }

}

function getJob(options, callback) {
    if (options.job) {
        return callback(null, options.job);
    }

    var user = encodeURIComponent(options.user);

    request({
        method: 'GET',
        url: 'https://saucelabs.com/rest/v1/' + user + '/jobs',
        json: true,
        qs: { limit: 1 },
        auth: {
            user: options.user,
            pass: options.key
        }
    }, requested);

    function requested(err, resp, data) {
        if (err) {
            return callback(err);
        }

        if (!Array.isArray(data) || !data[0] || typeof data[0].id !== 'string') {
            return callback(new Error('Invalid response data from Sauce Labs'));
        }

        callback(null, data[0].id);
    }
}
