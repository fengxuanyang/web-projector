var btFrame;


function iframeBTLoad() {
    btFrame = $('#iframe_filemanager').contents();
    btFrame.find('body').on('touchmove', function(e) {
        e.preventDefault();
    });
    btFrame.find('#bt_retryconnect').on('touchstart touchend', function(event) {
        if (event.type === 'touchstart') {
            $(this).css({
                'background-position': '100%  0%'
            });
            showLoadingToast();
            connectWXDevice();
            return;
        }
        if (event.type === 'touchend') {
            $(this).css({
                'background-position': '100%  100%'
            });
        }

    });

}
