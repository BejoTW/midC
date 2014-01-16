"use strict"; 
var e = require('./config.js');
var _ = require('underscore');
var cm = require('./cm.js');

//Save-config Loading 
e.running = _.clone(e.readSave());


var dummy = {
                "isLeaf" : ["true", "."],
                "idx" : ["0", "."],
                "name" : ["eth2", "."],
                "mask" : ["255.255.0.0", 'ip']};

e.preRunning = _.clone(e.running);            
var n = cm.configMergeBySeq(e.preRunning.intf.data[0], dummy);
console.log(e.preRuning.intf.data[0]);

// var ret = cm.configGetByValue(e.Running, ["intf","data","?","idx"], "0");
// console.log(ret);



// for (var i in ret) {
// console.log(ret[i][0]+ret[i][1]+ret[i][2]);
// }

// console.log(cm.fmtCheckByRoot(e.Running.ip.route[1]));

// console.log('Run '+JSON.stringify(e.Running));
// console.log('Save '+JSON.stringify(e.readSave()));
// console.log(e.erase());
// console.log('erase Run'+JSON.stringify(e.Running));
// console.log('erase Save'+JSON.stringify(e.readSave()));
// console.log(e.save());
// console.log('save save'+JSON.stringify(e.readSave()));

//Loading module
// var mUtils = require('./mUtils.js')
// require('./intf.js');
// var e = require('./configEvent.js');
// var webS = require('./webS.js');

// var n = {
    // "intf" : [{
            // "name" : ["eth1", "."],
            // "speed" : ["11", "10|100|1000|auto"],
            // "duplex" : ["auto", "auto|full|half"],
            // "ip" : ["192.168.1.10", "ip"],
            // "mask" : ["255.255.255.0", "ip"]
        // }
    // ]
// };

// console.log(mUtils.fmtCheckByRoot(n.intf[0])[1]);

// e.assign(n);


//Disable DNS server first
// var dnsS = require('./dnsS.js');

//Enable Web
// webS.start(3000, 4430);