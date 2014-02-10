"use strict";

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

var user = require('./routes/user');
var intf = require('./routes/webIntf');
var nat = require('./routes/webNat');
var routing = require('./routes/webRouting');

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
app.get('/nat', nat.page);
app.get('/routing', routing.page);

app.post('/receive', function(req, res) {
    
    var cfg = JSON.parse(req.body.data);
    console.log(JSON.stringify(cfg));
    e.preRunning = JSON.parse(JSON.stringify(cfg));
    //TODO: check val fmt
    var ret = cm.fmtCheckByRoot(e.preRunning);
    for(var i in ret) {
        if (ret[i].ret == false) {
            console.log("Error format: "+ret[i].item);
            res.send('{"status": false, "result":"format error", "item":"'+ret[i].item+'", "value":"'+ret[i].value+'"}');
            return;
        }
    }
    res.send('{"status": true}');
    cm.assign(e.running, e.preRunning);
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
