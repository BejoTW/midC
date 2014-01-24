"use strict";
var _ = require('underscore');

//default condig
var savePath = './config.save';
var defPath = './config.def';

//Loading Config to running config
var fs = require('fs');

var view = {
    preRunning : {},
    running : {},
    readSave : function () {
        return JSON.parse(fs.readFileSync(savePath, 'utf8'));
    },
    save : function () {
        try {
            fs.writeFileSync(savePath, JSON.stringify(view.Running), 'utf8');
            return true;
        } catch (e) {
            return false;
        }
    },
    erase : function () {
        try {
            var def = fs.readFileSync(defPath, 'utf8');
            fs.writeFileSync(savePath, def, 'utf8');
            view.Running = JSON.parse(def);
            return true;
        } catch (e) {
            return false;
        }
    },
    syncRunningConfig : function () {
        view.running = JSON.parse(JSON.stringify(view.preRunning));
        return true;
    }
}

module.exports = view;
