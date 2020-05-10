'use strict';
var express = require('express');
var router = express.Router();

const shahidarbar = require("./shahidarbar/index");
const mind = require('./mind/index');

router.get('/', function (req, res) {        
    res.render( 'common/index',{
    });        
});

router.use("/mind", mind);

router.use("/shahidarbar", shahidarbar);

module.exports = router;
