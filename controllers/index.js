'use strict';

//var businessLayer = require('./common/logic');

module.exports = function (router) {
    router.get('/', function (req, res) {        
        res.render( 'common/index',{
        });        
    });
    //router.post('/users/authenticate/',function(req,res){        
    //        businessLayer.createNewUser(req.body,function(err, user){
    //            if (err) {
    //                res.statusCode = 400;
    //                res.send({
    //                    'message':err,
    //                    'name':'Error'
    //                });
    //            }
    //            else{
    //                res.send({
    //                    'details':user,
    //                    'name':'OK'
    //                });
    //            }
    //        });
    //   
    //});
};
