var MongoClient = require('mongodb').MongoClient;
// 数据库地址
var url = 'mongodb://localhost:27017/zs';
// 删除数据
var ObjectID = require('mongodb').ObjectID;

// 链接数据库
function _connectDB(callback) {
    //连接数据库
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(err, db);
    });
}

//插入数据
exports.insertDate = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).insertOne(json, function (err, result) {
            callback(err, result);
            db.close(); //关闭数据库
        })
    })
};

// 查询数据
exports.find = function (collectionName,json,callback,config) {
    // 查询用户登录的时候会变为空
    if(config == undefined){
        var limit = 0;
        var skip = 0;
    }else{
        var limit = parseInt(config.limit);
        var skip = parseInt(config.skip);
    }
    _connectDB(function (err,db) {
        db.collection(collectionName).find(json).sort({time:-1}).skip(skip).limit(limit).toArray(function (err, result) {
            if(err){
                console.log("err,失败");
                return ;
            }
            callback(result);
        });
    })
}

// 获取数据总数
exports.getAllCount = function (collectionName,callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).count({}).then(function(count) {
            callback(count);
            db.close();
        });
    })
}

// 删除数据
exports.removeData = function (collectionName,json,callback) {
    _connectDB(function (err,db) {
        db.collection(collectionName).deleteMany(json,function (err,results) {
            callback(err,results);
            db.close();
        });
    })
}
