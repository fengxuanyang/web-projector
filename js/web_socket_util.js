var webSocketUtil = (function () {
    var instance = null;
    function  WebSocketUtil() {
        this.util = "Util !";
    };

    function createInstance() {
        return new WebSocketUtil();
    };
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();