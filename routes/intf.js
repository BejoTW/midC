"use strict";
/*
 * GET and Render Interface page.
 */
var e = require('../configEvent.js');

exports.page = function (req, res) {
    res.render('intf', {
        title : 'Interface',
        name : e.running.intf[0].name[0],
        ip : e.running.intf[0].ip[0],
        mask : e.running.intf[0].mask[0]
    });
};
