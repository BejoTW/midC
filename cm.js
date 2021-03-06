"use strict";
var tool = require('./tool.js');
var assert = require('assert');
var _ = require('underscore');
var util = require('util');
var events = require('events');
var event = new events.EventEmitter();
var e = require('./config.js');

//Function seq table
//intf: [SystemLevel, isDep, Seq(1~9999), isTriger, isReload,[{specify number, specify number}]];
//SystemLevel
//0 - God
//1 - Kernel
//2 - module/Driver
//3 - Network L1
//4 - Network L2
//5 - Network L3
//6 - Network L4 - L7
//7 - Low level  
var featureSet = [
    ["nat", 4, false, 10, false, false],
    ["intf", 4, false, 20, false, false],
    ["b", 4, false, 9, false, false],
    ["a", 1, false, 11, false, false],
    ["e", 1, false, 10, false, false],
    ["a", 4, false, 10, false, false],
    ["g", 2, false, 10, false, false],
    ["routing", 5, false, 10, false, false]
]

var view = {
    e: event,
    initFeatureSet: function () {
        var v = _.groupBy(featureSet, function(d){return d[1]});
        for (var i in v) {
            v[i] = _.sortBy(v[i], function(d){return d[3]});
        }
        view.featureSeq = _.flatten(JSON.parse(JSON.stringify(_.values(v))), true);
        view.featureGroup = JSON.parse(JSON.stringify(v));
    },
    initFeature: function () {
        for (var i in view.featureSeq) {
            tool.log(view.featureSeq[i][0], 1);
            view.e.emit(view.featureSeq[i][0], 'init');
        }
        return;
    },
//example:
// { '1': 
   // [ [ 'e', 1, false, 10, false, false ],
     // [ 'a', 1, false, 11, false, false ] ],
  // '2': [ [ 'g', 2, false, 10, false, false ] ],
  // '4': 
   // [ [ 'b', 4, false, 9, false, false ],
     // [ 'c', 4, false, 10, false, false ],
     // [ 'a', 4, false, 10, false, false ],
     // [ 'intf', 4, false, 20, false, false ] ],
  // '5': [ [ 'routing', 5, false, 10, false, false ] ] }

    featureGroup: null,
//example:    
 // [ [ 'e', 1, false, 10, false, false ],
  // [ 'a', 1, false, 11, false, false ],
  // [ 'g', 2, false, 10, false, false ],
  // [ 'b', 4, false, 9, false, false ],
  // [ 'c', 4, false, 10, false, false ],
  // [ 'a', 4, false, 10, false, false ],
  // [ 'intf', 4, false, 20, false, false ],
  // [ 'routing', 5, false, 10, false, false ] ]   
    featureSeq: null,
    getFeatureSetByName: function (c) {
        for (var i in view.featureSeq) {
            if (view.featureSeq[i][0] === c) {
                return view.featureSeq[i];
            }
        }
        return false;
    },
    setFeatureOn: function (c) {
        for (var i in view.featureSeq) {
            if (view.featureSeq[i][0] === c) {
                view.featureSeq[i][4] = true;
                return true;
            }
        }
        return false;
    },
    setFeatureAllOnByLevel: function (n) {
        for (var i in view.featureSeq) {
            if (view.featureSeq[i][1] >= n) {
                view.featureSeq[i][5] = true;
                return true;
            }
        }
        return false;
    },
    setFeatureReload: function (c) {
        for (var i in view.featureSeq) {
            if (view.featureSeq[i][0] === c) {
                view.featureSeq[i][5] = true;
                return true;
            }
        }
        return false;
    },
    assign: function (running, preRunning) {
        var assign = [];
        var lowLevel = 0;
        for (var i in running) {
            if (!_.isEqual(running[i], preRunning[i])) {
                assign.push(i);
            }
        }
        //Check different
        if(_.isEmpty(assign)) {
            console.log('Running config is no change');
            return false;
        }
        
        assign = _.sortBy(assign, function(d) {
            for (var i in view.featureSeq) {
                if (view.featureSeq[i][0] === d) {
                    return i;
                }
            }});
        // Now assign is by order
        // Set flag
        //Set:
        console.log("assign = "+JSON.stringify(assign));
        for (var i in assign) {
            view.setFeatureOn(assign[i])
        }
        
        for (var i in view.featureSeq) {
            if(view.featureSeq[i][4] == true&&view.featureSeq[i][2] == false) {
                view.e.emit(view.featureSeq[i][0], 'setFeatureOn');
            }
        }
        
        //High-level needs ro reload: ex:trigger level 3 and level 4-7 all need to be reloaded
        for (var i in view.featureSeq) {
            if(view.featureSeq[i][4] == true) {
                if (lowLevel !== 0&&lowLevel < view.featureSeq[i][1]) {
                    view.setFeatureAllOnByLevel(view.featureSeq[i][1]);
                } else {
                    lowLevel = view.featureSeq[i][1];
                    continue;
                }
            }
        }
        
        //Exec:
        //main exec (input)
        for (var i in view.featureSeq) {
            if(view.featureSeq[i][4] == true&&view.featureSeq[i][5] == false) {
                view.e.emit(view.featureSeq[i][0], 'DoSomeThings main');
            }
        }
             
        
        //reload exec
        for (var i in view.featureSeq) {
            if(view.featureSeq[i][4] == true&&view.featureSeq[i][5] == true) {
                view.e.emit(view.featureSeq[i][0], 'DoSomeThings');
            }
        }
        // console.log("featureSeq = "+JSON.stringify(view.featureSeq));
        //Done and Clear Flag
        for (var i in view.featureSeq) {
            view.featureSeq[i][4] = false;
            view.featureSeq[i][5] = false;
        }
        //Sync preRunning and running config
        e.syncRunningConfig();
    },
    configCompare: function (n, o) {
        try {
            assert.deepEqual(n, o);
        } catch (e) {
            return false;
        }
        return true;
    },
    configMergeBySeq: function (dest, src) {
        var tmp = JSON.parse(JSON.stringify(src));
        var n = _.extend(dest, tmp);
        return [true, n];
    },
    configGetByValue: function(root, name, value) {
        var ret = [false, null];
        for(var i in root) {
            if (root[i][name] === value) {
                ret = [true, root[i]];
                return ret;
            }
            continue;
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
                    // console.log('Input format error: '+i+': '+ d[i][0]);
                    if (ret == []) {
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
        //vist all node
        JSON.stringify(root, nodeVisitor);
        
        if (_.isEmpty(ret)) {
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
