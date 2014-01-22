"use strict";

function MongooseError(msg) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.message = msg;
    this.name = 'MongooseError';
};

MongooseError.prototype.__proto__ = Error.prototype;

var view = {
    log : function (s, level) {
        var enableLevel = 0;
        // level 0 - log, 1 - warning, 2 - error, 3 - oh...
        if (level == null) {
            level = 0;
        }
        if (level >= enableLevel) {
            console.log(s);
        }
        return;
    },
    error : function (s, level) {

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
