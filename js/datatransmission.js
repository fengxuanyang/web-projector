var mHomeKeyCmd, mPOWERKeyCmd, mPlusKeyCmd, mOkKeyCmd, mMinusKeyCmd, mUpwardKeyCmd, mDownwardKeyCmd;
var mLeftKeyCmd, mRightKeyCmd, mMenuKeyCmd, mBackKeyCmd, mFileManagerCmd, mProjectIpCmd, mWifiScanCmd,
    mReqScreenSyncCmd;
var i;

function getHOMEKeyCmd() {
    if (typeof(mHomeKeyCmd) == "undefined") {
        mHomeKeyCmd = getKeyInputRequest(proto.airsync.KeyCode.HOME);
    }
    return mHomeKeyCmd;
}

function getPOWERKeyCmd() {
    if (typeof(mPOWERKeyCmd) == "undefined") {
        mPOWERKeyCmd = getKeyInputRequest(proto.airsync.KeyCode.POWER);
    }
    return mPOWERKeyCmd;
}

function getPlusKeyCmd() {
    if (typeof(mPlusKeyCmd) == "undefined") {
        mPlusKeyCmd = getKeyInputRequest(proto.airsync.KeyCode.VOLUME_UP);
    }
    return mPlusKeyCmd;
}

function getOkKeyCmd() {
    if (typeof(mOkKeyCmd) == "undefined") {
        mOkKeyCmd = getKeyInputRequest(proto.airsync.KeyCode.OK);
    }
    return mOkKeyCmd;
}

function getMinusKeyCmd() {
    if (typeof(mMinusKeyCmd) == "undefined") {
        mMinusKeyCmd = getKeyInputRequest(proto.airsync.KeyCode.VOLUME_DOME);
    }
    return mMinusKeyCmd;
}

function getUpwardKeyCmd() {
    if (typeof(mUpwardKeyCmd) == "undefined") {
        mUpwardKeyCmd = getKeyInputRequest(proto.airsync.KeyCode.UPWARD);
    }
    return mUpwardKeyCmd;
}

function getDownwardKeyCmd() {
    if (typeof(mDownwardKeyCmd) == "undefined") {
        mDownwardKeyCmd = getKeyInputRequest(proto.airsync.KeyCode.DOWNWARD);
    }
    return mDownwardKeyCmd;
}

function getLeftKeyCmd() {
    if (typeof(mLeftKeyCmd) == "undefined") {
        mLeftKeyCmd = getKeyInputRequest(proto.airsync.KeyCode.TOLEFT);
    }
    return mLeftKeyCmd;
}

function getRightKeyCmd() {
    if (typeof(mRightKeyCmd) == "undefined") {
        mRightKeyCmd = getKeyInputRequest(proto.airsync.KeyCode.TORIGHT);
    }
    return mRightKeyCmd;
}

function getMenuKeyCmd() {
    if (typeof(mMenuKeyCmd) == "undefined") {
        mMenuKeyCmd = getKeyInputRequest(proto.airsync.KeyCode.MENU);
    }
    return mMenuKeyCmd;
}

function getBackKeyCmd() {
    if (typeof(mBackKeyCmd) == "undefined") {
        mBackKeyCmd = getKeyInputRequest(proto.airsync.KeyCode.BACK);
    }
    return mBackKeyCmd;
}

function getFlieManagerCmd() {
    if (typeof(mFileManagerCmd) == "undefined") {
        var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_FILE_MANAGER);
        var baserequest = new proto.airsync.BaseRequest();
        var baserequestBytes = baserequest.serializeBinary();
        mFileManagerCmd = cmdIdBytes;
        for (i = 0; i < baserequestBytes.length; i++) {
            mFileManagerCmd.push(baserequestBytes[i]);
        }
    }
    return mFileManagerCmd;
}

function getProjectIP() {
    if (typeof(mProjectIpCmd) == "undefined") {
        var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_IP);
        var baserequest = new proto.airsync.BaseRequest();
        var baserequestBytes = baserequest.serializeBinary();
        mProjectIpCmd = cmdIdBytes;
        for (i = 0; i < baserequestBytes.length; i++) {
            mProjectIpCmd.push(baserequestBytes[i]);
        }
    }
    return mProjectIpCmd;
}

function getWifiScanCmd() {
    if (typeof(mWifiScanCmd) == "undefined") {
        var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_WIFI);
        var wifiRequest = new proto.airsync.WifiRequest();
        var baserequest = new proto.airsync.BaseRequest();
        wifiRequest.setBaserequest(baserequest);
        wifiRequest.setOperation(proto.airsync.WifiOperation.SCAN);
        var wifiRequestBytes = wifiRequest.serializeBinary();
        mWifiScanCmd = cmdIdBytes;
        for (i = 0; i < wifiRequestBytes.length; i++) {
            mWifiScanCmd.push(wifiRequestBytes[i]);
        }
    }
    return mWifiScanCmd;
}

function getWifiConnectCmd(networkId, password) {
    showResult("getWifiConnectCmd start:", networkId + ":" + password);
    var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_WIFI);
    var wifiRequest = new proto.airsync.WifiRequest();
    var baserequest = new proto.airsync.BaseRequest();
    wifiRequest.setBaserequest(baserequest);
    wifiRequest.setOperation(proto.airsync.WifiOperation.CONNECT);
    wifiRequest.setNetworkid(networkId);
    if (password) {
        wifiRequest.setPassword(password);
    }
    var wifiRequestBytes = wifiRequest.serializeBinary();
    var result = cmdIdBytes;
    for (i = 0; i < wifiRequestBytes.length; i++) {
        result.push(wifiRequestBytes[i]);
    }
    return result;
}

function getWifiHistoryCmd() {
    var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_WIFIAP_HISTORY);
    var baserequest = new proto.airsync.BaseRequest();
    var baserequestBytes = baserequest.serializeBinary();
    var result = cmdIdBytes;
    for (i = 0; i < baserequestBytes.length; i++) {
        result.push(baserequestBytes[i]);
    }
    return result;
}


function getWifiSSIDConnectCmd(ssid, password) {
    var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_WIFI);
    var wifiRequest = new proto.airsync.WifiRequest();
    var baserequest = new proto.airsync.BaseRequest();
    wifiRequest.setBaserequest(baserequest);
    wifiRequest.setOperation(proto.airsync.WifiOperation.FORCE_CONNECT);
    wifiRequest.setSsid(ssid);
    if (password) {
        wifiRequest.setPassword(password);
    }
    var wifiRequestBytes = wifiRequest.serializeBinary();
    var result = cmdIdBytes;
    for (i = 0; i < wifiRequestBytes.length; i++) {
        result.push(wifiRequestBytes[i]);
    }
    return result;
}


function getWifiForgetCmd(networkId) {
    var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_WIFI);
    var wifiRequest = new proto.airsync.WifiRequest();
    var baserequest = new proto.airsync.BaseRequest();
    wifiRequest.setBaserequest(baserequest);
    wifiRequest.setOperation(proto.airsync.WifiOperation.FORGET);
    wifiRequest.setNetworkid(networkId);
    var wifiRequestBytes = wifiRequest.serializeBinary();
    var result = cmdIdBytes;
    for (i = 0; i < wifiRequestBytes.length; i++) {
        result.push(wifiRequestBytes[i]);
    }
    return result;
}

function getReqScreenSyncCmd() {
    if (typeof(mReqScreenSyncCmd) == "undefined") {
        var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_SCREEN_SYNC);
        mReqScreenSyncCmd = appendBaseRequestBytes(cmdIdBytes);
    }
    return mReqScreenSyncCmd;
}

function appendBaseRequestBytes(currentBytes) {
    var baserequest = new proto.airsync.BaseRequest();
    var baserequestBytes = baserequest.serializeBinary();
    for (i = 0; i < baserequestBytes.length; i++) {
        currentBytes.push(baserequestBytes[i]);
    }
    return currentBytes;
}

function getKeyInputRequest(keyCode) {
    var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_KEY_INPUT);
    var baserequest = new proto.airsync.BaseRequest();
    var keyinput = new proto.airsync.KeyInputRequest();
    keyinput.setBaserequest(baserequest);
    keyinput.setCode(keyCode);
    var keyInputBytes = keyinput.serializeBinary();
    var result = cmdIdBytes;
    for (i = 0; i < keyInputBytes.length; i++) {
        result.push(keyInputBytes[i]);
    }
    return result;
}

function getTextInputRequest(text) {
    var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_TEXT_INPUT);
    var baserequest = new proto.airsync.BaseRequest();
    var textinput = new proto.airsync.TextInputRequest();
    textinput.setBaserequest(baserequest);
    textinput.setText(text);
    var textInputBytes = textinput.serializeBinary();
    var result = cmdIdBytes;
    for (i = 0; i < textInputBytes.length; i++) {
        result.push(textInputBytes[i]);
    }
    return result;
}

function getDeviceInfoCmd() {
    var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_DEVICE_INFO);
    var mDeviceInfoCmd = appendBaseRequestBytes(cmdIdBytes);
    return mDeviceInfoCmd;
}

function getResponseFromBase64(base64Str) {
    var receiveRawData = base64ToArrayBuffer(base64Str);
    var cmdIdRawData = receiveRawData.slice(0, 2);
    //test for vivo
    var cmdCode = bytes2Int(cmdIdRawData);
    showResult("cmdCode:", cmdCode);
    var responseDataRawData = receiveRawData.slice(2);
    var responsedata;
    switch (cmdCode) {
        case proto.airsync.CmdId.RESP_KEY_INPUT:
            responsedata = proto.airsync.BaseResponse.deserializeBinary(responseDataRawData);
            break;
        case proto.airsync.CmdId.RESP_TEXT_INPUT:
            responsedata = proto.airsync.BaseResponse.deserializeBinary(responseDataRawData);
            break;
        case proto.airsync.CmdId.PUSH_EDIT_FOCUS_CHANGE:
            responsedata = proto.airsync.EditFocusChangePush.deserializeBinary(responseDataRawData);
            break;
        case proto.airsync.CmdId.REQ_KEY_INPUT:
            responsedata = proto.airsync.KeyInputRequest.deserializeBinary(responseDataRawData);
            break;
        case proto.airsync.CmdId.RESP_FILE_MANAGER:
            responsedata = proto.airsync.FileManagerResponse.deserializeBinary(responseDataRawData);
            break;
        case proto.airsync.CmdId.RESP_WIFI:
             responsedata = proto.airsync.WifiResponse.deserializeBinary(responseDataRawData);
            break;
        case proto.airsync.CmdId.RESP_IP:
            responsedata = proto.airsync.IpResponse.deserializeBinary(responseDataRawData);
            break;
        case proto.airsync.CmdId.RESP_WIFIAP_HISTORY:
            responsedata = proto.airsync.WifiApHistoryResponse.deserializeBinary(responseDataRawData);
            break;
        case proto.airsync.CmdId.RESP_DEVICE_INFO:
            responsedata = proto.airsync.DeviceInfoResponse.deserializeBinary(responseDataRawData);
            break;
    }
    return responsedata;
}
