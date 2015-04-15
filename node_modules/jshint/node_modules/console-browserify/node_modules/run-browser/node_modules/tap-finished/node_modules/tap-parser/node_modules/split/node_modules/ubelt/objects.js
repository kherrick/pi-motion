
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

var findReturn = exports.findReturn = function (obj, iterator) {
  iterator = rx(iterator)
  if(obj == null)
    return
  var keys = Object.keys(obj)
    , l = keys.length
  for (var i = 0; i < l; i ++) {
    var key = keys[i]
      , value = obj[key]
    var r = iterator(value, key)
    if(r) return r
  }
}

var find = exports.find = function (obj, iterator) { 
  iterator = rx(iterator)
  return findReturn (obj, function (v, k) {
    var r = iterator(v, k)
    if(r) return v
  })
}

var findKey = exports.findKey = function (obj, iterator) { 
  iterator = rx(iterator)
  return findReturn (obj, function (v, k) {
    var r = iterator(v, k)
    if(r) return k
  })
}

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


diff = exports.diff = function (old, nw) {
  var ab = deepMerge (nw,  old)
    , s = {}
     
  each(ab, function (ignore, k) {

    //if the property is not in the new object, it must have been deleted.
    if (nw[k] == null)       
      s[k]  = null //null on a diff means to delete that property.
    else if ('object' === typeof nw[k] && 'object' === typeof old[k] && old[k]) 
      s[k] = diff(old[k], nw[k])
    else if (nw[k] !== old[k])   
      s[k] = nw[k] === undefined ? null : nw[k]

  })
  return s
  
}

patch = exports.patch = function (old, ptch) {
  var nw = deepMerge({},  old)
    
  each(ptch, function (ignore, k) {

    //if the property is not in the new object, it must have been deleted.
    if (ptch[k] === null)        
      delete nw[k]
    else if ('object' === typeof ptch[k]) 
      nw[k] = patch(old[k], ptch[k])
    else 
      nw[k] = ptch[k]

  })

  return nw
  
}

deepMerge = exports.deepMerge = function (old, nw) {
  var ab = merge({}, nw,  old)
    , s = Array.isArray(nw) ? [] : {}
  each(ab, function (ignore, k) { //on each key in ab, 
    
    s[k] = (nw[k] === undefined ? old[k] : nw[k])
    if ('object' === typeof nw[k] && 'object' === typeof old[k] && old[k] && nw[k] && old[k]) {
        s[k] = deepMerge (old[k], nw[k])
    }

  })
 
  return s
}

var path = exports.path = function (object, path) {

  for (var i in path) {
    if(object == null) return undefined
    var key = path[i]
    object = object[key]
  }
  return object
}