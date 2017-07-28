var express = require("express");
var mongodb = require("mongodb");
var bodyParser = require("body-parser");
var cookieParser= require("cookie-parser");
var session = require("express-session");
var app = express();
var Router = require("./router/router");

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
app.use(express.static("./avatar"));

app.get("/",Router.doIndex); //首页显示 + 逻辑
app.get("/login",Router.doLogin);// 登录显示 + 逻辑
app.get("/register",Router.showRegister);// 注册
app.post("/register",Router.doRegister)// 接收注册 存入数据库 并且md5两次密码加密
app.post("/liuyan",Router.doliuyan);// 留言表单post提交,存入数据库
app.get("/du",Router.doRead);// 读取留言列表
app.get("/shanchu",Router.doRemove);// 删除留言
app.get("/personal",Router.showPersonal);//显示个人中心
app.post("/userinfo",Router.doAvatar);// 头像上传
app.get("/loginout",Router.doLoginout);// 退出
app.get("./message",Router.dologinMessage);// 注册用户的留言接收
// 注意：404在最下面
app.get("/*",Router.showError);// 404
app.listen(3000);