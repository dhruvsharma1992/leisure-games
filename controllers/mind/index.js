var express = require('express');
var router = express.Router();
var logic = require("./logic");

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

router.get('/admin', function (req, res) {        
    res.render( 'mind/admin', {});        
});

router.post('/createuser', function(req, res) {
    logic.createUser(req.body, function(err, ret) { constructResponse(err, ret, res); });
});

router.get('/status', function(req, res) {
    logic.getGameStatus(function(err, ret) { constructResponse(err, ret, res); });
});

router.post('/playturn', function(req, res) {
    logic.playTurn(req.body.turn, req.body.player, function(err, ret) { constructResponse(err, ret, res); });
});

router.get('/start', function(req, res) {        
    logic.startGame(function(err, ret) { constructResponse(err, ret, res); });
});

router.get('/end', function(req, res) {        
    logic.endGame(function(err, ret) { constructResponse(err, ret, res); });
});

router.get('/user/:user', function(req, res) {
    console.log(req.params.user);
    logic.getUserStatus(req.params.user, function(err, ret) { constructResponse(err, ret, res); });
});

router.get('/', function (req, res) {        
    res.render( 'mind/index', {});        
});

module.exports = router;