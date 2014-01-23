"use strict"; 
// var mUtils = require('./mUtils.js')
var tool = require('./tool.js');
var e = require('./config.js');
var cm = require('./cm.js');
var _ = require('underscore');
var exec = require('child_process').exec, child;

var intUtils = {
    exec: function (s) {
        child = exec(s,
        function (error, stdout, stderr) {
            tool.log('stdout: ' + stdout, 0);
            tool.log('stderr: ' + stderr, 3);
            if (error !== null) {
                tool.log('exec error: ' + error, 3);
            }
        })
    }
}

var intf = {
    setFeatureOn: function () {
        //Same level and need On
        tool.log('Set Same level and dep feature On', 1);
        return;
    },
    setIP: function (n) {
        tool.log('***Do IP and mask change...', 1);
        var evl = 'ifconfig '+n.name[0]+' '+n.ip[0]+' netmask '+n.mask[0];
        tool.log(evl, 0);
        intUtils.exec(evl);
        return;
    },
    setSpeedDuplex: function (n) {
        tool.log('***Do Spped and Duplex change...', 1);
        var val = null;
        switch(n.speed[0]) {
            case '10':
                val = '-F 10baseT';
                break;
            case '100':
                val = '-F 100baseTx';
                break;
            case '1000':
                val = '-F 1000baseTx'
            case 'auto':
            default:
                val = '-R';      
        }
        if (val !== '-R') {
            switch(n.duplex[0]) {
            case 'half':
                val += '-HD';
                break;
            case 'full':
            case 'auto':
            default:
                val += '-FD';      
            }
        }
        var evl = 'mii-tool '+val+' '+n.name[0];
        tool.log(evl, 0);
        intUtils(evl);
        
        return;
    },
    doIt: function (old, n) {
        if ((old.ip[0] !== n.ip[0])||(old.mask[0] !== n.mask[0])) {
            intf.setIP(n);
        }
        if ((old.speed[0] !== n.speed[0])||(old.duplex[0] !== n.duplex[0])) {
            intf.setSpeedDuplex(n);
        }
        return;
    },
    main: function () {
        for (var i in e.running.intf.data) {
            if (_.isEqual(e.running.intf.data[i], e.preRunning.intf.data[i])) {
                continue;
            } else {
                intf.doIt(e.running.intf.data[i], e.preRunning.intf.data[i]);
            }
        }
    }

}


cm.e.on('intf', function (n) {
    switch (n) {
        case 'init':
            tool.log('interface: init', 1);
            return;
        case 'setFeatureOn':
            intf.setFeatureOn('routing');
            return;
        case 'main':
        default:
            intf.main('routing');
    }
    return;
    //Check which interface
    for (var i in e.running.intf) {
        if (n.intf[0].name[0] === e.running.intf[i].name[0]) {
            tool.log('match', 0);
            intUtils.exec('ifconfig '+s.name[0]+' '+s.ip[0]);
            return;
        }
    }
    tool.log('no this interface', 2);
    return;
});