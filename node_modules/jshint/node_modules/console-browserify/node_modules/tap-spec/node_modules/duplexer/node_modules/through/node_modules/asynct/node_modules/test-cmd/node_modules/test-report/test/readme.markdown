#tests are now a seperately distributable module. 

I'm trying this crazy new thing to decouple tests from what they test.
then, when a new version comes out, you can tell if it's backwards compatible if it passes the old tests
a new version should introduce a test which reproduces the issue (or whatever) so old versions should fail
against the new test.

this is my first try, so we'll see what happens.

making a small change to see if I'll still be able to edit a submodule and push it...