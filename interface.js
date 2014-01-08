"use strict"; 
var mUtils = require('./mUtils.js')
var e = require('./configEvent.js');

var exec = require('child_process').exec, child;



var intUtils = {
    set: function (s) {
        child = exec('ifconfig '+s.name[0]+' '+s.ip[0],
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        })
    }
}

e.on('interface', function (n) {
    // console.log(JSON.stringify(e.running));
    //Check which interface
    return;
    for (var i in e.running.interface) {
        if (n.interface[0].name[0] === e.running.interface[i].name[0]) {
            console.log('match');
            intUtils.set(n.interface[0]);
            return;
        }
    }
    console.log('no this interface');
    return;
});

