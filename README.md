# [midC](https://github.com/BejoTW/midC)

## DESCRIPTION

Controller for embedded system by nodeJS

## USAGE

Installation method:
```chef
#git clone SRC_PATH.git
#npm install
#nodejs main.js
vist:
http://192.168.1.10:3000/
https://192.168.1.10:4430/
```

#### Component

##### WebUI:

```chef
component 
	- Setup var: Server port, SSL port, 
	- gen WebPage from config dynamic
File:
	- web.js
		-main JS
	- ./public
		- store www file
	- ./CA
		- certification file 

	- ./views
		- ejs file example: intf.ejs

	- ./routes
		- *.js - control ejs example: WebIntf.js
```

##### CM: Config management

```chef
component:
	- combine config
	- assign feature
API:
	- var cm = require('./cm.js');
	- configCompare(config, config):
		- return true|false
	- initFeatureSet
		- Just sort Set by seq
	- initFeature
		- init all feature by Set seq
	- featureGroup
		- example:
```		
```json
		{ "1": [ [ "e", 1, false, 10, false, false ],
             [ "a", 1, false, 11, false, false ] 
            ],
      "2": [ [ "g", 2, false, 10, false, false ] ],
      "4": [ [ "b", 4, false, 9, false, false ],
             [ "c", 4, false, 10, false, false ],
             [ "a", 4, false, 10, false, false ],
             [ "intf", 4, false, 20, false, false ] ],
      "5": [ [ "routing", 5, false, 10, false, false ] ] }
```
```chef
	- featureReq
		- example:   PS: isDep - is Depened ?
		-     0    1    2     3      4        5
          [ [ "e", 1, false, 10, false, false ],
            [ "a", 1, false, 11, false, false ],
            [ "g", 2, false, 10, false, false ],
            [ "b", 4, false, 9, false, false ],
            [ "c", 4, false, 10, false, false ],
            [ "a", 4, false, 10, false, false ],
            [ "intf", 4, false, 20, false, false ],
            [ "routing", 5, false, 10, false, false ] ]  

	- var featureSet //config by SI
	- 
		- intf:[name, SystemLevel, isDep, Seq(1~9999), isTriger, isReload,[{specify number, specify number}]];
//SystemLevel
//0 - God
//1 - Kernel
//2 - module/Driver
//3 - Network L1
//4 - Network L2
//5 - Network L3
//6 - Network L4 - L7
//7 - Low level  

	- cm.setFeatureAllOnByLevel(level)
		- all on form the level
		- return true|false

	- cm.setFeatureReload(name)
		- reload flag by name
		- return true|false

	- cm.assign(run, preRun)
		- return true|false

	- cm.fmtCheck(input);
		- return (true) | (false, value) -> value: The first fail item

	- cm.configGetByValue(rootConfig, name, value);
		- return [true|false, indexConfig]

	- cm.configMergeByseq(input)
		- return [(true| false, value]

	- cm.configGetAll()
		- return (Allvalue) | (false)

	- cm.fmtCheckByRoot(input)
		- retune [ret, item, value]
		- ret = true|false
```


##### CM -> feature example: intf:

```chef
component:
	- Set int IP, Mask, speed, duplex
	- Process handle
	- reg global restart needing
```

##### Storage - Config format/API

```chef
File: 
	- config.js
		- main JS
	- config.save 
		- Save to flash ---> Now:  ./config.save
		- Start-up read it from "fix-storage"
	- config.running
		- Store in memory ---> buck-up in ./config.running
		- Global: var e.running
API:
example:
var e = require('./config.js');
	- e.running
		- return < running config in memory >
		- error: false - nothing in memory
	- e.cp(config_dest, config_source) // No implement 
		- copy config to specify target
		- return <final config>
		- error: false - copy fail
	- e.save()
		- copy e.running to e.save
		- return true| false
	- e.erase(config)
		- del config.save and copy default to config
		- return true/false
config Format
	1. JSON format
	2. All string | true/false
	3. [value, format by regEX]
	4. special case: ip, .
	5. Level 1. like intf, ip means FETURE UNIT
example:
{
    "intf" : [{
            "idx" : ["0", "."],
            "name" : ["eth1", "."],
            "duplex" : ["auto", "auto|full|half"],
            "speed" : ["auto", "10|100|1000|auto"],
            "ip" : ["192.168.10.1", "ip"],
            "mask" : ["255.255.255.0", "ip"],
            "status" : null
        }
    ],
    "ip" : {
        "route" : [{
                "dest" : ["192.168.10.1", "ip"],
                "mask" : ["255.255.255.255", "ip"],
                "via" : ["192.168.1.1", "ip"],
                "dev" : ["eth0", "."]
            }, {
                "dest" : ["192.168.9.0", "ip"],
                "mask" : ["255.255.255.0", "mask"],
                "via" : ["192.168.1.1", "ip"],
                "dev" : ["eth0", "."]
            }
        ]
    }
}

```

##### Tool

```chef
tool.log()
    -var EnableLevel = 0;
var Debug = 0;
var Log = 1;
var Warning = 2;
var Error = 3;
	- level 1-log, 2-warning, 3-error, 0-Debug...

tool.logObj()
	- obj to tool.log()

tool.error()
	- error log and print "<file name>:function:<function name>(line):"
```

