var readline = require('readline');
var e = require('./config.js');
var tool = require('./tool.js');

var rl = readline.createInterface({
        input : process.stdin,
        output : process.stdout,
        completer : completer
    });

var proStr = 'Device';
var proMode = '>'; //nomal mode:'>', exec mode:'#'

// var cmdInNormal = 'help exit exec show'.split(' ');
var cmdInNormal = {
    "help" : ['show help page', null],
    "show" : ['show configuration/system status', null],
    "exec" : ['enter exec mode', null],
    "exit" : ['exit to up level', null]
};

var cmdInNormalName = [];
for (var i in cmdInNormal) {
    cmdInNormalName.push(i);
}

function completer(line) {
    var hits = cmdInNormalName.filter(function (c) {
            return c.indexOf(line) == 0
        });
    if (line.length === 0) {
        return [cmdInNormalName, line];
    } else {
        return [hits, line];
    }
}

var view = {
    init : function () {
        cmdInNormal.show[1] = view.show;
    },
    cmdListCk : function (arg, lists) {
        var list = [];
        for (var i in lists) {
            list.push(i);
        }
        var hits = list.filter(function (c) {
                return c.indexOf(arg) == 0;
            });
        if (hits.length === 0 || hits.length > 1) {
            tool.log('Ambiguous command: %s', arg);
            return false;
        }
        return hits;
    },
    cmd : function (s) {
        var argv = s.split(' ');
        var hits = view.cmdListCk(argv[0], cmdInNormal);
        if (hits != false) {
            cmdInNormal[hits[0]][1](argv);
        }
        return;
    },
    show : function (argv) {
        var cmdInShow = {
            "running" : ['running config', null],
            "preRunning" : ['pre running config', null],
            "saveRunning" : ['Running config in storage', null],
            "?" : ['Help page', null]
        }
        cmdInShow.running[1] = function () {
            tool.logObj(e.running, 0);
            return;
        }
        cmdInShow.preRunning[1] = function () {
            tool.logObj(e.preRuning, 0);
            return;
        }
        cmdInShow.saveRunning[1] = function () {
            tool.logObj(e.readSave(), 0);
            return;
        }
        cmdInShow['?'][1] = function () {
            for (var i in cmdInShow) {
                tool.log(i+' - '+cmdInShow[i][0], 1);
            }
            return;
        }
        var hits = view.cmdListCk(argv[1], cmdInShow);
        if (hits != false) {
            cmdInShow[hits[0]][1]();
        }
    }
}

view.init();
rl.setPrompt(proStr + proMode);
rl.prompt();

rl.on('line', function (line) {
    switch (line.trim()) {
    case 'exec':
        tool.log('Enter exec mode...');
        proMode = '#';
        break;
    case 'exit':
        if (proMode === '>') {
            rl.close();
        }
        proMode = '>';
        break;
    case '?':
    case 'help':
        for (var i in cmdInNormal) {
            tool.log(i+' - '+cmdInNormal[i][0], 1);
        }
        break;
    case '':
        break;
    default:
        view.cmd(line);
        break;
    }
    rl.setPrompt(proStr + proMode);
    rl.prompt();
}).on('close', function () { // ctrl+c
    tool.log('\nHave a great day!');
    process.exit(0);
});

module.exports = view;