var objects = require('./objects')
exports.id = function (i) {
  return i
}
/*
often you want to do something like: map(array, JSON.stringify)
but map calls the iterator with (value, key, object)
which confuses JSON.stringify because it expects a replacer function as the second arg
previously one would do something like this:

    map(array, function (x) {return JSON.stringify(x)})

TOO LONG, I can't be bothered!

now use:

    map(array, curry(JSON.stringify, 0))

the `0` that thu first arg is in the first position.

non numbers are literal, also, negative numbers count from the end of the array 
(handy for ensuring that callbacks are in the right place)

curry(func, 0)                 // function (a) { return func(a) }
curry(func, 0, 'whatever')     // function (a) { return func(a, 'whatever') }
curry(func, 0, 'whatever', -1) // function (a, b) { return func(a, 'whatever', b) }

of course, you cannot use this function to stick in numbers, but what are you, an accountant?

it's really handy though, when you can simplify this:

    ctrl.toAsync(function (ls) {
        return d.map(ls, function (e) { return path.join(dir, e) } )
      }) ]) (dir, cb)

to this:

    ctrl.toAsync(d.curry(d.map, 0, d.curry(path.join, dir, 0) ))

*/
 
exports.curry = function (/*funx, args...*/) {
  var args = [].slice.call(arguments)
    , funx = args.shift()
  return function (){
    var _args = [].slice.call(arguments)
    return funx.apply(this, objects.map(args, function (i) {
      return 'number' !== typeof i ? i : _args[i < 0 ? _args.length + i : i]
    }))
  }
}
