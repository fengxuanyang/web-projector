var userAgent = navigator.userAgent.toLowerCase();
var airplayFrame;
var iosSystem = false;

function iframeAirPlayLoad() {
    sendCommandBase64(getReqScreenSyncCmd(), function(result) {
        hideWaiting();
    });

    iosSystem = isIos();
    airplayFrame = $("#iframe_filemanager").contents();
    airplayFrame.find("body").on("touchmove", function(e) {
        e.preventDefault();
    });
    if (iosSystem) {
        airplayFrame.find(".airplay-dl-btn-div").css({
            "display": "none",
        });

        airplayFrame.find(".airplay-bg").attr({
            "src": "./res/airplay_ios.jpg",
        });
        airplayFrame.find("#id_dec_openairplay").html("请打开手机Airplay,使用投屏功能");

    } else {
        airplayFrame.find(".airplay-download-btn").on("click", function() {
            window.location.assign(airPlaydownLoadUrl);
        });
    }
}
