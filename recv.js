"use strict";
var e = require('./configEvent.js');
var _= require('underscore');

var recv = {
    main: function (t, val) {
        var n = _.extend(e.running[t][0], val);
        console.log(n);
        e.assign(n);
        // console.log(tmp);
        // for (var i in e.running[t]) {
            // e.running[t][i].name
        // }
    }
}

module.exports = recv;