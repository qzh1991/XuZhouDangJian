const mysql = require('mysql')
const pool = mysql.createPool({
    host: '193.112.163.17',
    user: 'root',
    password: 'okok',
    database: 'Exam',
    port: 3306
})

var readline = require('readline');
var fs = require('fs');
var os = require('os');

var fReadName = './answer.txt';
var fWriteName = './answer1.txt';
var fRead = fs.createReadStream(fReadName);
var fWrite = fs.createWriteStream(fWriteName);


var objReadline = readline.createInterface({
    input: fRead,
    // 这是另一种复制方式，这样on('line')里就不必再调用fWrite.write(line)，当只是纯粹复制文件时推荐使用
    // 但文件末尾会多算一次index计数   sodino.com
    //  output: fWrite, 
    //  terminal: true
});

var questions = []
var reg1 = /(\(|\（)(\w+|√|×)(\)|\）)?/g
var reg2 = /\w+$/
var reg3 = /\(\)|\（\）/g
reg1.compile(reg1)
reg2.compile(reg2)
reg3.compile(reg3)
var line = '',
one = {},
q = {}
objReadline.on('line', (l) => {
    var first = l.slice(0, 1)
    if (first != 0 && !isNaN(first)) {
        one={}
        q = {}
        l = l.replace(/\s+/g, '')
        let left = l.indexOf('、')
        line = l.slice(left + 1)
        q.no = l.slice(0, left)
        q.question=line
    } else if ('ABCDEFG'.indexOf(first)>=0) {
        one[first] = l.slice(2)
    } else if (first == '正') {
        a = l.slice(5).replace(/\s+/g, '')
        q.answer = a
        let ops = a.split('')
        q.text = ops.map(function(i){
            return one[i]
        }).join('')
        //i=>one[i]).join('')
        questions.push(q)
        var tmp = q.no + '.' + line + '-' + a + ':' + q.text;
        fWrite.write(tmp + os.EOL); // 下一行
    }
});

objReadline.on('close', () => {
    console.log('答案采集完成');
    pool.query("DROP TABLE if exists `XuZhouDangJian`;", function (err, r) {
        if (err) throw err
        console.log('删除表完成');
        pool.query("CREATE TABLE `Exam`.`XuZhouDangJian` (`id` INT NOT NULL AUTO_INCREMENT,`no` NVARCHAR(10) NUll,`question` NVARCHAR(200) NULL,`answer` NVARCHAR(200) NULL,`text` NVARCHAR(1000) NULL,PRIMARY KEY (`id`));", function (err, r) {
            if (err) throw err
            console.log('重建表完成');
            questions.forEach(q => {
                pool.query("INSERT `Exam`.`XuZhouDangJian`(`no`,`question`,`answer`,`text`) VALUES(?,?,?,?);",[q.no,q.question,q.answer,q.text] , function (err, r) {
                    if (err) throw err
                })
            });
            console.log('答案上传完成');
        })
    })
});