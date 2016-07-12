var express = require('express');
var router = express.Router();

/* GET users listing. */
//注册 当用户访问此路径的时候返回一个空白表单
router.get('/reg', function(req, res, next) {
  res.render('user/reg',{title:'注册'})
});
//接收注册表单 接收请求体 保存到数据库
router.post('/reg', function(req, res, next) {
  //客户端 填写注册表单后 点击提交的时候，会把表单内容
  var user=req.body;//是一个对象 有username email password repassword
  if(user.password!=user.repassword){
    //console.error('');
    req.flash('error','密码和重复密码不一致')
     return res.redirect('back') //回上级
  }
  //删除不需要保存的字段
  delete user.repassword;
  user.password=md5(user.password);//加密密码
  user.avatar = "https://secure.gravatar.com/avatar/"
      +md5(user.email)+"?s=48"; //在user对象里 添加了属性 头像
console.log(user);
  Model('User').create(user, function (err, doc) {//index里的
    if(err){
      req.flash('error','注册用户失败')
      return res.redirect('back')
    }else{
      //把保存之后的用户文档付给req.session 在下次请求的时候会判断是否有这个缓存
      req.flash('success','恭喜注册用户成功')  //两个参数是设置消息，一个参数是一个数组
      req.session.user=doc;
      res.redirect('/')//重定向
    }
  })
});

function md5(str){
  return require('crypto')//核心模块不用引入
      .createHash('md5') //指定算法
      .update(str)
      .digest('hex')
}
router.get('/login', function(req, res, next) {
  res.render('user/login',{title:'登录'})
});
router.post('/login', function (req,res) {
  var user=req.body;
  user.password=md5(user.password);
  console.log(user);
/*  Model('User').findOne({}, function (err,doc) {
    console.log(doc);
  })//{ uesrname: '1', password: 'c4ca4238a0b923820dcc509a6f75849b' }*/
  Model('User').findOne(user, function (err,doc) {
    console.log(doc);
    if(err){
      req.flash('error','登录失败')
    }else{
      if(doc){
        req.flash('success','登录成功');
        req.session.user=doc;
        res.redirect('/')
      }else{
        req.flash('error','登录失败');
        res.redirect('back')
      }

    }
  })
});
router.get('/logout', function(req, res, next) {
  req.session.user=null;//把session中的对象清空就表示退出登录
  res.redirect('/user/login')//重定向到登录也
 // res.send('退出');
});

module.exports = router;




