"use strict";
var assert = require('assert');

var view = {
    objCompare: function (n, o) {
        try {
            assert.deepEqual(n, o);
        } catch (e) {
            return false;
        }
        return true;
    },
    fmtCheckByRoot: function (root) {
        for (var i in root) {
            if (view.fmtCheck(root[i][0], root[i][1])) {
                continue;
            } else {
                console.log('Input format error: '+i+': '+ root[i][0]);
                return [false, i, root[i][0]];
            }
        }
        return [true, i, root[i][0]];
    },
    fmtCheck: function (n, fmt) {
        switch (fmt) {
        case 'ip' :
            fmt = '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
        default:
            var ret = null;
            console.log('ret =/'+fmt+'/.test("'+n+'")');
            //TODO: Care this method. consider for escap '\' for RegEx()
            eval('ret =/'+fmt+'/.test("'+n+'")');
            return ret;  
        }
    }
}

module.exports = view;
