"use strict"

var fs = require('fs')
var crypto = require('crypto')

var VALID_ALGORITHMS = [
  'md4',
  'md5',
  'sha1',
  'sha256'
]

module.exports = function hashFile(fileName, algorithm, fn) {
  // algorithm is optional
  if (arguments.length === 2 && typeof algorithm === 'function') {
    fn = algorithm
    algorithm = 'md5'
  }
  

  if (VALID_ALGORITHMS.indexOf(algorithm) === -1) {
    var err = new Error('unsupported algorithm:' + algorithm)
    if (fn) return fn(err)
    throw err
  }

  var shasum = crypto.createHash(algorithm)

  function end() {
    var digest = shasum.digest('hex')
    fn && fn(null, digest)
    return digest
  }

  // passed in a Buffer, not a filename
  if (Buffer.isBuffer(fileName)) {
    shasum.update(fileName)
    return end()
  }

  if (typeof fn != 'function') throw new Error('must supply a callback function')

  var stream = fs.ReadStream(fileName, {
    bufferSize: 4024 * 1024
  })

  stream.on('data', function(data) {
    shasum.update(data)
  })

  stream.on('error', function(err) {
    fn(err)
  })

  stream.on('end', end)

  return shasum
}
