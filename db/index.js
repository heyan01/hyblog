var mongoose=require('mongoose');//引入模块 操作数据库
var Schema=mongoose.Schema;//创建一个骨架
var settings=require('../settings');//引入setting模块 模块定义了密匙和数据库的网址

var models=require('./models');//返回的是定义的骨架

mongoose.connect(settings.url);//mongoose方法，去连接那个服务器上的数据库了 接下来的操作都是针对连接的那个数据库
mongoose.model('User',new Schema(models.User));//定义好的user骨架 创造User这个模型
mongoose.model('Article',new Schema(models.Article));//创造Article模型

//定义全局方法 可以获取模型
global.Model= function (type) {
    return mongoose.model(type);//一个参数是获取模型 两个参数是定义模型
};





