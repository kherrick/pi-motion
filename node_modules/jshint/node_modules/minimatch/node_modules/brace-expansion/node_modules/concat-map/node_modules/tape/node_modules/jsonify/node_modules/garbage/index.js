var garbage = module.exports = function (count) {
    if (!count) count = 20;
    return generate(count)[1];
};
garbage.json = garbage;

function generate (count) {
    if (count === undefined) count = 20;
    
    var types = [ 'array', 'object', 'string', 'number', 'boolean' ];
    var ix = Math.floor(Math.random() * types.length);
    var type = types[ix];
    return generate[type](count);
}

garbage.size = function () {
    var m = Math.random(), n = Math.random();
    return Math.abs(Math.floor(5 / (1 - n * n) - 5 + m * 5));
};

generate.boolean = function () {
    var n = Math.random();
    return [ 1, n > 0.5 ];
};

garbage.boolean = function () {
    return generate.boolean(count)[1];
};

generate.number = function () {
    var n = Math.random();
    return [ 1, Math.tan((n - 0.5) * Math.PI) ];
};

garbage.number = function () {
    return generate.number(count)[1];
};

generate.array = function (count) {
    var res = [];
    if (count <= 0) return res;
    var len = garbage.size();
    var size = 1;
    for (var i = 0; i < len && size < count; i++) {
        var x = generate(--count - len);
        res.push(x[1]);
        size += x[0];
    }
    return [ size, res ];
};

garbage.array = function (count) {
    return generate.array(count)[1];
};

generate.object = function (count) {
    if (count === undefined) count = 20;
    
    var res = {};
    if (count <= 0) return res;
    var len = garbage.size();
    var size = 1;
    for (var i = 0; i < len && size < count; i++) {
        var key = generate.string()[1];
        var x = generate(--count - len);
        res[key] = x[1];
        size += x[0];
    }
    return [ size, res ];
};

garbage.object = function (count) {
    return generate.object(count)[1];
};

generate.string = function () {
    var len = Math.floor(
        Math.random() * Math.random() * 20
        + Math.random() * 2
    );
    var res = [];
    for (var i = 0; i < len; i++) {
        var c = garbage.char();
        res.push(c);
    }
    return [ 1, res.join('') ];
};

garbage.string = function () {
    return generate.string()[1];
};

garbage.char = function () {
    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        + 'abcdefghijklmnopqrstuvwxyz'
        + '0123456789`~!@#$%^&*()-_=+[]{}|\\:;'
        + '\'",.<>?/ \t\n'
    ;
    return charset.charAt(Math.floor(Math.random() * charset.length));
};
