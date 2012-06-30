/**
 * Created with JetBrains WebStorm.
 * User: zoupeng
 * Date: 12-6-29
 * Time: 下午7:44
 * To change this template use File | Settings | File Templates.
 */


//daemon code
if(process.argv.length > 1) {
    var newArgv = [];
    var ifChild = false;
    process.argv.forEach(function (val, index, array) {
        if(val == '-run_in_child') {
            ifChild = true;
        }
        else if(index > 0){
            newArgv.push(val);
        }
    });

    if(!ifChild) {
        newArgv.push('-run_in_child');//子进程需要一个命令标志：run_in_child
        Monitor();
        function Monitor()
        {
            console.log('Monitor is running.');
            var cp = require('child_process').spawn(process.argv[0], newArgv);
            cp.stdout.pipe(process.stdout);
            cp.stderr.pipe(process.stderr);
            cp.on('exit', function (code)
            {
                //可以在此添加进程意外退出的处理逻辑
                delete(cp);
                console.log('Child process exited with code ' + code);
                setTimeout(Monitor, 500);
            });
        }
        return;
    }
}

//end daemon code

var net = require('net');
var dbgOpen = false;
var showMsgOpen = true;
var servAddr = "0.0.0.0";
var servPort = 80;
var prxyMap = new Array();
prxyMap["106.187.93.184"] = {port:88, addr:"127.0.0.1"};
prxyMap["www.yafeilee.me"] = {port:8080, addr:"127.0.0.1"};
prxyMap["yafeilee.me"] = {port:8080, addr:"127.0.0.1"};
prxyMap["www.diaryonline.me"] = {port:8080, addr:"127.0.0.1"};
prxyMap["diaryonline.me"] = {port:8080, addr:"127.0.0.1"};

function dbg(msg) {
    if (dbgOpen) {
        console.log(msg);
    }
}

function showMsg(msg) {
    if (showMsgOpen) {
        console.log(msg);
    }
}

function get_http_host(httpContent) {
    var hostStart = httpContent.indexOf('Host:');
    if (hostStart < 0) {
        return null;
    }
    var hostStop = httpContent.indexOf('\r\n', hostStart + 5);
    if (hostStop < 0) {
        return null;
    }
    return httpContent.substr(hostStart + 6, hostStop - hostStart - 6);
}

var PrxyConn = function () {
    if (this.msgs.length > 0) {
        while (this.msgs.length > 0) {
            this.write(this.msgs.pop());
            dbg("Pry first client msg");
        }
    }

    this.on('data', function (data) {
        if (this.oriConn && this.oriConn.writable) {
            this.oriConn.write(data);
            dbg("Pry oriServer msg: len=" + data.length);
        }
    });

    this.on('end', function () {
        dbg("Ori server closed");
        if (this.oriConn) {
            this.oriConn.end();
            this.oriConn = null;
            dbg("Close ori client");
        }
        this.end();
    });

    this.on('error', function (exception) {
        showMsg('err serv: ' + exception.description);
        if (this.oriConn) {
            this.oriConn.end();
            this.oriConn = null;
        }
        this.end();
    })
}

var serv = net.createServer(function (stream) {
    stream.setEncoding('utf8');

    stream.on('connect', function () {
        dbg('New connect :' + this.remoteAddress + " " + this.remotePort);
        this.prxyConn = null;
        this.prxyHost = null;
    })

    stream.on('data', function (data) {
        //do proxy connect
        if (!this.prxyHost) {
            this.prxyHost = get_http_host(data);

            if (!this.prxyHost) {
                dbg('Get host failed, Close connection');
                stream.end();
                return;
            }

            dbg('Get host: ' + this.prxyHost);
            var prxyOpt = prxyMap[this.prxyHost];
            if (!prxyOpt) {
                dbg('Can\'t find host config: ' + this.prxyHost);
                stream.end();
                return;
            }

            this.prxyConn = net.connect(prxyOpt.port, prxyOpt.addr, PrxyConn);
            this.prxyConn.oriConn = this;
            this.prxyConn.rmtAddr = prxyOpt.addr;
            this.prxyConn.rmtPort = prxyOpt.port;
            this.prxyConn.msgs = new Array();
            this.prxyConn.msgs.push(data);

            showMsg('Redirect ' + this.prxyHost + ' to ' + prxyOpt.addr + ':' + prxyOpt.port);
            return;
        }


        if (this.prxyConn && this.prxyConn.writable) {
            this.prxyConn.write(data);
        }

        dbg("Pry oriClient msg: len=" + data.length);
    })

    stream.on('end', function () {
        dbg('Origin client end');
        if (this.prxyConn) {
            dbg('Close prxyConn');
            this.prxyConn.end();
            this.prxyConn = null;
        }
        stream.end();
    })

    stream.on('error', function (exception) {
        showMsg('err client: ' + exception.description);
        if (this.prxyConn) {
            this.prxyConn.end();
            this.prxyConn = null;
        }
        stream.end();
    })
})

serv.listen(servPort, servAddr);
showMsg("Prxy Start " + servAddr + ":" + servPort);

