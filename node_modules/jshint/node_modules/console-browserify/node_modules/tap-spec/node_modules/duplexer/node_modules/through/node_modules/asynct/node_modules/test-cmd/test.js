var test = require('testling');

test('moo', function (t) {
    t.plan(2);
    t.equal(2, Math.random() > 0.6 ? 1 : 2);
    t.ok(true);
    t.end();
});
