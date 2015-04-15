

function empty(array){
  return !!!array.length
}


function throwIfEmpty (array, method){
  if(!array.length){
    var err = new Error('arrays.' + method + ' cannot take an empty array')
    err.type = 'EmptyArray'
    throw err
  }
}

function strictInit (array){
  throwIfEmpty(array)
  return [].slice.call(array, 0, array.length - 1)
}
function strictTail(array){
  throwIfEmpty(array)
  return [].slice.call(array, 1, array.length )
}
function strictLast(array){
  throwIfEmpty(array)
  return array[array.length -1]  
}
function strictHead(array){
  throwIfEmpty(array)
  return array[0]  
}

function init (array){
  return empty(array) ? [] : [].slice.call(array, 0, array.length - 1)
}
function tail(array){
  return empty(array) ? [] : [].slice.call(array, 1, array.length )
}
function last(array){
  return empty(array) ? null : array[array.length - 1]
}
function head(array){
  return empty(array) ? null : array[0]
}

module.exports = {
  throwIfEmpty: throwIfEmpty,
  init: init,
  tail: tail,
  last: last,
  head: head,
  strictInit: strictInit,
  strictTail: strictTail,
  strictLast: strictLast,
  strictHead: strictHead,
  empty: empty
}