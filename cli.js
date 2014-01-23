var readline = require('readline');
var rl = readline.createInterface({
        input : process.stdin,
        output : process.stdout,
        completer : completer
    });

var proStr = 'Device';
var proMode = '>'; //nomal mode:'>', exec mode:'#'

// var cmdInNormal = 'help exit exec show'.split(' ');
var cmdInNormal = {
    "help" : ['show help page'],
    "show" : ['show configuration/system status'],
    "exec" : ['enter exec mode'],
    "exit" : ['exit to up level']
};

var cmdInNormalName = [];
for (var i in cmdInNormal) {
    cmdInNormalName.push(i);
}

// function completer(linePartial, callback) {
  // callback(null, [['123'], linePartial]);
// }

function completer(line, cb) {
    var hits = cmdInNormalName.filter(function (c) {
            return c.indexOf(line) == 0
        });   
    if (line.length === 0) {
        return [cmdInNormalName, line];
    } else {
        cb(null, [['123'], line]);
        // return [hits, line];
    }
}

rl.setPrompt(proStr + proMode);
rl.prompt();

rl.on('line', function (line) {
    switch (line.trim()) {
    case 'exec':
        console.log('Enter exec mode...');
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
            console.log('%s - %s', i,cmdInNormal[i][0]);
        }
        break;
    default:
        break;
    }
    rl.setPrompt(proStr + proMode);
    rl.prompt();
}).on('close', function () { // ctrl+c
    console.log('\nHave a great day!');
    process.exit(0);
});
