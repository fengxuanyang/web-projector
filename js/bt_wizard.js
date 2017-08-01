var btFrame;
var retryBtn;

function iframeBTLoad() {
    btFrame = $('#iframe_filemanager').contents();
    btFrame.find('body').on('touchmove', function (e) {
        e.preventDefault();
    });
    retryBtn = btFrame.find('#bt_retryconnect');
    retryBtn.on('touchstart touchend', function (event) {
        if (event.type === 'touchstart') {
            retryBtn.css({
                'background-color': '#ff8a00'
            });
            // showLoadingToast();
            connectWXDevice();
            return;
        }
        if (event.type === 'touchend') {
            retryBtn.css({
                'background-color': '#ffa11b'
            });
        }
    });

}
