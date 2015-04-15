
//
// adds all the fields from obj2 onto obj1
//

var each = exports.each = function (obj,iterator){
 var keys = Object.keys(obj)
 keys.forEach(function (key){
  iterator(obj[key],key,obj) 
 })
}

var merge = exports.merge = function (a, b) {
  if(arguments.length <= 1)
    return a
  if(a == null)
    return merge.apply(null, [].slice.call(arguments, 1))
  if(b != null)
    each(b, function (v,k){
      a[k] = v
    })
  return merge.apply(null, [a].concat([].slice.call(arguments, 2)))  
}

/*var merge = exports.merge = function (){
  var args = [].slice.call(arguments)
  var obj1 = null, obj2 = null
  while (args.length && obj1 == null) //skip null and undefined
    obj1 = args.shift()
  while(args.length) {
    
    obj2 = null    
    while (args.length && obj1 == null) //skip null and undefined
      obj2 = args.shift()
    var keys = Object.keys(obj2)
    each(obj2, function (v,k){
      obj1[k] = v  
    })
  }
  return obj1
}*/

var RX = /sadf/.constructor
function rx (iterator ){
  return iterator instanceof RX ? function (str) { 
      var m = iterator.exec(str)
      return m && (m[1] ? m[1] : m[0]) 
    } : iterator
}

var times = exports.times = function () {
  var args = [].slice.call(arguments)
    , iterator = rx(args.pop())
    , m = args.pop()
    , i = args.shift()
    , j = args.shift()
    , diff, dir
    , a = []
    
    i = 'number' === typeof i ? i : 1
    diff = j ? j - i : 1
    dir = i < m

  for (; dir ? i <= m : m <= i; i += diff)
    a.push(iterator(i))
  return a
}

var map = exports.map = function (obj, iterator){
  iterator = rx(iterator)
  if(Array.isArray(obj))
    return obj.map(iterator)
  if('number' === typeof obj)
    return times.apply(null, [].slice.call(arguments))  
  //return if null ?  
  var keys = Object.keys(obj)
    , r = {}
  keys.forEach(function (key){
    r[key] = iterator(obj[key],key,obj) 
  })
  return r
}

//this will make instanceof work in the repl

var filter = exports.filter = function (obj, iterator){
  iterator = rx (iterator)
  if(Array.isArray(obj))
    return obj.filter(iterator)

  if(Array.isArray(obj))
    return obj.filter(iterator)
  
  var keys = Object.keys(obj)
    , r = {}
  keys.forEach(function (key){
    var v = iterator(obj[key],key,obj)
    if(v)
      r[key] = v
  })
  return r 
}

var mapKeys = exports.mapKeys = function (ary, iterator){
  var r = {}
  iterator = rx(iterator)
  each(ary, function (v,k){
    r[v] = iterator(v,k)
  })
  return r
}


var mapToArray = exports.mapToArray = function (ary, iterator){
  var r = []
  iterator = rx(iterator)
  each(ary, function (v,k){
    r.push(iterator(v,k))
  })
  return r
}
