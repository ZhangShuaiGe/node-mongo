var express = require("express");

var mongodb = require("mongodb");

var bodyParser = require("body-parser");

var db = require("./model/db.js");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//模板引擎
app.set("view engine","ejs");

app.use(express.static("./public"));

app.get("/",function(req,res){
    db.find("liuyanben",{},function (result) {
        // 获取总数 并计算页数
        db.getAllCount("liuyanben",function (count) {
            var page = Math.ceil(count / 3);
            res.render("index",{"count":page});
        })
    },{"skip":0,"limit":"3"});

});

// 表单post提交
app.post("/liuyan",function (req,res) {
    var name = req.body.name;
    console.log(name);
    var liuyan = req.body.liuyan;
    console.log(liuyan);
    db.insertDate("liuyanben",{
        "name":name,
        "liuyanb" : liuyan ,
        "time": new Date(),
    },function (err,result) {
        if(err){
            console.log("error");
            res.send(0);
        }else{
            console.log("成功");
            res.json({"result":"1"});
        }
    })
})

// 读取数据库
app.get("/du",function (req,res) {
    // 要跳过的数据
    var skip = (req.query.page - 1) * 3;
    db.find("liuyanben",{},function (result) {
        res.send({"result":result});
    },{"skip":skip,"limit":"3"});
})

app.listen(3000);