var BASEURL = "www.robyun.com";
var client = null;

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
    showResult("ping start", ip);
    var img = new Image();
    var start = new Date().getTime();
    var flag = false;
    var isCloseWifi = true;
    var hasFinish = false;

    img.onload = function () {
        showResult("ping onload", ip);
        if (!hasFinish) {
            clearTimeout(timer);
            hasFinish = true;
            flag = true;
            callback(flag);
        }
    };

    img.onerror = function () {
        showResult("ping onerror", ip + ",isCloseWifi:" + isCloseWifi);
        if (!hasFinish) {
            clearTimeout(timer);
            hasFinish = true;
            if (!isCloseWifi) {
                flag = true;
            }
            callback(flag);
        }
    };

    setTimeout(function () {
        isCloseWifi = false;
    }, 2);

    img.src = 'http://' + ip + '/' + start;
    var timer = setTimeout(function () {
        if (!flag) {
            hasFinish = true;
            img.src = 'X://';
            flag = false;
            callback(flag);
        }
    }, timeout);
}

function pingHttpGet(ip, callback) {
    showResult("pingHttpGet", ip);
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

