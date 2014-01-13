"use strict";

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var intf = require('./routes/intf');
var http = require('http');
var path = require('path');
var https = require('https');
var fs = require('fs');
var recv = require('./recv');
var e = require('./configEvent.js');
var _ = require('underscore');
var mUtils = require('./mUtils.js')

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
    var r = _.clone(e.running);
    r.intf[0].name[0] = "eth1";
    r.intf[0].ip[0] = req.body.ip;
    r.intf[0].mask[0] = req.body.mask;
    //TODO: check val fmt
    console.log('FMT CHECK: '+mUtils.fmtCheckByRoot(r.intf[0])[0]);
    // recv.main('intf', r);
    e.assign(r);
    console.log(req.body.ip);
    console.log(req.body.mask);
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
