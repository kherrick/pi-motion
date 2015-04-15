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


exports.deepCurry = function () {
  var args = [].slice.call(arguments)
    , funx = args.shift()
  
  return function () {
    var _args = [].slice.call(arguments)
    return funx.apply(this, objects.deepMerge(args, _args))
  }
}

/*
before: modify the args to a function before it is called.

I think this is called aspect oriented programming.

the 'before' function returns a function that calls a shim function before a given function,
the 'shim' function is passed the args of the returned function, and may alter them before
the given function is called.

hmm, thats about twice as much english than javascript.

use it like this:

function (x,p,z) {return whatever(z, p, x)}

before(whatever, function (args) { return args.reverse() })

hmm, thats more verbose than the straight forward way...
maybe that function is not such a great idea.

what about beforeCallback?

function (opts, callback) { request (opts, function (err, res, body) { callback(err, body) } }

beforeCallback(request, function (args) { return [args[0], args[2]] })

ah, that is better.

*/

var fName = function (f) {
  return '"' + (f.name || f.toString().slice(0,100)) + '"'

}

var before = exports.before = function (given, shim) {
  return function wrapped () {
    return given.apply(this, shim([].slice.call(arguments)))
  }
}
//before(whatever, function (a) { return a.reverse() })

var beforeCallback = 
  exports.beforeCallback = function (async, shim) {
  return before(async, function (args) {
    args.push(before(args.pop(), shim)); return args
  })
}


/*
 prevent a function from being called intil some thing important has happened.
 (useful for delaying something until a connection is made.)

  use like this:
  
  dbSave = defer(dbSave)
  
  bdSave(doc1) //these calls will be buffered
  bdSave(doc2)
  
  db.connect()
  db.on('connection', dbSave.flush)
  db.on('disconnection', function () {dbSave.buffer(); db.reconnect() })
*/

var defer =
  exports.defer =  function (deferred) {
  var buffer = []
    , buffering = true

  function deferrer () {
    var args = [].slice.call(arguments)
    if(buffering)
      buffer.push(args)
    else deferred.apply(null, args)
  }
  deferrer.flush = function () {
    buffering = false
    while(!buffering && buffer.length) {
      deferred.apply(null, buffer.shift()) 
    }
  }
  deferrer.buffer = function () {
    buffering = true
  }

  return deferrer
}


/*
  curryHead(func, tail...)
    -> function (head) { return func(head, tail...) }
  given a function and tail args,
  return a function that takes a head arg,
  and applys head.concat(tail) to the given function

*/

var curryTail = 
  exports.curryTail = function (func) {
    var args = [].slice.call(arguments, 1)
    if(!args.length) return func
    return function (a) {
       return func.apply(this, [a].concat(args))
    }
  }

/*
  curryHead(func, head)
    -> function (tail...) { return func(head, tail...) }

  given a function and head arg, 
  return a function that takes tail args,
  and calls the given function with head.concat(tail)
*/

var curryHead = 
  exports.curryHead = function (func, a) {
    return function () {
      var args = [].slice.call(arguments)
      return func.apply(this, [a].concat(args))
    }
  }

/*
  curryTailHead

  take a given function and return a function that takes tail args, 
  and returns a function that takes a head arg, 
  and that calls the given function with head.concat(tail)
  
  you are certainly deep down the rabit hole when you are using functional composition on curry functions

  this is actually gonna be useful for making spec assertions -- with higer order assertions.
  
  so that you can say
  equal(x, X)

  with:
    
  _equal(X)(x)
  
*/

var curryTailHead = exports.curryTailHead = function (funx) {
  return curryHead (curryTail, funx)
}
