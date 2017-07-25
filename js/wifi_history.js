var historyFrame;
var wifiSsidSelect;
var wifiSelect;
var option;
var wifiSsidInput;
var wifiPswInput;

var currentWifiSsid;
var currentWifiPsw;
var wifiList;


function iframeWifiHistoryLoad() {
    sendCommandBase64(getWifiHistoryCmd());
    historyFrame = $('#iframe_filemanager').contents();
    if (isIos()) {
        historyFrame.find('#wifihistory_navpage').css({
            'background-image': 'url(res/wifihistory_ios_bg.jpg)',
        });
        historyFrame.find('#airplay_downoad_wrapper').css({
            'display': 'none',
        });

    }
    historyFrame.find('body').on('touchmove', function(e) {
        e.preventDefault();
    });
    wifiSsidSelect = historyFrame.find('#wifihistory_select_wifissid');
    wifiSsidInput = historyFrame.find('#wifihistory_input_ssid');
    wifiPswInput = historyFrame.find('#wifihistory_input_psw');
    historyFrame.find('#wifihistory_next_btn').on('click', function(event) {
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
        // showResult("connect currentWifiSsid：", currentWifiSsid);
        //connect wifi 
        sendCommandBase64(getWifiSSIDConnectCmd(currentWifiSsid, currentWifiPsw));
        $(document).on(EVENT_WIFI_LSIT, function(event, wifiList) {
            for (var i = 0; i < wifiList.length; i++) {
                var wifiinfo = wifiList[i];
                // showResult("wifiInfo :", wifiinfo.getSsid() + "," + wifiinfo.getState());
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
    });


    historyFrame.find('#wifihistory_previous_btn').on('click', function(event) {
        historyFrame.find('#wifihistory_mainpage').css({
            display: 'block',
        });
        historyFrame.find("#wifihistory_navpage").css({
            display: 'none',
        });
        historyFrame.find('#wifihistory_result').css('display', 'none');


    });

    historyFrame.find('#airplay_downoad_lebo').on('click', function(event) {
        window.location.assign(airPlaydownLoadUrl);
    });

    historyFrame.find('#wifihistory_connect_btn').on('click', function(event) {
        subEvent(EVENT_IP_REQ);
    });

    //  wifi history list result  
    $(document).on(EVENT_WIFI_HISTORY_LSIT, function(event, list) {
        hideLoadingToast();
        wifiList = list;
        for (var i = 0; i < wifiList.length; i++) {
            var wifiInfo = wifiList[i];
            var ssid = wifiInfo.getSsid();
            var psw = wifiInfo.getPassword();
            var option = "<option value='" + psw + "'>" + ssid + "</option>";
            wifiSsidSelect.append(option);
        }
        setTimeout(function() {
            wifiSsidInput.val(wifiSsidSelect.find("option:selected").text());
            wifiPswInput.val(wifiSsidSelect.find("option:selected").val());
        }, 0);
    });
}
