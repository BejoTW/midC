"use strict"; 
var tool = require('./tool.js');
var e = require('./config.js');
var cm = require('./cm.js');
var _ = require('underscore');

var nat = {
    setFeatureOn: function () {
        //Same level and need On
        tool.log('Set Same level and dep feature On', 1);
        return;
    },
    disable: function () {
        tool.log('***Do NAT disable ...', 1);
        var evl = 'iptables -t nat -F';
        tool.exec(evl);
        return;
    },
    enable: function (n) {
        tool.log('***Do NAT enable ...', 1);
        var evl = null;
        //sanity check
        if(_.isEmpty(n.outside)||n.outside[0] == '') {
            tool.log('No out going interface setting', 2);
            return;
        }
        
        if(_.isEmpty(n.inside)||n.inside[0] == null) {
            evl = 'iptables -t nat -A POSTROUTING -o '+n.outside[0]+' -j MASQUERADE';
        } else {    
            evl = 'iptables -t nat -A POSTROUTING -s '+n.inside[0]+' -o '+n.outside[0]+' -j MASQUERADE';
        }
        tool.exec(evl);
        return;
    },
    doIt: function (old, n) {
        nat.disable();
        if (n.isEnable[0] == 'true') {
            nat.enable(n);        
        }
        return;
    },
    main: function () {
        nat.doIt(e.running.nat, e.preRunning.nat);
    }
}


cm.e.on('nat', function (n) {
    switch (n) {
        case 'init':
            tool.log('nat: init', 1);
            return;
        case 'setFeatureOn':
            nat.setFeatureOn('routing');
            return;
        case 'main':
        default:
            nat.main('routing');
    }
    return;
});