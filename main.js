"use strict"; 
//Loading module
var mUtils = require('./mUtils.js')
require('./intf.js');
var e = require('./configEvent.js');
var webS = require('./webS.js');

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
webS.start(3000, 4430);