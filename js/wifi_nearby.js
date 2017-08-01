var mLastNetworkId = -1;
var mWifiListObj, mWifiItemsObj;
var myFrame;
var connected = false;
var userAgent = navigator.userAgent.toLowerCase();
var iosSystem = false;
var loadingToast;

function iframeWifiNearbyLoad() {
    iosSystem = isIos();
    myFrame = $('#iframe_filemanager').contents().find("#frame_wifi_nearby").contents();
    // myFrame = $('#iframe_filemanager').contents();
    mWifiListObj = myFrame.find('#id_WifiList');
    mWifiItemsObj = myFrame.find('#id_WifiItems');
    loadingToast = myFrame.find("#loading_toast");

    onWifiRefreshClick();
    registerWifiEventListener();

    var wifiListHeight;
    if (sessionStorage.module == MODULE_WIFI_SETTINGS) {
        myFrame.find('#id_RetryDiv').css("display", "none");
        wifiListHeight = window.innerHeight / 100 * 85;
    } else {
        wifiListHeight = window.innerHeight / 100 * 70;
    }
    mWifiItemsObj.css("height", wifiListHeight);
}

function registerWifiEventListener() {
    $(document).on(EVENT_WIFI_LSIT, function (event, wifiList) {
        refreshWifiList(wifiList);
    });
}

function getWifiRssiIcon(rssi) {
    var rssiIcon = "res/signal_0.png";
    switch (rssi) {
        case 0:
            rssiIcon = "res/signal_1.png";
            break;
        case 1:
            rssiIcon = "res/signal_2.png";
            break;
        case 2:
            rssiIcon = "res/signal_3.png";
            break;
        case 3:
            rssiIcon = "res/signal_4.png";
            break;
    }
    return rssiIcon;
}

function getWifiState(state) {
    var wifiState = "";
    switch (state) {
        case proto.airsync.WifiState.ACTIVE:
            wifiState = "已连接";
            // subEvent(EVENT_IP_REQ);
            // sendCommandBase64(getWifiScanCmd());
            break;
        case proto.airsync.WifiState.SAVED:
            wifiState = "已保存";
            break;
        default:
            break;
    }
    return wifiState;
}

function refreshWifiList(responseData) {
    mWifiItemsObj.empty();
    hideWifiNearbyLoadingToast();
    mWifiListObj.css("display", "block");
	for (var index = 0; index < responseData.length; index++) {
		addWifiListItem(index + 1, responseData[index]);
	}
	
	var iframeObj = document.getElementById("iframe_filemanager");
	iframeObj.contentWindow.document.getElementById("id_WifiItems").scrollTop = 0;
	
    setTouchStartListener();
}

function addWifiListItem(index, wifiInfo) {
    var ssid, networkId, security, rssi, state, httpCode = "";
    ssid = wifiInfo.getSsid();
    networkId = wifiInfo.getNetworkid();
    security = wifiInfo.getIssecurity();
    rssi = wifiInfo.getRssi();
    state = getWifiState(wifiInfo.getState());

    httpCode += "<div class='weui-flex wifi-item' onclick='parent.window.onWifiItemClick(" + networkId + "," + security + "," + wifiInfo.getState() + ")'>" +
        "<div class='weui-flex__item wifi-item-desc'>";

    if (state != "") {
        httpCode += "<p class='wifi-item-desc-ssid'>" + ssid + "</p>" +
            "<p class='wifi-item-desc-state'>" + state + "</p>";
    } else {
        httpCode += "<p class='wifi-item-index'>" + ssid + "</p>";
    }

    httpCode += "</div>" +
        "<div class='wifi-item-icon-div'>";

    if (security) {
        httpCode += "<img class='wifi-security-icon' src='res/security.png'>";
    }

    httpCode += "<img class='wifi-rssi-icon' src='" + getWifiRssiIcon(rssi) + "'>" +
        "</div>" +
        "</div>" +
        "<div class='weui-flex wifi-access-div' id='id_Access_" + networkId + "'>" +
        "<div class='weui-flex__item'>" +
        "<input class='wifi-access-input' id='id_AccessPassword_" + networkId + "' type='password' placeholder='请输入wifi密码'>";
		
		
	if (iosSystem) {
		httpCode += "<button class='wifi-access-button-ios btn-with-active' onclick='parent.window.onWifiAccessCancelClick(" + networkId + ")'>取消</button>" +
			"<button class='wifi-access-button-ios btn-with-active' onclick='parent.window.onWifiAccessConnectClick(" + networkId + ")'>连接</button>" +
			"</div>" +
			"</div>" +
			"<div class='weui-flex wifi-action-div' id='id_Action_" + networkId + "'>" +
			"<div class='weui-flex__item'>" +
			"<button class='wifi-action-button-ios btn-with-active' onclick='parent.window.onWifiActionCancelClick(" + networkId + ")'>取消</button>" +
			"</div>" +
			"<div class='weui-flex__item'>" +
			"<button class='wifi-action-button-ios btn-with-active' onclick='parent.window.onWifiActionForgetClick(" + networkId + ")'>清除</button>" +
			"</div>" +
			"<div class='weui-flex__item'>" +
			"<button class='wifi-action-button-ios btn-with-active' onclick='parent.window.onWifiActionConnectClick(" + networkId + ")'>连接</button>";
	} else {
		httpCode += "<button class='wifi-access-button btn-with-active' onclick='parent.window.onWifiAccessCancelClick(" + networkId + ")'>取消</button>" +
			"<button class='wifi-access-button btn-with-active' onclick='parent.window.onWifiAccessConnectClick(" + networkId + ")'>连接</button>" +
			"</div>" +
			"</div>" +
			"<div class='weui-flex wifi-action-div' id='id_Action_" + networkId + "'>" +
			"<div class='weui-flex__item'>" +
			"<button class='wifi-action-button btn-with-active' onclick='parent.window.onWifiActionCancelClick(" + networkId + ")'>取消</button>" +
			"</div>" +
			"<div class='weui-flex__item'>" +
			"<button class='wifi-action-button btn-with-active' onclick='parent.window.onWifiActionForgetClick(" + networkId + ")'>清除</button>" +
			"</div>" +
			"<div class='weui-flex__item'>" +
			"<button class='wifi-action-button btn-with-active' onclick='parent.window.onWifiActionConnectClick(" + networkId + ")'>连接</button>";
	}
	
    httpCode += "</div>" +
        "</div>" +
        "<div style='margin-bottom: 2px'></div>" +
        "<div class='wifi-list-split-line'></div>";

    mWifiItemsObj.append(httpCode);
}

function closeAccessDiv(networkId) {
    mLastNetworkId = -1;
    myFrame.find("#id_AccessPassword_" + networkId).val("");
    myFrame.find("#id_Access_" + networkId).css("display", "none");
}

function onWifiAccessCancelClick(networkId) {
    closeAccessDiv(networkId);
}

function onWifiAccessConnectClick(networkId) {
    connect(networkId, myFrame.find("#id_AccessPassword_" + networkId).val());
}

function closeActionDiv(networkId) {
    mLastNetworkId = -1;
    myFrame.find("#id_Action_" + networkId).css("display", "none");
}

function onWifiActionCancelClick(networkId) {
    closeActionDiv(networkId);
}

function onWifiActionForgetClick(networkId) {
    forget(networkId);
    closeActionDiv(networkId);
}

function onWifiActionConnectClick(networkId) {
    connect(networkId, "");
}

function onWifiItemClick(networkId, security, state) {
    var accessObj, actionObj;
    console.log("networkId=" + networkId + " security=" + security + " state=" + state + " mLastNetworkId=" + mLastNetworkId);

    if (mLastNetworkId != -1) {
        accessObj = "#id_Access_" + mLastNetworkId;
        actionObj = "#id_Action_" + mLastNetworkId;
        myFrame.find(accessObj).css("display", "none");
        myFrame.find(actionObj).css("display", "none");

        if (mLastNetworkId == networkId) {
            mLastNetworkId = -1;
            return;
        }
    }

    accessObj = "#id_Access_" + networkId;
    actionObj = "#id_Action_" + networkId;

    if (state != proto.airsync.WifiState.INACTIVE) {
        myFrame.find(actionObj).css("display", "flex")
    } else {
        if (security == 0) {
            connect(networkId, "");
        } else {
            myFrame.find(accessObj).css("display", "flex")
        }
    }

    mLastNetworkId = networkId;
}


function onWizardSpecClick() {
    window.location.assign("wifi_wizard_spec.html");
}

function onWifiRefreshClick() {
    showWifiNearbyLoadingToast("Wi-Fi 扫描中");
    mWifiListObj.css("display", "none");
    connected = false;
    //TODO
    // sendCommandBase64(getWifiScanCmd());
     //subEvent(EVENT_IP_REQ);
}

function onNextStepClick() {
    subEvent(EVENT_PROJECT_BT_CONNECTED);
}

function connect(networkId, password) {
    closeAccessDiv(networkId);
    showWifiNearbyLoadingToast("Wi-Fi 连接中");
    sendCommandBase64(getWifiConnectCmd(networkId, password));
}

function forget(networkId) {
    showWifiNearbyLoadingToast("Wi-Fi 清除中");
    sendCommandBase64(getWifiForgetCmd(networkId));
}

function setTouchStartListener() {
    var iframeObj = document.getElementById("iframe_filemanager");
    var btnActiveObj = iframeObj.contentWindow.document.getElementsByClassName("btn-with-active");
    for (var i = 0; i < btnActiveObj.length; i++) {
        btnActiveObj[i].addEventListener('touchstart', function () {
        }, false);
    }
}

function showWifiNearbyLoadingToast() {
    var msg;
    arguments[0] ? msg = arguments[0] : msg = "连接中";
    loadingToast.find(".weui-toast_content").text(msg);
    loadingToast.fadeIn();
}

function hideWifiNearbyLoadingToast() {
    loadingToast.fadeOut("100");
}

