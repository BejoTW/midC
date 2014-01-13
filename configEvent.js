"use strict";
var mUtils = require('./mUtils.js')
var util = require('util');
var events = require('events');

//Loading Config to running config
var View = function () {};

var fs = require('fs');

util.inherits(View, events.EventEmitter);
View.prototype.running = JSON.parse(fs.readFileSync('./config.save', 'utf8'));;

View.prototype.assign = function (n) {
    for (var i in n) {
        if (mUtils.objCompare(n[i], this.running[i])) {
            continue;
        } else {
            this.emit(i, n);
            break;
        }
    }
}

module.exports = new View;
