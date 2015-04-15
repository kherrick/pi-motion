var fs = require('fs')
var join = require('path').join
var resolve = require('path').resolve
var makeFilter = require('./lib/filter')

module.exports = transform
function transform(path, options) {
  options = options || {}
  path = resolve(path)
  var root = resolve(arguments[2] || path)
  options.filter = makeFilter(options.filter || options.grep)

  var stat = fs.statSync(path)
  if (stat.isDirectory()) {
    var dir = fs.readdirSync(path);
    return dir
      .map(function (child) {
        if (child !== 'node_modules' && child !== '.git') {
          return transform(join(path, child), options, root)
        } else {
          return []
        }
      })
      .reduce(function (a, b) {
        return a.concat(b)
      }, [])
  } else {
    if (!options.filter(path.substring(root.length).replace(/\\/g, '/'))) return []
    var content = fs.readFileSync(path, 'utf8').toString()
    if (/\r\n/g.test(content)) {
      if (!options.preview) {
        fs.writeFileSync(path, content.replace(/\r\n/g, '\n'), 'utf8')
      }
      return [path]
    } else {
      return []
    }
  }
}