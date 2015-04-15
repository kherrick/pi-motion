
var types = ['function','number','string','boolean']

types.forEach(function (type){
  exports['is' + type.charAt(0).toUpperCase() + type.slice(1)] = function (other){
    return type === typeof other
  }
})


exports.isObject = function (obj){
  return (obj !== null && 'object' === typeof obj)
}