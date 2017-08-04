var historyFrame;
var wifiSsidSelect;
var wifiSelect;
var option;
var wifiSsidInput;
var wifiPswInput;

var currentWifiSsid;
var currentWifiPsw;
var wifiList;
var loadingToast;


function iframeWifiHistoryLoad() {
    historyFrame = $('#iframe_filemanager').contents();
    if (historyFrame.has("#frame_wifi_history").length) {
        historyFrame = $('#iframe_filemanager').contents().find("#frame_wifi_history").contents();
    }
    if (isIos()) {
        historyFrame.find('#wifihistory_navpage').css({
            'background-image': 'url(res/wifihistory_ios_bg.jpg)',
        });
        historyFrame.find('#airplay_downoad_wrapper').css({
            'display': 'none',
        });
    }
    historyFrame.find('body').on('touchmove', function (e) {
        e.preventDefault();
    });
    loadingToast = historyFrame.find("#loading_toast");
    sendCommandBase64(getWifiHistoryCmd(), function () {
        showResult("getWifiHistoryCmd", "result");
    }, true);
    showWifiHistoryLoadingToast("获取网络");
    wifiSsidSelect = historyFrame.find('#wifihistory_select_wifissid');
    wifiSsidInput = historyFrame.find('#wifihistory_input_ssid');
    wifiPswInput = historyFrame.find('#wifihistory_input_psw');
    historyFrame.find('#wifihistory_next_btn').on('click', function (event) {
        currentWifiSsid = wifiSsidInput.val() + "";
        currentWifiPsw = wifiPswInput.val() + "";
        if (!currentWifiSsid) {
            alert("请输入正确的wifi名称");
            return;
        }
        historyFrame.find('#wifihistory_mainpage').css({
            display: 'none',
        });
        historyFrame.find("#wifihistory_navpage").css({
            display: 'block',
        });
        $(document).on(EVENT_WIFI_LSIT, function (event, wifiList) {
            for (var i = 0; i < wifiList.length; i++) {
                var wifiinfo = wifiList[i];
                if (wifiinfo.getSsid() == currentWifiSsid) {
                    historyFrame.find('#wifihistory_result').css('display', 'none');
                    if (wifiinfo.getState() == proto.airsync.WifiState.ACTIVE) {
                        subEvent(EVENT_IP_REQ);
                        return;
                    }
                }
            }
            historyFrame.find('#wifihistory_result').css('display', 'block');
        });
        sendCommandBase64(getWifiSSIDConnectCmd(currentWifiSsid, currentWifiPsw));

    });


    historyFrame.find('#wifihistory_previous_btn').on('click', function (event) {
        historyFrame.find('#wifihistory_mainpage').css({
            display: 'block',
        });
        historyFrame.find("#wifihistory_navpage").css({
            display: 'none',
        });
        historyFrame.find('#wifihistory_result').css('display', 'none');


    });

    historyFrame.find('#airplay_downoad_lebo').on('click', function (event) {
        window.location.assign(airPlaydownLoadUrl);
    });

    historyFrame.find('#wifihistory_connect_btn').on('click', function (event) {
        subEvent(EVENT_IP_REQ);
    });

    //  wifi history list result  
    $(document).on(EVENT_WIFI_HISTORY_LSIT, function (event, list) {
        hideWifiHistoryLoadingToast();
        wifiList = list;
        for (var i = 0; i < wifiList.length; i++) {
            var wifiInfo = wifiList[i];
            var ssid = wifiInfo.getSsid();
            var psw = wifiInfo.getPassword();
            var option = "<option value='" + psw + "'>" + ssid + "</option>";
            wifiSsidSelect.append(option);
        }
        setTimeout(function () {
            wifiSsidInput.val(wifiSsidSelect.find("option:selected").text());
            wifiPswInput.val(wifiSsidSelect.find("option:selected").val());
        }, 0);
    });
}

function showWifiHistoryLoadingToast() {
    var msg;
    arguments[0] ? msg = arguments[0] : msg = "连接中";
    loadingToast.find(".weui-toast_content").text(msg);
    loadingToast.fadeIn();
}

function hideWifiHistoryLoadingToast() {
    loadingToast.fadeOut("100");
}
