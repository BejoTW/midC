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
    configGetByValue: function(root, index, value) {
        var ret = [false, null];
        function arraySearch(input, c) {

            for (var i in input) {
                if (input[i][c][0] == value) {
                    ret = [true, input[i]];
                    return;
                } else {
                    ret = [false, null];
                }
            }
        }
        for(var i in index) {
            if (index[i] == '?') {
                arraySearch(root, index[parseInt(i)+1]);
                break;
            }
            root = root[index[i]];
        }

        return ret;
    },
    fmtCheckByRoot: function (root) {
//API example:
// var ret = cm.fmtCheckByRoot(e.Running.intf);
// if (ret[0].ret != true) {
    // console.log('err'+ret[0].item);
// }  
        var ret = [];
        function check(d) {
            for (var i in d) {
                if (i == 'isLeaf') {
                    continue;
                }
                if (view.fmtCheck(d[i][0], d[i][1])) {
                    continue;
                } else {
                    console.log('Input format error: '+i+': '+ d[i][0]);
                    if (ret[0] == true) {
                        ret = [{ret: false, item: i, value: d[i][0]}];
                    } else {
                        ret.push({ret: false, item: i, value: d[i][0]});
                    }
                }
            }
        }
        
        function nodeVisitor(key, value) {
                if(key == 'isLeaf'&&value[0] == 'true') {
                    // console.log(
                        // JSON.stringify(this) // parent
                        // +"#"+JSON.stringify(key)
                        // +"#"+JSON.stringify(value));
                    check(this);
                 }
            return value; // don't change
        }

        JSON.stringify(root, nodeVisitor);
        if (ret == '') {
            ret = [{ret: true, item: null, value: null}];
        }
        return ret;
    },
    fmtCheck: function (n, fmt) {
        switch (fmt) {
        case 'ip' :
            fmt = '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
        default:
            var ret = null;
            // console.log('ret =/'+fmt+'/.test("'+n+'")');
            //TODO: Care this method. consider for escap '\' for RegEx()
            eval('ret =/'+fmt+'/.test("'+n+'")');
            return ret;  
        }
    }
}

module.exports = view;
