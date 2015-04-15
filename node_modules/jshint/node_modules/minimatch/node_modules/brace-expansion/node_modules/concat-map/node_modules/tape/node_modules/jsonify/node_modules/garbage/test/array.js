var test = require('tap').test;
var traverse = require('traverse');
var garbage = require('../');

test('array', function (t) {
    t.plan(30 * 2);
    for (var i = 0; i < 30; i++) {
        var xs = garbage.array(5);
        t.ok(Array.isArray(xs));
        t.ok(traverse.nodes(xs).length <= 5, 'too many objects');
    }
    
    t.end();
});
