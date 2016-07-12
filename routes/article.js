var express= require('express');
var async = require('async');
var router=express.Router();//路由工厂 生成路由实例

router.get('/list', function (req,res) {
    var keyword=req.query.keyword;
    var pageNum=req.query.pageNum?Number(req.query.pageNum):1;//当前页码 默认值为第一页
    var pageSize=req.query.pageSize?Number(req.query.pageSize):2;
    var query={};
    if(keyword){
        query.title=new RegExp(keyword);
    }
    //populate可以传一个属性进去
    //负责把一个属性从对象ID类型转成一个文档对象
    //用来统计每页的条数
    Model('Article').find(query).count(function(err,count){
        Model('Article').find(query).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,docs){
            res.render('article/list', {
                title: '文章列表',
                articles:docs,//当前页的记录
                pageNum:pageNum,//当前页码
                pageSize:pageSize,//每页条数
                keyword:keyword,//关键字
                totalPage:Math.ceil(count/pageSize)//一共多少页
            });
        });
    });
});
router.get('/add', function (req,res) {
    res.render('article/add',{title:'发表文章',article:{}});
});
router.post('/add', function (req,res) {
    var article=req.body;//请求体里带着input里的内容
    var _id=article._id;
    if(_id){//已经有id就是修改
        Model('Article').update({_id:_id},{
            $set:{
                title:article.title,
                content:article.content
            }
        },function (err,doc) {
            if(err){
                req.flash('error','更新失败');
                return res.redact('back')
            }else{
                req.flash('success','更新成功');
                return res.redirect('/article/detail/'+_id)
            }
        })
    }else{//没有id 就是新增加文章；
        article.user=req.session.user._id;//把当前登录的用户id给user
        Model('Article').create(article, function (err,doc) {
            if(err){
                req.flash('error','发表文章失败');
                return res.redirect('back')
            }else{
                req.flash('success','发表文章成功');
                return res.redirect('/')
            }
        })
    }

});

//路径参数 把参数放在路径里
router.get('/detail/:_id', function (req,res) {
    var  _id=req.params._id;
    async.parallel([function (cb) {//两个并行的函数
       /* Model('Article').find({pv:0}),function(err,doc){
            console.log(dov);
        }*/
        Model('Article').update({_id:_id},{$inc:{pv:1}},function (err,result) {
            cb()
        })

    },
        function (cb) {
            Model('Article').findById(_id, function (err,doc) {
                cb(err,doc)
            })
        }
    ], function (err,result) {
        if(err){
            req.flash('error','查看详情失败');
            res.redirect('back');
        }else{
            req.flash('success','查看详情成功');
            //渲染详情页的模板
            res.render('article/detail',{title:'文章详情',article:result[1]});
        }
    })

});
router.get('/delete/:_id', function (req,res) {
    var _id=req.params._id;
    Model('Article').remove({_id:_id}, function (err,result) {//获取到article模型，然后移除掉这个id的文章
        if(err){
            req.flash('error','删除成功');
            return res.redirect('back')
        }else{
            req.flash('success','删除成功');
            return res.redirect('/')
        }
    })
});
router.get('/update/:_id', function (req,res) {
    var _id=req.params._id;
    Model('Article').findById(_id,function(err,doc){
        if(err){
            req.flash('error','更新出错');
            return res.redirect('back')
        }else{
            res.render('article/add',{
                title:'更新文章',
                article:doc
            })//去add模板渲染
        }
    })

});

module.exports=router;
//返回的是一个路由，他会判断所有和文章有关系的接口，访问某一个应该执行啥动作


