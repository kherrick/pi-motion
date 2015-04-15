var //Reporter = require('test-report')
  //, path = require('path')
   fs = require('fs')
  , d = require('d-utils')
  , opts = d.merge({}, require('optimist').argv)
  , spawn = require('child_process').spawn
  , cp = require('child_process')
  , tests = opts._

function deparse (opts) {
  
  return d.mapToArray(opts, function (v,k) {
      return ['--' + k, v]
    }).reduce(function (a,b) {
      return [].concat(a).concat(b)
  },[])
}

function exec(args, opts, callback) {
  if(!callback) callback = opts, opts = {}
  if('string' === typeof args) args = args.split(' ')

  var out = []
    , tmp =  '/tmp/isolated_test_' + Math.random()

  opts.env = d.merge({}, process.env, opts.env || {}, {'NODETEST_reportFile': tmp})

  //  opts = d.merge(opts, {/*killSignal: 'SIGTSTP',*/ timeout: opts.timeout || 30e3})
  // this is the only way that is passing the tests properly.
  // i think that it is something to do with child.kill
  //
  // yup, https://github.com/joyent/node/blob/v0.4.11/lib/child_process.js#L37
  // exec starts the command with sh, and that makes the pid wrong, 
  // so the kill signal does not get sent to the correct process.
  //
  // two approches to this, 
  //   1, post issue, cross fingers
  //   2, glob the args
  //   3, sidestep: write test searcher
  //
  // find base dir
  // readdir
  // filter /test|spec/
  // if empty(list) ['./']
  // map list -> join(item,'*.js')
  // find
  // ... files
  //
  function x(c, f) {
    var s = 'kill -s SIGKILL ' + c.pid
    console.log(s)
    cp.exec(s, f)
  }
//  var timeout = 2 //Math.round(+(opts.timeout || 3e3) / 1000)
//  var child = spawn('/bin/sh', ['-c', [process.execPath, args.join(' '),'& sleep '+timeout+'; kill -s 2 $!'].join(' ')], opts)
  var child = cp.spawn(process.execPath, args, opts)
    , timer = d.delay(child.kill.bind(child), +(opts.timeout || 30e3))('SIGTERM')
  
  child.stdout.on('data', function (chunk) {
    out.push(chunk)
    process.stdout.write(chunk)
  })

  child.stderr.on('data', function (chunk) {
    out.push(chunk)
    process.stderr.write(chunk)
  })

  child.on('exit', function (code, signal) {

    clearTimeout(timer)
    var report
    try {
      var file = fs.readFileSync(tmp)
      report = JSON.parse(file)
      fs.unlinkSync(tmp)
    } catch (err) {
      return callback(err, {name: args.join(' '), status: 'error', failures: [err], failureCount: 1})
    }
    report.output = out.join('')
    callback(null, report)
  })

  return child
}

function runCP (adapter, test, _opts, callback) {
  if (!callback) callback = _opts, _opts = opts 

  delete _opts.isolate
  delete _opts.$0
  delete _opts.reportFile
  delete _opts.recursive

  var command = [adapter, test].concat(deparse(_opts))
    , spawnOpts = {cwd: process.cwd()}
  var all = (process.execPath + ' ' + command.join(' ')).split(' ')

  return exec(command, spawnOpts, callback)

}
exports.runCP = runCP
exports.exec = exec
