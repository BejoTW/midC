"use strict";
var mUtils = require('./mUtils.js')
var util = require('util');
var events = require('events');

//Loading Config to running config
var view = function () {};

var fs = require('fs');

util.inherits(view, events.EventEmitter);
view.prototype.running = JSON.parse(fs.readFileSync('./config.save', 'utf8'));;

view.prototype.assign = function (n) {
    for (var i in n) {
        if (mUtils.objCompare(n[i], this.running[i])) {
            continue;
        } else {
            this.emit(i, n);
            break;
        }
    }
}

module.exports = new view;

//Exec

// var exec = require('child_process').exec, child;

// child = exec('ls -l',
// function (error, stdout, stderr) {
// console.log('stdout: ' + stdout);
// console.log('stderr: ' + stderr);
// if (error !== null) {
// console.log('exec error: ' + error);
// }
// })
