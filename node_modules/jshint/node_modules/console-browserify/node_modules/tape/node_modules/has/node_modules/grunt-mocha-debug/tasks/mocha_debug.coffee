{spawn} = require('child_process')
Stream = require('stream')
express = require('express')
cs = require('coffee-script')
path = require('path')
fs = require('fs')
phantomjsWrapper = require('phantomjs-wrapper')
mocha = require('mocha')
{EventEmitter} = require('events')

reporterMap = require('./lib/reporters')

data =
  debug: {}
  child: null

pluginRoot = __dirname

while not fs.existsSync(path.join(pluginRoot, 'package.json'))
  pluginRoot = path.dirname(pluginRoot)

pluginRoot = path.relative(process.cwd(), pluginRoot)

mochaRoot = path.join(pluginRoot, 'node_modules', 'mocha')
mochaCss = path.join(mochaRoot, 'mocha.css')
mochaJs = path.join(mochaRoot, 'mocha.js')
mochaBin = path.join(mochaRoot, 'bin', 'mocha')
runnerJs = fs.readFileSync(path.join(path.dirname(__dirname),
  'node_modules', 'run-mocha', 'index.js'), 'utf8')


taskDone = testHtml = server = phantomjs = page = reporter = null


setupServer = (grunt, options, done) ->
  app = express()
  app.get(options.testUrl, (req, res) =>
    res.send(testHtml)
  )
  app.use(express.static(process.cwd()))
  {listenPort: port, listenAddress: address} = options
  server = app.listen(port, address, =>
    port = port or server.address().port
    grunt.log.ok("Serving tests on http://#{address}:#{port}")
    setupPhantomJS.call(this, grunt, options, done)
  )


setupPhantomJS = (grunt, options, done) ->
  phantomjsWrapper(timeout: options.phantomTimeout, (err, phantom) =>
    phantomjs = phantom
    grunt.log.ok('PhantomJS started')
    phantomjs.on('closed', =>
      page.close()
      grunt.log.writeln()
      grunt.log.ok('PhantomJS closed')
      phantomjs = null
    )
    phantomjs.createPage((err, webpage) =>
      suiteStack = null
      failed = false
      page = webpage
      if options.displayConsole
        page.on('consoleMessage', (msg) =>
          grunt.log.ok("PhantomJS console: #{msg}")
        )
      if options.displayAlerts
        page.on('alert', (msg) =>
          grunt.log.ok("PhantomJS alert: #{msg}")
        )
      page.on('callback', (event) =>
        reporter.send(event)
      )
      page.on('error', (err) =>
        grunt.log.error("PhantomJS error: #{err.message}")
        taskDone(false)
      )
      page.on('resourceError', (err) =>
        grunt.log.error("PhantomJS error: failed to load #{err.url}")
        taskDone(false)
      )
      {testUrl: url} = options
      {address, port} = server.address()
      page.open("http://#{address}:#{port}#{url}", => )
    )
  )

preparePhantomTest = (grunt, options, done) ->
  # just set the reporter class and the done cb
  taskDone = done
  testHtml = generateHtml.call(this, options)
  modulePath = path.join(__dirname, 'lib', 'reporter.js')
  args = [modulePath, options.reporter]
  opts = stdio: [0, options.reporterOutput, 2, 'ipc']
  reporter = spawn(process.execPath, args, opts)
  reporter.on('close', (code) =>
    if options.reporterOutput != 1
      fs.closeSync(options.reporterOutput)
    done(code == 0)
  )

nodeTest = (grunt, options, done) ->
  files = options.files
  check = @options().check

  if check
    check = grunt.file.expand(check)
  else
    check = files

  checkDebug = =>
    # check which files have debugger statements
    for file in check
      code = grunt.file.read(file)
      if /^\s*debugger/gm.test(code)
        data.debug[file] = true
      else
        delete data.debug[file]
    startMocha()

  startMocha = =>
    dir = path.dirname(__dirname)
    files.unshift(path.join(dir, 'node_modules', 'run-mocha', 'index.js'))
    args = [
      '--ui', options.ui
      '--reporter', options.reporter
      '--compilers', 'coffee:coffee-script'
    ].concat(args, files)
    if options.checkLeaks
      if Array.isArray(options.globals)
        args.unshift(options.globals.join(','))
        args.unshift('--globals')
      args.unshift('--check-leaks')
      
    if data.debug and Object.keys(data.debug).length
      args.unshift('--debug-brk')
    opts = stdio: [0, options.reporterOutput, 2]
    data.child = spawn(mochaBin, args, opts)
    data.child.on('close', (code) ->
      data.child = null
      if options.reporterOutput != 1
        fs.closeSync(options.reporterOutput)
      done(code == 0))

  if data.child # still running(grunt-contrib-watch?), kill and start again
    data.child.on('close', checkDebug)
    data.child.kill('SIGTERM')
  else
    checkDebug()


generateHtml = (options) ->
  files = options.files
  tags = []
  for file in files
    tags.push("<script src=#{file}></script>")

  mochaOpts =
    ui: options.ui
    checkLeaks: options.checkLeaks
    globals: if options.globals instanceof Array then options.globals else []

  body = options.body or
    """
    <div id="mocha">
      <script>
      mochaOpts = #{JSON.stringify(mochaOpts)};
      #{runnerJs}
      </script>
      <script src="#{mochaJs}"></script>
      <script>
      #{mochaBridge}
      </script>
      #{tags.join('\n')}
      <script>
      mocha.run();
      </script>
    </div>
    """

  css = "<link rel=\"stylesheet\" href=\"#{mochaCss}\" />"
       
  return (
    """
    <!DOCTYPE html>
    <html>
      <head>
        <title>test runner</title>
        <meta charset="utf-8">
        #{css}
      </head>
      <body>
      #{body}
      </body>
    </html>
    """
  )


# based on https://github.com/kmiyashiro/grunt-mocha/blob/master/phantomjs/bridge.js
mochaBridge = (->
  mochaInstance = window.Mocha || window.mocha
  HtmlReporter = mochaInstance.reporters.HTML

  GruntReporter = (runner) ->
    # listen for each mocha event
    events = [
      'test'
      'test end'
      'suite'
      'suite end'
      'fail'
      'pass'
      'pending'
      'end'
    ]

    for event in events
      do (event) ->
        runner.on(event, (obj, err) ->
          ev = err: err, type: event
          if obj
            ev.obj =
              title: obj.title
              fullTitle: obj.fullTitle()
              slow: obj.slow()
              duration: obj.duration
              pending: obj.pending
              state: obj.state
            if obj.fn
              ev.obj.fn = obj.fn.toString()
            if obj.total
              ev.obj.total = obj.total()
          callPhantom(ev)
        )

  mocha.setup(
    reporter: if callPhantom? then GruntReporter else HtmlReporter
    ui: mochaOpts.ui or 'bdd'
    ignoreLeaks: not mochaOpts.checkLeaks
    globals: mochaOpts.globals
  )

).toString()


mochaBridge = "(#{mochaBridge})();"


module.exports = (grunt) ->
  grunt.registerMultiTask('mocha_debug', grunt.file.readJSON('package.json').description, ->

    options = @options(
      reporter: 'dot'
      ui: 'bdd'
      checkLeaks: false
      reporterOutput: 1
      displayConsole: true
      displayAlerts: true
      phantomjs: false
      phantomTimeout: 300000
      listenAddress: "127.0.0.1"
      listenPort: 0
      testUrl: '/'
    )

    if not options.src
      grunt.log.error('Need to specify at least one source file')
      return false

    if options.reporter not of reporterMap or not reporterMap[options.reporter]
      grunt.log.error("Invalid reporter '#{options.reporter}'")
      return false
      
    output = options.reporterOutput

    if output != 1
      if typeof output == 'string'
        options.reporterOutput = fs.openSync(output, 'w+')
      else
        grunt.log.error("Invalid reporter output")
        return false

    done = @async()

    options.files = grunt.file.expand(options.src)

    if options.phantomjs
      preparePhantomTest.call(this, grunt, options, done)
      if not server
        setupServer.call(this, grunt, options, done)
      else if not phantomjs or phantomjs.closed
        setupPhantomJS.call(this, grunt, options, done)
      else
        page.reload()
    else
      nodeTest.call(this, grunt, options, done)
  )
