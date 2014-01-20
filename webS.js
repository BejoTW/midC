"use strict";

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var intf = require('./routes/webIntf');
var http = require('http');
var path = require('path');
var https = require('https');
var fs = require('fs');
var _ = require('underscore');
var cm = require('./cm.js');
var e = require('./config.js');

var privateKey = fs.readFileSync('CA/mlb.key').toString();
var certificate = fs.readFileSync('CA/mlb.pem').toString();
var options = {
	key : privateKey,
	cert : certificate
}

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/intf', intf.page);

app.post('/intf', function(req, res) {
    
    //assign val
    var cfg = JSON.parse(req.body.data);
    console.log(JSON.stringify(cfg));
    // res.redirect( '/intf' );
    e.preRunning = JSON.parse(JSON.stringify(cfg));
    // e.preRunning.intf.data[0].name[0] = "eth1";
    // e.preRunning.intf.data[0].ip[0] = req.body.ip;
    // e.preRunning.intf.data[0].mask[0] = req.body.mask;
    // e.preRunning.intf.data[0].speed[0] = req.body.speed;
    // e.preRunning.intf.data[0].duplex[0] = req.body.duplex;
    //TODO: check val fmt
    var ret = cm.fmtCheckByRoot(e.preRunning.intf.data[1]);
    for(var i in ret) {
        if (ret[i].ret == false) {
            console.log("Error format: "+ret[i].item);
            res.redirect( '/intf' );
            return;
        }
    }
    // console.log('assign ready:' +JSON.stringify(e.preRunning));
    cm.assign(e.running, e.preRunning);
    res.redirect( '/intf' );
});

module.exports = {
    start : function (webPort, sslPort) {
        if (sslPort != null) {
            https.createServer(options, app).listen(sslPort, function() {
                console.log('https server started successfully. PORT = '+ sslPort);
            });
        }
        
        http.createServer(app).listen(webPort, function() {
            console.log('http server started successfully.PORT = '+ webPort);
        });
    }
}
