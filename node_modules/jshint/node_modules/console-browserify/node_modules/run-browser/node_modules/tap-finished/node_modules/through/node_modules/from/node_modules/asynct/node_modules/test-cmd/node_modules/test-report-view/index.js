
function indent(string, ind) {
  return string.split('\n').map(function(l){
    return (ind === undefined ? '  ' : ind) + l
  }).join('\n')
}

var style = {
  'success'  : 32,
  'invalid': 35,
  'error'    : 31,
  'failure' : 33,
}
exports.showStatus = function (str, status) {
  return '\033[' + style[status] + 'm' + str + '\033[39m';
}

exports.view = function (report, showStatus) {
  showStatus = showStatus || exports.showStatus
/*    'function' == typeof showStatus 
      ? showStatus 
      : exports.showStatus*/

  function view (report) {
    function join (list,funx, ind) {
      return (list && (r = list.map(funx)).length 
        ? '\n' + indent (r.join('\n'), ind)
        : '')
    }

    return showStatus(report.name, report.status) + 
    join(report.failures,exports.viewError) + 
    join(report.tests, view)
  }
    
  return view(report)
}

exports.viewError = function (err) {
  //
  // javascript can throw anything. err can be any type.
  //
  if('object' !== typeof err || !err)
    return 'thrown \'' + typeof err  + '\': ' + err
  if (err.stack)
    return err.stack 
  if (err.message)
    return err.message + (err.type ? ' (' + err.type + ')' : '')
  return JSON.stringify(err)
}