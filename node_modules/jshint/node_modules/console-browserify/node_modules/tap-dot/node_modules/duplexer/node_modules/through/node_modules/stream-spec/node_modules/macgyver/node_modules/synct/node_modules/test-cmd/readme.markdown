# test command

simple module for making test runners.

This module is responsable for parsing the arguments, loading the test adapter,
saving the report and being a process.

also see [test-report](http://github.com/dominictarr/test-report)

TODO:
  * parse --exclude option of dirnames to ignore.
  * if called without arguments default to ./test/*.js recursively, and ignore directories named
  `fixtures` or `helpers`
  * export a simple function to include within tests so that they may be directly.
    `require('test-cmd').test(module)`
    this could automatically check !module.parent etc
  