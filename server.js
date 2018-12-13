var express = require('express');
var FormData = require('form-data');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const mysql = require('mysql')
const pool = mysql.createPool({
    host: '193.112.163.17',
    user: 'root',
    password: 'okok',
    database: 'Exam',
    port: 3306
})

function query(name,i, l) {
    let line = l
    return new Promise(resolve => {
        let left = line.indexOf('：')
        line = line.slice(left + 1)
        let right = line.lastIndexOf('①')
        if (right > 0) {
            line = line.slice(0, right)
        }
        pool.query("select answer,text from " + name + " where question = ?", line, function (err, r) {
            if (err) throw err
            let a={}
            if (r.length) {
                a.s=1
                a.a=r[0].answer
                a.t=r[0].text
            }else{
                a.s=0
                a.a=Number(i) + 1 + '.' + l
                a.t=''
                console.log(a.a)
            }
            resolve(a);
        })
    });
}
async function getData(name,array) {
    let aa = []
    for (const i in array) {
        let b = await query(name,i, array[i])
        aa.push(b)
    }
    return aa
}

app.get('/', function (req, res) {
    res.send('Hello World!');
  });
  app.post('/', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST");
    let array = JSON.parse(req.body.text)
    console.log(array)
    getData(req.body.name,array).then(a => {
        console.log(a)
        res.json(a);
    })
});

var server = app.listen(3000, function () {
    var host = server.address().address;  //地址
    var port = server.address().port;  //端口
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});