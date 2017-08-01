/**
 * Created by z on 2017/8/1.
 */
var mongoose = require("mongoose");
// mongo.connect('mongodb://localhost/mongo');
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/mongoose');
db.on("open",function () {
    console.log("连接成功");
});

var BookSchema = new mongoose.Schema({
    name : String,  //定义一个属性name，类型为String
    author: String,
    price : Number,
    time  : {type : Date, default: Date.now}
});

// BookSchema.methods.findBook = function (callback) {
//     return this.model("Book").find({},callback);
// }

var BookModel = db.model("Book",BookSchema);

var _id = function (id) {
    return  mongoose.mongo.ObjectId(id);
};

module.exports = BookModel;
