"use strict"; 
//Loading module
var mUtils = require('./mUtils.js')
require('./interface.js');
var configE = require('./configEvent.js');
var webS = require('./webS.js');

var n = {
    "interface" : [{
            "name" : ["eth1", "."],
            "speed" : ["11", "10|100|1000|auto"],
            "duplex" : ["auto", "auto|full|half"],
            "ip" : ["192.168.1.10", "ip"],
            "mask" : ["255.255.255.0", "ip"]
        }
    ]
};

for (var i in n.interface[0]) {
    if (mUtils.fmtCheck(n.interface[0][i][0], n.interface[0][i][1])) {
        continue;
    } else {
        console.log('Input format error: '+i+': '+ n.interface[0][i][0]);
        continue;
    }
}


configE.assign(n);


//Disable DNS server first
// var dnsS = require('./dnsS.js');

//Enable Web
// webS.start(8880, 4430);