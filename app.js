var express = require("express");

var mongodb = require("mongodb");

var bodyParser = require("body-parser");

var db = require("./model/db.js");

var cookieParser= require("cookie-parser");

var session = require("express-session");

var app = express();

// 引入加密
var md5 = require("./model/md5.js");

// 删除数据
var ObjectID = require('mongodb').ObjectID;

app.use(bodyParser.urlencoded({ extended: false }));
// 使用cookie 要用中间件
app.use(cookieParser());
// 使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

//模板引擎
app.set("view engine","ejs");

// 静态资源
app.use(express.static("./public"));

// 首页
app.get("/",function(req,res){
    console.log("session",req.session.username);
    // console.log('取得的cookie:',req.cookies.user);
    // var getcookie = req.cookies.user;
    var getsession = req.session.username;
    db.find("liuyanben",{},function (result) {
        // 获取总数 并计算页数
        db.getAllCount("liuyanben",function (count) {
            var page = Math.ceil(count / 3);
            res.render("index",{"count":page,"username":getsession});
        })
    },{"skip":0,"limit":"3"});
});

// 登录
app.get("/login",function (req,res) {
    var getcookie = req.cookies.user;
    // 判断是否ajax请求
    var params = req.param("ajax");
    if(params){
        var username = req.param("username");
        // md5加密两次对比，数据库中是加密的
        var password = md5(md5(req.param("password")));
        // 是否记住密码
        var check = req.param("check");
        db.find("user",{"name":username},function (result) {

            if(result.length == 0){
               res.json({"result":"0","text":"用户名错误"});
               return ;
            }else if(password != result[0].password){
                res.json({"result":"0","text":"密码错误"});
            }else{
                req.session.username = username;
                if(check == 1){
                    // res.cookie("名字","值","配置");
                    res.cookie("user",{"name":username,"pwd":password},{ maxAge: 900000, httpOnly: true });
                }
                res.json({"result":"1","text":"/"});

            }

        });
        return ;
    }
    res.render("login",{"cookie":getcookie});
});

// 注册
app.get("/register",function (req,res) {
    res.render("register");
})

// 接收注册 存入数据库 并且md5 密码加密
app.post("/register",function (req,res) {
    var name = req.param("name");
    var val = req.param("pwd");
    var _md5 = md5(md5(val));
    db.insertDate("user",{"name":name,"password":_md5},function (err,result) {
        res.json({"result":"1"});
    });
})

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
});

// 读取数据库
app.get("/du",function (req,res) {
    // 要跳过的数据
    var skip = (req.query.page - 1) * 3;
    db.find("liuyanben",{},function (result) {
        res.send({"result":result});
    },{"skip":skip,"limit":"3"});
});

// 删除数据
app.get("/shanchu",function (req,res) {
    var id = req.query.id;
    console.log(id);
    db.removeData("liuyanben",{"_id":ObjectID(id)},function (err,result) {
        res.redirect("/");
    })
});

app.listen(3000);