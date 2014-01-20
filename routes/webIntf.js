"use strict";
/*
 * GET and Render Interface page.
 */
var e = require('../config.js');

exports.page = function (req, res) {
    res.render('webIntf', {
        title : 'Interface',
        name : e.running.intf.data[0].name[0],
        ip : e.running.intf.data[0].ip[0],
        speed: e.running.intf.data[0].speed[0],
        duplex: e.running.intf.data[0].duplex[0],
        mask : e.running.intf.data[0].mask[0]
    });
};
