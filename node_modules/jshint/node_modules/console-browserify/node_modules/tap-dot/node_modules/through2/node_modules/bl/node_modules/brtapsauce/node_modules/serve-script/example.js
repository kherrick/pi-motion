(function() {
    console.log('Test message');
    console.log('I am in ur browsers');
    console.error('Help! An error!');
    console.log('See Ma,', 'multiple', 'args!');
    console.warn('Warning!');
    console.debug('Debug message');

    var count = 0;
    function doLog() {
        if (count++ > 50) {
            return;
        }

        console.log('Doing something', count);
        setTimeout(doLog, Math.random() * 1000);
    }

    doLog();
})();
