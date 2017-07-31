/**
 * Created by wenjin.wang on 2017/6/23.
 */

var debugmode = false;
var animSpeed = 300;
var iframeOnShow = false;

var module = MODULE_TV_CONTROLLER; //0:tvcontroller,1:sync display; 2:wireless store; 3:setting projecotr wifi
var netStatus = 0x000;
var SETTING_CHECK = TV_CONTROLLER_CHECK;
var projectorIP;
var currentFrame = "index";
var getIpTimer;
var mWarningDlg;
var loadingToast;

var mFrameWrap;
var deviceInfo;

/**
 * document init
 * **/
$(document).ready(function () {
    // var platform = navigator.userAgent;
    // var isAndroid = platform.indexOf('Android') > -1 || platform.indexOf('Adr') > -1;
    // showResult("isAndroid:", isAndroid);
    // if (isAndroid) {
    //     XBack.listen(function() {
    //         if (iframeOnShow) {
    //             switchFrame();
    //             XBack.record();
    //         } else {
    //             showExitDialog(function(msg) {
    //                 console.log('showExitDialog:' + msg);
    //                 if (msg == sure) {
    //                     wx.closeWindow();
    //                     return;
    //                 } else {
    //                     XBack.record();
    //                 }
    //             });
    //         }
    //     });
    // }

    console.log(typeof(fxy));

    initView();
    var doheight = $(document).height();
    showResult("doheight", doheight);
     var bcolor = $(document.body).css("background-color");
    showResult("body color", bcolor);
    var htmlcolor = $("html").css("background-color");
    showResult("htmlcolor color", htmlcolor);
    setSettingCheck();

    registerEventListener();
    registerBtListener();
    registerWifiListener();
    registerViewListener();

    /**
     * set listener into wechat
     * */
    inntWeChat();
    /**
     * init web app module
     * */
    // initController();
    // initWireless();
});

function initView() {
    mFrameWrap = $('.iFrameWrap');
    mWarningDlg = $("#id_WarningDlg");
    $(".weui-dialog__btn").on("click", function () {
        mWarningDlg.fadeOut(200);
    });
    showLoadingToast();
}

function setSettingCheck() {
    // module = getUrlParam("module");
    module = FRAME_WIFI_SETTING;
    switchFrame(FRAME_WIFI_SETTING);
    sessionStorage.module = module;
    switch (module) {
        case MODULE_TV_CONTROLLER:
            document.title = '遥控器';
            SETTING_CHECK = TV_CONTROLLER_CHECK;
            break;
        case MODULE_SYNC_DISPLAY:
            document.title = '快捷同屏';
            SETTING_CHECK = SYNC_DISPLAY_CHECK;
            break;
        case MODULE_WIRELESS_STORE:
            document.title = '无线存储';
            SETTING_CHECK = WIRELESS_STORE_CHECK;
            break;
        case MODULE_WIFI_SETTINGS:
            document.title = '设置网络';
            SETTING_CHECK = PROJECTOR_WIFI_SETTING_CHECK;
            break;
        default:
            document.title = '遥控器';
            SETTING_CHECK = TV_CONTROLLER_CHECK;
            break;
    }
}

function checkSetting() {
    if (((SETTING_CHECK & BT_STATUS_OK) == BT_STATUS_OK) && ((netStatus & BT_STATUS_OK) != BT_STATUS_OK)) {
        if (currentFrame != FRAME_BT) {
            switchFrame(FRAME_BT);
        }
        hideLoadingToast();
        return;
    }

    if (((SETTING_CHECK & WIFI_STATUS_OK) == WIFI_STATUS_OK) && ((netStatus & WIFI_STATUS_OK) != WIFI_STATUS_OK)) {
        hideLoadingToast();
        subEvent(EVENT_IP_REQ);
        showLoadingToast("检查网络");
        return;
    }

    if (((SETTING_CHECK & DEVICE_IN_ROOM_OK) == DEVICE_IN_ROOM_OK) && ((netStatus & DEVICE_IN_ROOM_OK) != DEVICE_IN_ROOM_OK)) {
        if (deviceInfo) {
            pingHttpGet(projectorIP, pingCallback);
        } else {
            ping(projectorIP, pingCallback, 2000);

        }
        return;
    }
    handleFrame();
}

function handleFrame() {
    if (module == MODULE_TV_CONTROLLER) {
        switchFrame(FRAME_CONTROLLER);
    } else if (module == MODULE_SYNC_DISPLAY) {
        switchFrame(FRAME_AIRPLAY);
    } else if (module == MODULE_WIRELESS_STORE) {
        switchFrame(FRAME_WIRELESS_STORE);
    } else if (module == MODULE_WIFI_SETTINGS) {
        if (currentFrame != FRAME_WIFI) {
            switchFrame(FRAME_WIFI);
        }
    }
}

function registerViewListener() {
    $('#id_pull_tab').on('touchstart', function () {
        switchFrame();
    });
}

function registerEventListener() {
    $(document).on(wxready, function () {
    });
    $(document).on(EVENT_PROJECT_BT_CONNECTED, function () {
        resetValue();
        netStatus |= BT_STATUS_OK;
        checkSetting();
    });
    $(document).on(EVENT_PROJECT_BT_DISCONNECTED, function () {
        netStatus &= (~BT_STATUS_OK);
        checkSetting();
    });
    $(document).on(EVENT_DEVICE_INFO, function (event, info) {
        deviceInfo = info;
        showResult("deviceInfo:", deviceInfo);
    });

    $(document).on(EVENT_WIFI_CONNECTED, function () {
        netStatus |= WIFI_STATUS_OK;
        checkSetting();
    });
    $(document).on(EVENT_WIFI_DISCONNECTED, function () {
        netStatus &= (~WIFI_STATUS_OK);
        if (currentFrame != FRAME_WIFI) {
            switchFrame(FRAME_WIFI);
        } else {
            $('.weui-dialog__bd').text("投影仪网络连接失败");
            mWarningDlg.fadeIn(100);
        }
    });
    $(document).on(EVENT_IP_PING_SUCCESS, function () {
        netStatus |= DEVICE_IN_ROOM_OK;
        checkSetting();
    });
    $(document).on(EVENT_IP_PING_FAIL, function () {
        if (currentFrame != FRAME_WIFI) {
            switchFrame(FRAME_WIFI);
        }
        $('.weui-dialog__bd').text("请保持手机与投影在一个局域网内");
        mWarningDlg.fadeIn(100);
    });
}

function registerBtListener() {
    $(document).on(btoff, function () {
        subEvent(EVENT_PROJECT_BT_DISCONNECTED);
    });
    $(document).on(btconnecting, function () {
    });
    $(document).on(deviceconnecting, function () {
    });
    $(document).on(devicenone, function () {
        subEvent(EVENT_PROJECT_BT_DISCONNECTED);
    });
    $(document).on(deviceconnecterror, function () {
        subEvent(EVENT_PROJECT_BT_DISCONNECTED);
    });
    $(document).on(devicedisconnected, function () {
        subEvent(EVENT_PROJECT_BT_DISCONNECTED);
    });
    $(document).on(deviceconnected, function () {
        sendCommandBase64(getDeviceInfoCmd(), function (res) {
            subEvent(EVENT_PROJECT_BT_CONNECTED);
        });
    });
}

function registerWifiListener() {
    $(document).on(EVENT_IP_REQ, function (e, data) {
        sendCommandBase64(getProjectIP());
        getIpTimer = setTimeout(function (e) {
            subEvent(EVENT_PROJECT_BT_DISCONNECTED);
        }, 10000);
    });
    $(document).on(EVENT_IP_RES, function (e, data) {
        window.clearTimeout(getIpTimer);
        projectorIP = data;
        if (projectorIP == "") {
            subEvent(EVENT_WIFI_DISCONNECTED);
        } else {
            subEvent(EVENT_WIFI_CONNECTED);
        }
    });


}

function pingCallback(result) {
    if (result == true) {
        subEvent(EVENT_IP_PING_SUCCESS);
    } else {
        subEvent(EVENT_IP_PING_FAIL);
    }
}

function resetValue() {
    projectorIP = 0;
    netStatus = 0x000;
}

function switchFrame(index) {
    currentFrame = index;
    mFrameWrap.css('dispaly', 'block');
    mFrameWrap.animate({
            'margin-left': '100%',
        },
        animSpeed / 100,
        function () {
        });
    $('#iframe_filemanager').remove();
    var url;
    var loadFunction;
    var name;
    switch (index) {
        case FRAME_BT:
            url = 'bt_wizard_frame.html';
            loadFunction = "onload='iframeBTLoad()'";
            name = FRAME_BT;
            break;
        case FRAME_WIFI:
             if ((MODULE_SYNC_DISPLAY == module) || (MODULE_WIRELESS_STORE == module)) {
                loadFunction = "onload='iframeWifiHistoryLoad()'";
                // url = 'wifi_history_frame.html';
                url = convertURL('wifi_history_frame.html');
                name = FRAME_WIFI_HISTORY;
            } else {
                url = 'wifi_wizard_frame.html';
                loadFunction = "onload='iframeWifiLoad()'";
                name = FRAME_WIFI;
            }

            break;
        case FRAME_AIRPLAY:
            url = 'airplay_wizard_frame.html';
            loadFunction = "onload='iframeAirPlayLoad()'";
            name = FRAME_AIRPLAY;
            break;
        case FRAME_WIRELESS_STORE:
            url = "http://" + projectorIP + ":45678";
            //url = "http://192.168.12.47:45678";
            loadFunction = "";
            name = FRAME_WIRELESS_STORE;
            break;
        case FRAME_CONTROLLER:
            loadFunction = "onload='iframeControllerLoad()'";
            url = 'controller_wizard_frame.html';
            name = FRAME_CONTROLLER;
            break;
        case FRAME_WIFI_SETTING:
            loadFunction = "onload='iframeWifiSettingLoad()'";
            url = 'wifi_setting_frame.html';
            name = FRAME_WIFI_SETTING;
            break;
    }


    var frameTag = "<iframe id='iframe_filemanager'" + loadFunction + " name='" + name + "' src='" + url + "'  frameborder='no' style='width:100%;height:100%;;border-width:0px ;background-color: white'  ></iframe>";
    mFrameWrap.append(frameTag);
    mFrameWrap.animate({
            'margin-left': '0%',
        },
        animSpeed,
        function () {
        });
    iframeOnShow = !iframeOnShow;
    hideLoadingToast();
}

function showLoadingToast() {
    if (!loadingToast) {
        loadingToast = $("#loading_toast");
    }
    var msg;
    arguments[0] ? msg = arguments[0] : msg = "连接中";
    loadingToast.find(".weui-toast_content").text(msg);
    loadingToast.fadeIn();

}

function hideLoadingToast() {
    if (!loadingToast) {
        loadingToast = $("#loading_toast");
    }
    loadingToast.fadeOut("100");
}
