var async=require('async');
async.parallel(
    function (cb) {
        setTimeout(function () {
            cb(null,'1')
        },1000)
    },
    function () {
        
    }
), function (err,result) {
    
}

