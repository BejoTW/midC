"use strict";
//Web 
var express = require('express'), https = require('https'), fs = require('fs');
var http = require('http');

var privateKey = fs.readFileSync('CA/mlb.key').toString();
var certificate = fs.readFileSync('CA/mlb.pem').toString();

var www = '/www';
var indexName = 'MLink.html';


var options = {
	key : privateKey,
	cert : certificate
}

var app = express();

app.use(express.favicon());
app.use(express.compress());
app.use('/',express.static(__dirname + www));

app.get('/', function(req, res, next) {
    res.sendfile(__dirname + www +'/'+ indexName);
});

app.get('*', function(req, res, next) {
    res.send('404 ERROR');
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