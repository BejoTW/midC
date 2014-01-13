var assert = require('assert');

var mUtils = {
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
            if (mUtils.fmtCheck(root[i][0], root[i][1])) {
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
            fmt = '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b';
        default:
            var ret = null;
            // console.log('ret =/'+fmt+'/.test("'+n+'")');
            //TODO: Care this method. consider for escap '\' for RegEx()
            eval('ret =/'+fmt+'/.test("'+n+'")');
            return ret;  
        }
    }
}

module.exports = mUtils;