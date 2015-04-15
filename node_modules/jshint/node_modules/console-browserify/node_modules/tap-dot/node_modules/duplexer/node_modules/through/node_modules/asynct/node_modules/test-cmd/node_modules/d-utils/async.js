
//
// wrap a function with setTimeout but let it be called like normal.
//

var delay = exports.delay = function (laters, time) {
  time = time || 0
  return function () {
    var args = [].slice.call(arguments)
    return setTimeout(function () {
      laters.apply(null, args)
    }, time)  
  }
}

// 
// recursively compose async function.
// the next function becomes the callback of the first
// otherwise, the next function is called with the args of the first callback
//
// nothing special is done to the error parameter
//

exports.compose = compose

function compose () {
  var funx = [].slice.call(arguments)
  if(funx.length <= 1)
    return funx[0]
  var f1 = funx.shift()
  var f2 = funx.shift()
  
  funx.unshift(function () {
    var args = [].slice.call(arguments)
    var callback = args.pop()
    args.push(function () {
      var args = [].slice.call(arguments)
      args.push(callback)    
      f2.apply(this, args)   
    })
    f1.apply(this, args)   
  })
  return compose.apply(null, funx)
}

exports.fallthrough = fallthrough

function fallthrough () {
  var args = [].slice.call(arguments)
    , callback = args.pop()
  args.unshift(null)
  callback.apply(this, args)
}

exports.tryCatchPass = tryCatchPass

function tryCatchPass (_try,_catch,_pass) {
  //make _try safe
  return compose(safe(_try), function () {
    var args = [].slice.call(arguments)
      , next = args.pop()
      , err  = args.shift()
    if(err && _catch)
      safe(_catch).call(this, err, next)
    else if (!err && _pass)
      safe(_pass).apply(null, args.concat(next))
    else
      next.apply(this, [err].concat(args))
  })

}

exports.safe = safe

function safe (funx) {
  return function () {
    var _callback = arguments[arguments.length - 1]
      , n = 0
      , callback = 
    arguments[arguments.length - 1] = function () {
      var args = [].slice.call(arguments)
      if(!n++)
        _callback.apply(this,args)
      else
        console.log('callback function ' + _callback.name + ' called:' + n + ' times')
    }
    try {
      funx.apply(null, arguments)
    } catch (err) {
      callback(err)
    }
  }
}

exports.toAsync = toAsync

function toAsync (func, a, b) {
  return function () {
    var args = [].slice.call(arguments)
      , callback = args.pop()
      , r
    try {
      r = func.apply(this, args)
    } catch (err) {
      return callback (err)
    }
    callback (null, r)  
  }
}
