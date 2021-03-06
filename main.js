"use strict"; 
var tool = require('./tool.js');
var e = require('./config.js');
var _ = require('underscore');
var cm = require('./cm.js');

//enable Feature
require('./intf.js');
require('./nat.js');
require('./routing.js');

//Save-config Loading
e.running = JSON.parse(JSON.stringify(e.readSave()));
e.preRunning = JSON.parse(JSON.stringify(e.running));
e.runningText = JSON.stringify(e.running);
cm.initFeatureSet(); 
cm.initFeature();

//Enable Web Setting
var webS = require('./webS.js');
webS.start(3000, 4430);

//Enable CLI
require('./cli.js');       
        