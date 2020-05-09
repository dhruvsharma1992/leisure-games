'use strict';
var express = require('express');
var router = express.Router();

const mind = require('./mind/index');

router.get('/', function (req, res) {        
    res.render( 'common/index',{
    });        
});

router.use("/mind", mind);

module.exports = router;
