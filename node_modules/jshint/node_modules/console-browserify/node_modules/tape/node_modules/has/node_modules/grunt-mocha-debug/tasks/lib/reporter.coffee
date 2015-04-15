reporterMap = require('./reporters')
{EventEmitter} = require('events')

Reporter = reporterMap[process.argv[2]]
runner = null
suiteStack = null

process.on('message', (event) =>
  {obj, type, err} = event

  switch type
    when 'test'
      suiteStack[suiteStack.length - 1].tests.push(obj)
    when 'suite'
      obj.suites = []
      obj.tests = []
      if not runner
        suiteStack = [obj]
        runner = new EventEmitter()
        runner.suite = obj
        runner.total = obj.total
        reporter = new Reporter(runner)
        runner.emit('start')
      else
        suiteStack[suiteStack.length - 1].suites.push(obj)
        suiteStack.push(obj)
    when 'suite end'
      suiteStack.pop()

  if obj
    slow = obj.slow
    obj.slow = -> slow
    fullTitle = obj.fullTitle
    obj.duration = obj.duration
    obj.fullTitle = -> fullTitle
    obj.parent = suiteStack[suiteStack.length - 1] || null
    obj.fn = obj.fn
    obj.pending = obj.pending
    obj.duration = obj.duration
    obj.state = obj.state

  # forward events to the fake runner
  runner.emit(type, obj, err)

  if type == 'end'
    process.exit(0)
)
