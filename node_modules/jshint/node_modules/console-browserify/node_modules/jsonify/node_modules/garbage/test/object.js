var test = require('tap').test;
var traverse = require('traverse');
var garbage = require('../');

test('object', function (t) {
    t.plan(30 * 2);
    for (var i = 0; i < 30; i++) {
        var obj = garbage.object(5);
        t.equal(typeof obj, 'object');
        t.ok(traverse.nodes(obj).length <= 5, 'too many objects');
    }
    
    t.end();
});
