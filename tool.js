"use strict";
//Define log level
var EnableLevel = 0;
var Debug = 0;
var Log = 1;
var Warning = 2;
var Error = 3;

function MongooseError(msg) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.message = msg;
    this.name = 'MongooseError';
};

MongooseError.prototype.__proto__ = Error.prototype;

var view = {
    log : function (s, level) {
        // level 1-log, 2-warning, 3-error, 0-Debug...
        if (level == null|| level > Error) {
            level = 0;
        }
        if (level >= EnableLevel) {
            console.log(s);
        }
        return;
    },
    logObj : function (s, level) {
        if (typeof s == 'object') {
            s = JSON.stringify(s, null, 4)
        }
        view.log(s, level);
        return;
    },
    error : function (s) {

        var err = new Error;

        Error.prepareStackTrace = function (err, stack) {
            return stack;
        };

        Error.captureStackTrace(err, this.error);

        console.error('%s:function:%s(%d):' + s, err.stack[0].getFileName(), err.stack[0].getFunctionName(), err.stack[0].getLineNumber());
        return;
    }
}

module.exports = view;
