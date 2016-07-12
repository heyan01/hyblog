module.exports= function (name) {
    return function (msg) {
        var DEBUG=process.env.DEBUG;//获取设置的debug值 设置是在$ SET DEBUG=zhufengpeixunblog
        if(DEBUG==name){
            console.log(msg);
        }
    }
}