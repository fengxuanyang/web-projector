var BASEURL = "www.robyun.com";
var testurl = "http://www.robyun.com/projector/wechat/signature?noncestr=727be54e-145a-4705-8a45-44be381f02c8&timestamp=1494331792&url=http%3A%2F%2Flocalhost%3A8080%2FtvControllerFileManager%2Ftvcontroller.html%3Fapi_path%3Dprojector%26app_id%3Dwx4659ac707a4d7397%26mode%3Ddebug";
var client = null;
var stateString = "";

function queryWeChatSignature(apipath, noncestr, timestamp, currenturl, callback) {
    BASEURL = window.location.host;
    var encodeurl = encodeURIComponent(currenturl);
    var head = "http://" + BASEURL + "/" + apipath + "/wechat/signature?";
    showResult("head:", head);
    var param = "noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + encodeurl;
    var requesturl = head + param;

    $.ajax({
        url: requesturl,
        type: "get",
        dataType: "json",
        success: function (data) {
            callback(data);
        },
        error: function () {
            callback(null);
        }
    });
}

function convertURL(url) {
    var timstamp = (new Date()).valueOf();
    if (url.indexOf("?") >= 0) {
        url = url + "&t=" + timstamp;
    } else {
        url = url + "?t=" + timstamp;
    }
    return url;
}

function ping(ip, callback, timeout) {

    var img = new Image();
    var start = new Date().getTime();
    var flag = false;
    var isCloseWifi = true;
    var hasFinish = false;

    img.onload = function () {
        if (!hasFinish) {
            flag = true;
            hasFinish = true;
            img.src = 'X:\\';
            callback(flag);
        }
    };

    img.onerror = function () {
        if (!hasFinish) {
            if (!isCloseWifi) {
                flag = true;
                img.src = 'X:\\';
                callback(flag);

            } else {
                callback(flag);
            }
            hasFinish = true;
        }
    };

    setTimeout(function () {
        isCloseWifi = false;
    }, 2);
    img.src = 'http://' + ip + '/' + start;
}

function pingHttpGet(ip, callback) {
     var flag = false;
    var url = "http://" + ip + ":45678/ping" + "?request_type=2";
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        timeout: 3000,
        success: function (data) {
            showResult("pingHttpGet  end success");
            flag = true;
            callback(flag);
        },
        error: function () {
            showResult("pingHttpGet  end error");
            callback(flag);
        }
    });
}

