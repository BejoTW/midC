"use strict";
/*
 * GET and Render Routing page.
 */
var e = require('../config.js');
exports.page = function (req, res) {
    res.render('webRouting', {
        config : JSON.stringify(e.running),
        title : 'Routing',
    });
};