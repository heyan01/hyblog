var express = require('express');

var router = express.Router();//var app=new express() 创建的实例也可以app.get()

/* GET home page. *///当路由得到了get请求的时候 并且路径是/的时候，就执行函数
router.get('/', function(req, res, next) {
    res.redirect('/article/list');//让客户端想这个接口在发送一次请求，监听到请求之后 在此执行app模块
});
module.exports = router;


