"use strict"; 
var tool = require('./tool.js');
var e = require('./config.js');
var cm = require('./cm.js');
var _ = require('underscore');

var routing = {
    setFeatureOn: function () {
        //Same level and need On
        tool.log('Set Same level and dep feature On', 1);
        return;
    },
    // rerturn ret[]
    // ret is n without o
    without: function (o, n) {
        var ret = [];
        var isCheck = 0;
        for (var i in n) {
            for(var j in o) {
                if (_.isEqual(n[i], o[j])) {
                    isCheck = 1;
                }
            }
            if (isCheck === 0) {
                ret.push(n[i]);
            }
            isCheck = 0;
        }
        return ret;
    },
    maskToNum: function (m) {
        switch(m) {
            case '255.255.255.255':
                return '32';
            case '255.255.255.0':
                return '24';
            case '255.255.0.0':
                return '16';
            case '255.0.0.0':
                return '8';
            default:
                tool.log('mask not support', 3);
                return '32';
        }
    },
    add: function (n) {
        tool.log('***Do routing  ADD...', 1);
        var evl = null;
        for(var i in n) {
            if(n[i].dest == '0.0.0.0') {
                evl = 'ip route add default via '+n[i].via+' dev '+n[i].dev;
            } else {
                evl = 'ip route add '+n[i].dest+'/'+routing.maskToNum(n[i].mask)+' dev '+n[i].dev+' via '+n[i].via;
            }
            tool.log(evl);
        }
        //tool.exec(evl);
        return;
    },
    del: function (n) {
        tool.log('***Do routing  Del...', 1);
        var evl = null;
        for(var i in n) {
            if(n[i].dest == '0.0.0.0') {
                evl = 'ip route del default via '+n[i].via+' dev '+n[i].dev;
            } else {
                evl = 'ip route del '+n[i].dest+'/'+routing.maskToNum(n[i].mask);
            }
            tool.log(evl);
        }
        //tool.exec(evl);
        return;
    
    },
    doIt: function (old, n) {
        var needAdd = routing.without(old.route, n.route);
        var needDel = routing.without(n.route, old.route);
        routing.del(needDel);
        routing.add(needAdd);
        return;
    },
    main: function () {
        routing.doIt(e.running.routing, e.preRunning.routing);
    }
}


cm.e.on('routing', function (n) {
    switch (n) {
        case 'init':
            tool.log('routing: init', 1);
            return;
        case 'setFeatureOn':
            routing.setFeatureOn('routing');
            return;
        case 'main':
        default:
            routing.main('routing');
    }
    return;
});