var socket = io();
var max = 50;

var ctx = document.getElementById("LineGraph").getContext('2d');
var LineGraph1 = new Chart(ctx, {
type: 'line',
data: {
    labels: [],
    datasets: [
    {
        label: "access_log",
        borderColor: 'rgb(255, 0, 0)',
        lineTension: 0,
        fill: false, 
        data: [],
    },{
        label: "secure_log",
        borderColor: 'rgb(0, 255, 0)',
        lineTension: 0,
        fill: false, 
        data: [],
    },

    ]
},
options: {
    responsive: true,
    scales: {
        yAxes: [{                      //y軸設定
            display: true,             //表示設定
            scaleLabel: {              //軸ラベル設定
               display: true,          //表示設定
               labelString: 'number of log',  //ラベル
            //    fontSize: 18               //フォントサイズ
            },
            ticks: {                      //最大値最小値設定
                min: 0,                   //最小値
                max: 50,                  //最大値
                // fontSize: 18,             //フォントサイズ
                // stepSize: 5               //軸間隔
            },
        }],
    },
},
});

/* Data add */
function addData(chart, label, data1, data2) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data1);
    chart.data.datasets[1].data.push(data2);
    chart.update();
}

var cnt = 0;
var wc_access = 0;
var wc_secure = 0;

/*
var add = function(){
    var now = new Date();
    var time = now.toLocaleTimeString()
    addData(LineGraph1, time, wc_access, wc_secure)
    cnt++;
    //wc_access = wc_access + 1;
    //wc_secure = wc_secure + 1.5;
}*/

function send_cmd_scan(){
    const num = document.scan.scancmd.selectedIndex;
    const str = document.scan.scancmd.options[num].value;

    console.log("send; " + str);
    socket.emit("exploit", str);
};

function send_cmd_exploit(){
    const num = document.exploit.exploitcmd.selectedIndex;
    const str = document.exploit.exploitcmd.options[num].value;

    console.log("send; " + str);
    socket.emit("exploit", str);
};

$(() =>{
    socket.on("graph update", (datas) => {
        var now = new Date();
        var time = now.toLocaleTimeString();

        if(datas.ac_cnt > max || datas.sc_cnt > max){
            if (datas.ac_cnt > datas.sc_cnt){
                max = Math.ceil( datas.ac_cnt/50 ) * 50;
            }else{
                max = Math.ceil( datas.sc_cnt/50 ) * 50;
            }
        }
        LineGraph1.options.scales.yAxes[0].ticks.max = max;
        LineGraph1.data.labels.push(time);
        LineGraph1.data.datasets[0].data.push(datas.ac_cnt);
        LineGraph1.data.datasets[1].data.push(datas.sc_cnt);
        LineGraph1.update();
    })

    socket.on("cmd start", (cmd) => {
        document.getElementById("executing").textContent = cmd; 
    })

});



//setInterval(add,5000);
/*
setInterval(function(){
    wc_access = wc_access +8;
}, 7000);

setInterval(function(){
    wc_secure = wc_secure + 12;
}, 2000);

setInterval(function(){
    wc_secure = wc_secure + 30;
}, 10000);
*/

var id = setInterval(function(){
    socket.emit("log check");
    }, 3000);