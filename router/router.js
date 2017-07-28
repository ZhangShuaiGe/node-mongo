// 引入数据库
var db = require("../model/db.js");
// 引入加密
var md5 = require("../model/md5.js");
// 删除数据需要的id
var ObjectID = require('mongodb').ObjectID;

var fs = require("fs");

// 首页
exports.doIndex = function(req,res,next){
    console.log("session",req.session.username);
    // console.log('取得的cookie:',req.cookies.user);
    // var getcookie = req.cookies.user;
    var username = req.session.username;
    db.find("liuyanben",{},function (result) {
        // 获取总数 并计算页数
        db.getAllCount("liuyanben",function (count) {
            var page = Math.ceil(count / 3);
            // 登录的情况下，首页展示头像
            if(username){
                db.find("user",{"name":username},function (result) {
                    // 获取头像地址,首次注册不会有头像，默认body.jpg;
                    var url = result[0].avatar == undefined ? "boy.jpg" : result[0].avatar;
                    // console.log("url",url);
                    res.render("index",{"count":page,"username":username,"img":url});
                })
                return ;
            }
            res.render("index",{"count":page,"username":username});
        })
    },{"skip":0,"limit":"3"});
};

// 登录
exports.doLogin = function (req,res,next) {
    var getcookie = req.cookies.user;
    console.log("cookie",getcookie);
    // 判断是否ajax请求
    var params = req.param("ajax");
    if(params){
        var username = req.param("username");
        // 将未加密的密码存入cookie
        var cookie_pwd = req.param("password");
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
                    var time = 3*24*60*1000;
                    // console.log(time);
                    res.cookie("user",{"name":username,"pwd":cookie_pwd},{ maxAge: time, httpOnly: true });
                }
                res.json({"result":"1","text":"/"});

            }

        });
        return ;
    }
    res.render("login",{"cookie":getcookie,"username":""});
};

// 注册
exports.showRegister = function (req,res,next) {
    res.render("register",{"username":""});
};

// 注册密码加密
exports.doRegister = function (req,res,next) {
    var name = req.param("name");
    var val = req.param("pwd");
    var _md5 = md5(md5(val));
    db.insertDate("user",{"name":name,"password":_md5},function (err,result) {
        res.json({"result":"1"});
    });
};

// 游客留言存入数据库
exports.doliuyan = function (req,res,next) {
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
};

// 读取游客留言
exports.doRead = function (req,res,next) {
    // 要跳过的数据
    var skip = (req.query.page - 1) * 3;
    db.find("liuyanben",{},function (result) {
        res.send({"result":result});
    },{"skip":skip,"limit":"3"});
};

// 删除游客留言
exports.doRemove = function (req,res) {
    var id = req.query.id;
    console.log(id);
    db.removeData("liuyanben",{"_id":ObjectID(id)},function (err,result) {
        res.redirect("/");
    })
};

// 显示个人中心
exports.showPersonal = function (req,res) {
    var username = req.session.username;
    // 如果未登录，不能进个人中心
    if(username == undefined){
        res.redirect("login");
        return ;
    }
    res.render("personal",{"username":username});
};

// 头像上传
exports.doAvatar = function (req,res) {
    var username = req.session.username;
    var img_base64 = req.param("img_base64");
    var path = './avatar/'+ username +'.jpg';//从app.js级开始找
    var base64 = img_base64.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
    var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
    console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
    fs.writeFile(path,dataBuffer,function(err){//用fs写入文件
        if(err){
            console.log(err);
        }else{
            var url = username + ".jpg";
            db.updateMany("user",{"name":username},{$set:{"avatar":url}},function (err, result) {
                if(err){
                    console.log("err",err);
                }
                res.json({"result":"1"});
            })
            // console.log('写入成功！');
        }
    })
};

// 退出
exports.doLoginout = function (req,res) {
    // 清除记录session 的 cookie
    res.clearCookie('connect.sid', { path: '/' });
    res.redirect("/");
};

// 404
exports.showError = function (req,res) {
    res.render("404");
};

exports.dologinMessage = function (req,res) {
    var username = req.session.username;
    db.find("user",{"name":username},function (err,rusult) {

    })
}