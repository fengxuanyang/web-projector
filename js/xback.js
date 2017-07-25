! function(pkg, undefined) {
 
    var STATE_BACK = 'back';
    var element;

    var onPopState = function(event) {
        fire();
        //we chat  not support state
        // event.state === STATE_BACK && fire();
    };

    var record = function() {
        if (history.state != STATE_BACK) {
            history.pushState(STATE_BACK, null, location.href);
        }
    };

    var fire = function() {
        var event = document.createEvent('Events');
        event.initEvent(STATE_BACK, false, false);
        element.dispatchEvent(event);
    };

    var listen = function(listener) {
         element.addEventListener(STATE_BACK, listener, false);
    };

    ! function() {
        element = document.createElement('span');
        window.addEventListener('popstate', onPopState);
        this.listen = listen;
        this.record = record;
        record();
    }.call(window[pkg] = window[pkg] || {});

}('XBack');
