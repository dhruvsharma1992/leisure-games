var express = require('express');
var router = express.Router();
var logic = require("./logic");

router.post('/login', function(req, res) {
    logic.login(req.body, function(err, ret) { constructResponse(err, ret, res); });
});

router.get('/', function (req, res) {        
    res.render( 'shahidarbar/admin', {});        
});

module.exports = router;