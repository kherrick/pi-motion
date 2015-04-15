sinon-restore
=============

This package simply adds restoreAll() to sinon.

Usage:
```
var sinon = require('sinon-restore');
// use sinon as usual

// restore all fakes when ready...
sinon.restoreAll()
```

sinon also has sandboxing (http://sinonjs.org/docs/#sandbox) 
which also solves this problem, but I personally didn't like 
the syntax.


