var arrays = require('./arrays')
  , objects = require('./objects')
  , types = require('./types')
  , funx = require('./functions')
  , async = require('./async')

;[arrays, objects, types, funx, async].reduce(objects.merge, exports)
