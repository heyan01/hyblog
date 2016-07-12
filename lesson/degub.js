//用来写日志 引入日志模块
var debug=require('./debug1');//根据环境变量的不同 输出不同
//常见一个日志记录器
var server=debug('server');
server('server log'); //记录器 向控制台输出字符串
var client=debug('client');
client('client log');


