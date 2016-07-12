var express = require('express');//引入模块
var path = require('path');
var favicon = require('serve-favicon');//打开一个网站 会试着获取faviocn.ico 如果几次获取不到就放弃
var logger = require('morgan');//记录日志的
var cookieParser = require('cookie-parser');//cookie解析 req.cookies
var bodyParser = require('body-parser');//req.body
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);//返回的是一个函数 执行并传参

//路由 是在下面这些文件里引入了 routes.get('/',function() )
var routes = require('./routes/index');//模块返回的是routes一个路由工厂创建的路由
var user = require('./routes/user');
var article=require('./routes/article');
var settings=require('./settings');
var flash=require('connect-flash');
//引入数据库操作模块 首先会找index.js
var db=require('./db');

var app = express();//这就是这个模块返回的东西

// view engine setup
app.set('views', path.join(__dirname, 'views'));//设置模板引擎views属性是一个路径
app.set('view engine', 'html');
app.engine('.html',require('ejs').__express);

// uncomment after placing your favicon in /public//如果有收藏图片 就可以放开注释
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//记录访问日志的
var fs=require('fs');
var ws=fs.createWriteStream('./access.log',{flags:'a'});
app.use(logger('tiny',{stream:ws}));//dev是一种日志格式

app.use(bodyParser.json());//处理json请求体的
app.use(bodyParser.urlencoded({ extended: true }));//处理表单序列化，或者urlencoded请求体
app.use(cookieParser());//处理cookie
//使用会话中间件 会出现req.session
app.use(session({
  secret:settings.secret,//指定加密的秘钥
  saveUninitialized:true,
  resave:true,//每次请求结束之后都重新保存session
  store:new MongoStore({
    url:settings.url
  })
}));
app.use(flash());
app.use(function(req,res,next){
  res.locals.keyword='';
  res.locals.user=req.session.user;
  res.locals.success=req.flash('success').toString();
  res.locals.error=req.flash('error').toString();
  next();
});
app.use(express.static(path.join(__dirname, 'public')));//获取静态资源
app.use('/', routes);//访问/时，index模块
app.use('/user', user);//访问/user时，去user模块
app.use('/article',article);//指定文章路由 访问/article 或/article/xxx 使用article路由
// catch 404 and forward to error handler
app.use(function(req, res, next) {//为何能捕获404错误
  var err = new Error('Not Found');//构建一个err对象
  err.status = 404;//设置相应码
  res.render('404',{});
  //next(err);
});
console.log('env',app.get('env'));
// error handlers
//开发错误处理将要打印堆栈信息
//env是通过express读取环境变量中的node_env变量来设置到app中去的
// development error handler
// will print stacktrace 捕获404错误
var errorLog=fs.createWriteStream('./error.log',{flags:'a'});
//如果是开发环境 env===development
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {//use 可以有next参数 而get没有
  // 通过中间件函数的参数数量来判断什么是错误处理中间件,如果有4个参数就是错误处理中间件
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// production error handler
//生产环境 线上正式环境错误处理
//不能像用户暴露堆栈信息
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  //errorLog.write(err,)
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;
//返回express实例app 给www 充当http.createserver里的回调函数，当特定的端口有请求时，就会执行这个app函数；

