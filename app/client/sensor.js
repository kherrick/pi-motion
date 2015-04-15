module.exports = {
  activated: function() {
    'use strict';
    $('circle').css('fill', '#57b663');
  },
  deactivated: function() {
    'use strict';
    $('circle').css('fill', '#eb7670');
  }
};