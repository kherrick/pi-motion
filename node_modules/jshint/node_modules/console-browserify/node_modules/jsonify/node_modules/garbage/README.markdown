garbage
=======

Generate random garbage json data.

example
=======

````
> var garbage = require('garbage')
> garbage()
4.136307826118192
> garbage()
-7.327021010101647
> garbage()
{ '0\t4$$c(C&s%': {},
  '': 2.221633433726717,
  '!&pQw5': '<~.;@,',
  'I$t]hky=': {},
  '{4/li(MDYX"': [] }
> garbage()
false
````

methods
=======

var garbage = require('garbage');

garbage(count=20)
-----------------

Generate a random type of object with at most `count` nested types.

Alias: garbage.json

garbage.object(count=20)
------------------------

Generate a random object with at most `count` randomly generated descendants.

garbage.array(count=20)
------------------------

Generate a random array with at most `count` randomly generated descendants.

garbage.string()
----------------

Generate a randomish string.

garbage.boolean()
-----------------

Returns true or false.

garbage.number()
----------------

Returns a random float but more likely to return floats closer to 0.

install
=======

With [npm](http://npmjs.org) do:

    npm install garbage
