"use strict";

var charxml = function (s) {
    return s.replace(/(&quot;)|(&gt;)|(&amp;)|(&lt;)|(&apos;)/g, function (c) {
        return {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&apos;": "'",
            "&quot;": '"'
        }[c]
    })
};

var req = function (url, method, headers, postdata,callback, args) {
    if (!url) {
        throw "loadURL requires a url argument";
    }
    var method = method || "GET",
    headers = headers || {},
    postdata = postdata || "";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        try {
            if (xhr.readyState == 4 ) {
                if ( xhr.status == 200) {
                    callback(xhr.responseText, args);
                } else {
                    alert(' ERROR\n' +xhr.status+'\n'+url);
                }
            }
        } catch (e) {
            alert("Abort:  ERROR\n"+e);
            xhr.abort();
        }
    }
    xhr.open(method, url, false);
    for(var key in headers) {
        xhr.setRequestHeader(key, headers[key]);
    }
    xhr.send(postdata);
    return xhr;
};