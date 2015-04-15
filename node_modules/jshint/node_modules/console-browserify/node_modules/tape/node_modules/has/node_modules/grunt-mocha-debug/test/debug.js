runMocha({
  'debug': {
    'debug!': function() {
      // only single-line debugger statements are considered
      debugger;
    } 
  }
});
