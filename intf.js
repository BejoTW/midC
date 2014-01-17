"use strict"; 
// var mUtils = require('./mUtils.js')
// var e = require('./configEvent.js');
var cm = require('./cm.js');

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

cm.e.on('intf', function (n) {
    console.log('HIHI');
    return;
    //Check which interface
    for (var i in e.running.intf) {
        if (n.intf[0].name[0] === e.running.intf[i].name[0]) {
            console.log('match');
            intUtils.set(n.intf[0]);
            return;
        }
    }
    console.log('no this interface');
    return;
});