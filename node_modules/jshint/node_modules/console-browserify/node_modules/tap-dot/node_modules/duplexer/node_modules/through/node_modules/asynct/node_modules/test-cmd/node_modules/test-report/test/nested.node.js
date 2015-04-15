
var it = require('it-is').style('colours')
  , Reporter = require('test-report')
  , helper = require('test-helper')
  , test = module.exports
  , assert = require('assert')
  , exampleIsValid = it.has({
      name: 'outer'
    , status: 'success'
    , failures: []
    , tests: [{
        name: 'inner'
      , status: 'success'
      , failures: []
      , tests: [{
          name: 'TEST'
        , status: 'success'
        , failures: []
        }] 
      }]
    })
  , exampleIsValid2 = it.has({
      name: 'outer'
    , status: 'error'
    , failures: []
    , tests: [{
        name: 'inner'
      , status: 'error'
      , failures: []
      , tests: [{
          name: 'FAIL'
        , status: 'error'
        , failures: [{}]
        }] 
      }]
    })


exports ['subreport as test'] = function () {

  var reporter = new Reporter ('outer')
    , reporter2 = new Reporter ('inner')
    
  reporter2.test('TEST')

  reporter.test(reporter2.report)
  
  exampleIsValid(reporter.report)

}

exports ['add subreport'] = function () {

  var reporter = new Reporter ('outer')
    , reporter2 = reporter.subreport('inner')

  reporter2.test('TEST')
  
  exampleIsValid(reporter.report)

}

exports ['test name as path array'] = function () {

  var reporter = new Reporter ('outer')

  reporter.test(['inner','TEST'])
  
  exampleIsValid(reporter.report)

}

exports ['test name as path array - with error'] = function () {

  var reporter = new Reporter ('outer')

  reporter.test(['inner','FAIL'], new Error ('ERR'))
  
  exampleIsValid2(reporter.report)

}

helper.runSync(exports)
