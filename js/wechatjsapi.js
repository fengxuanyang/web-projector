const WX_OPENID = 'openid';
var wechatready = false,
    bleconnected = false,
    mDataSending = false;
var mydeviceid, mysignature, deviceip;
var openID = "oZHI-xKm8VCdHnq0E6K1YS6NEHaM";
var device = {
    "deviceid": "gh_653ab62a19e7_08ddcee5df969ee5",
    "ticket": "harddevice_oper_tic_1704118019653728",
};

function inntWeChat() {
    openID = getUrlParam(WX_OPENID);
    queryWeChatSignature(getUrlParam(apiPath), mynonceStr, mytimestamp, window.location.href, function (data) {
        if (data != null) {
            mysignature = JSON.parse(data).signature;
            configWeChat();
        } else {
            showResult('queryWeChatSignature:', "error");
            alert("设备异常，请稍后再试");
        }
    });
}


function configWeChat() {
    var wxappId = getUrlParam(appId);
    wx.config({
        beta: true,
        debug: false,
        appId: wxappId,
        timestamp: mytimestamp,
        nonceStr: mynonceStr,
        signature: mysignature,
        jsApiList: [
            'checkJsApi',
            'getNetworkType',
            'openWXDeviceLib',
            'closeWXDeviceLib',
            'getWXDeviceInfos',
            'sendDataToWXDevice',
            'startScanWXDevice',
            'stopScanWXDevice',
            'connectWXDevice',
            'disconnectWXDevice',
            'getWXDeviceTicket',

            'onWXDeviceBindStateChange',
            'onWXDeviceStateChange',
            'onReceiveDataFromWXDevice',
            'onScanWXDeviceResult',
            'onWXDeviceBluetoothStateChange',

        ]
    });
}

wx.ready(function () {
    wechatready = true;
    triggerEvent(wxready);
    openDevice();
    getDeviceInfo();
    registerDevicesEventListener();
    startScanWXDevice();
});


function startScanWXDevice() {
    wx.invoke('startScanWXDevice', {' connType': 'lan'}, function (res) {
    });
}

function unbindDevices(id) {
    var deviceid = id;
    wx.invoke('getWXDeviceTicket', {'deviceId': id, 'type': '2', 'connType': 'blue'}, function (res) {
        if (res.err_msg == 'getWXDeviceTicket:ok') {
            var requesturl = "http://www.robyun.com/dev_projector/device/unbind";
            var datajson = JSON.stringify({ticket: res.ticket, openid: openID, device_id: deviceid});
            $.ajax({
                url: requesturl,
                type: "post",
                dataType: "json",
                data: datajson,
                contentType: "application/json;encoding=utf-8",
                success: function (data) {
                },
                error: function () {
                }
            });
        }
    });
}

function openDevice() {
    wx.invoke('openWXDeviceLib', {'connType': 'blue'},
        function (res) {
            if (res.err_msg == 'openWXDeviceLib:ok') {
                var result;
                if (res.bluetoothState == 'off') {
                    triggerEvent(btoff);
                    result = "请打开手机蓝牙";
                } else if (res.bluetoothState == 'unauthorized') {
                    result = "请授权蓝牙功能";
                } else if (res.bluetoothState == 'on') {
                    // triggerEvent(btopen);
                    result = "蓝牙已打开";
                }
            } else {
                result = "openWXDeviceLib 失败";
                triggerEvent(devicedisconnected);
            }
        });
}

function getDeviceInfo() {
    wx.invoke('getWXDeviceInfos', {'connType': 'blue'},
        function (res) {
            showResult("getWXDeviceInfos:", JSON.stringify(res));
            var len = res.deviceInfos.length;
            if (len == 0) {
                triggerEvent(devicenone);
                return;
            }
            var unbindIndex = 0;
            for (var i = 0; i < len; i++) {
                if (res.deviceInfos[i].state === "connected") {
                    mydeviceid = res.deviceInfos[i].deviceId;
                    unbindIndex = i;
                    triggerEvent(deviceconnected);
                    break;
                }
            }
            for (var j = 0; j < len; j++) {
                if (unbindIndex == j) {
                    mydeviceid = res.deviceInfos[j].deviceId;
                    continue;
                }
                unbindDevices(res.deviceInfos[j].deviceId);
            }

        });
}

function connectWXDevice() {
    showResult("connectWXDevice", mydeviceid);
    if (!mydeviceid) {
        openDevice();
        getDeviceInfo();
    } else {
        wx.invoke('connectWXDevice', {'deviceId': mydeviceid, 'connType': 'blue'}, function (res) {
            showResult("connectWXDevice", JSON.stringify(res));
        });
    }
}

function sendDada(base64Str, callback) {
    showResult("sendDada base64Str:", base64Str);
    var cmd = base64Str;
    if (mDataSending == false) {
        mDataSending = true;
        var myCallback = callback;
        wx.invoke('sendDataToWXDevice', {'deviceId': mydeviceid, 'connType': 'blue', 'base64Data': cmd},
            function (res) {
                //FOR TEST
                showResult("sendDada cmd:", cmd+":"+JSON.stringify(res));
                mDataSending = false;
                if (typeof(myCallback) != "undefined") {
                    myCallback();
                }
            });
    } else {
        if (typeof(callback) != "undefined") {
            callback();
        }
    }
}

function registerDevicesEventListener() {
    wx.error(function (res) {
    });

    wx.on('onScanWXDeviceResult', function (res) {
    });

    wx.on('onWXDeviceBluetoothStateChange', function (res) {
        if (res.state == 'on') {
            triggerEvent(btopen);
            connectWXDevice();
        } else {
            triggerEvent(btoff);
        }
    });

    wx.on('onWXDeviceBindStateChange', function (res) {
    });

    wx.on('onWXDeviceStateChange', function (res) {
        if (res.state == 'connecting') {
            triggerEvent(deviceconnecting);

        } else if (res.state == 'connected') {
            triggerEvent(deviceconnected);
        } else if (res.state == 'disconnected') {
            triggerEvent(devicedisconnected);
        }
    });

    wx.on('onReceiveDataFromWXDevice', function (res) {
        var responsedata = getResponseFromBase64(res.base64Data);
        if (responsedata.constructor == proto.airsync.EditFocusChangePush) {
            var event = $.Event(EVENT_EDIT_FOCUS_CHANGE);
            $(document).trigger(event, [{focusState: responsedata.getFocus(), text: responsedata.getText()}]);
            return;
        }

        if (responsedata.constructor == proto.airsync.FileManagerResponse) {
            var event = $.Event(deviceipback);
            $(document).trigger(event, [responsedata.getUrl()]);
            return;
        }
        if (responsedata.constructor == proto.airsync.WifiResponse) {
            var wifilist = responsedata.getWifiinfoList();
            subEvent(EVENT_WIFI_LSIT, wifilist);
            return;
        }

        if (responsedata.constructor == proto.airsync.IpResponse) {
            var ip = responsedata.getIp();
            subEvent(EVENT_IP_RES, ip);
            return;
        }
        if (responsedata.constructor == proto.airsync.WifiApHistoryResponse) {
            var historylist = responsedata.getWifiapinfoList();
            subEvent(EVENT_WIFI_HISTORY_LSIT, historylist);
            return;
        }

        if (responsedata.constructor == proto.airsync.DeviceInfoResponse) {
             subEvent(EVENT_DEVICE_INFO, responsedata);
            return;
        }


    });
}


function triggerEvent(state) {
    var event = $.Event(state);
    $(document).trigger(event);
}
