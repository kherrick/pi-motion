#!/usr/bin/env node

var fs = require('fs')
var program = require('commander')
var linify = require('../')

program
//  .version(require('../package.json').version)
  .usage('<command> <path> [options]')
  .option('-g, --grep <filter>', 'filter the files that are transformed (e.g. **.js)')
  .option('-s, --silent', 'don\'t list the transformmed files')

program
  .command('transform [path]')
  .description('Transform the given directory')
  .option('-g, --grep <filter>', 'filter the files that are transformed (e.g. **.js)')
  .option('-s, --silent', 'don\'t list the transformmed files')
  .action(function (dir) {
    var transformmed = linify(dir || process.cwd(), program)
    if (program.silent) return
    for (var i = 0; i < transformmed.length; i++) {
      console.log(transformmed[i])
    }
  })

program
  .command('preview [path]')
  .description('Get a list of the files that would be transformed')
  .option('-g, --grep <filter>', 'filter the files that are transformed (e.g. **.js)')
  .action(function (dir) {
    program.preview = true
    var transformmed = linify(dir || process.cwd(), program)
    if (program.silent) return
    for (var i = 0; i < transformmed.length; i++) {
      console.log(transformmed[i])
    }
  })

program
  .command('init [path]')
  .description('Add a prepublish script to run linify transform')
  .option('-g, --grep <filter>', 'filter the files that are transformed (e.g. **.js)')
  .action(function (dir) {
    var command = 'linify transform'
    if (dir) {
      if (/\s|&/.test(dir)) {
        command +=' ' + JSON.stringify(dir)
      } else {
        command += ' ' + dir
      }
    }
    if (program.grep) {
      if (/\s|&/.test(program.grep)) {
        command +=' --grep ' + JSON.stringify(program.grep)
      } else {
        command += ' --grep ' + program.grep
      }
    }
    var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    if (!pkg.devDependencies) pkg.devDependencies = {}
    if (!pkg.scripts) pkg.scripts = {}

    pkg.devDependencies.linify = '~' + require('../package.json').version
    pkg.scripts.prepublish = (pkg.scripts.prepublish ? pkg.scripts.prepublish + ' && ' : '') + command
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, '  '))
  })

program.parse(process.argv)

if (['transform', 'preview', 'init'].indexOf(process.argv[2]) == -1) {
  program.help()
}