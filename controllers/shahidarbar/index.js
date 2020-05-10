var express = require('express');
var router = express.Router();
var logic = require("./logic");
const admin = require('./admin');

constructResponse = function(err, ret, res) {
    if (err) {
        res.statusCode = 400;
        res.send({
            'message': err,
        });
    }
    else {
        res.statusCode = 200;
        res.send({
            'message': ret,
        });
    }
};

router.use("/admin", admin);

router.get('/', function (req, res) {        
    res.render( 'shahidarbar/index', {});        
});

module.exports = router;