(function() {
    var container = document.getElementById('container'),
        output = document.getElementById('output'),
        console = (window.console || (window.console = {}));

    function bind(func, context) {
        if (typeof func.bind === 'function') {
            // ES5 browsers
            return func.bind(context);
        } else if (typeof func.apply === 'function') {
            // Pre-ES5 browsers
            return function() { func.apply(context, arguments); };
        } else {
            // Old IE doesn't care about context
            // and has no `.apply` on native functions
            return func;
        }
    }

    function logger(type, oldLog) {
        oldLog = bind(oldLog || function() { }, console);

        return function() {
            var isScrolled = (container.scrollTop ===
                (container.scrollHeight - container.offsetHeight));

            var message = Array.prototype.join.call(arguments, ' ');
            oldLog(message);

            var node = document.createElement('pre');
            node.className = type;
            node.appendChild(document.createTextNode(message));
            output.appendChild(node);
            output.appendChild(document.createTextNode('\r\n'));

            // Scroll to bottom if it was previously scrolled to the bottom
            if (isScrolled) {
                container.scrollTop = container.scrollHeight - container.offsetHeight;
            }
        };
    }

    console.log = logger('log', console.log);
    console.debug = logger('debug', console.debug);
    console.info = logger('info', console.info);
    console.warn = logger('warn', console.warn);
    console.error = logger('error', console.error);
})();
