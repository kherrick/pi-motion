mocha = require('mocha')

r = mocha.reporters

module.exports =
  'dot': r.Dot
  'doc': r.Doc
  'tap': r.TAP
  'json': r.JSON
  'list': r.List
  'min': r.Min
  'spec': r.Spec
  'nyan': r.Nyan
  'xunit': r.XUnit
  'markdown': r.Markdown
  'progress': r.Progress
  'landing': r.Landing
  'json-cov': r.JSONCov
  'html-cov': r.HTMLCov
  'json-stream': r.JSONStream
  'teamcity': r.Teamcity
