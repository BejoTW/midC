"use strict";
/*
 * GET and Render NAT page.
 */
var e = require('../config.js');
exports.page = function (req, res) {
    res.render('webNat', {
        config : JSON.stringify(e.running),
        title : 'NAT',
    });
};
