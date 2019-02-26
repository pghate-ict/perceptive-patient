var express = require('express');
var router = express.Router();
var SPSHelper = require("../helpers/SPSHelper.js");

/* Get running Session ID from SPS */

router.get('/id', function(req, res, next){
   SPSHelper.SPSAPI.getRunningSessionId()
    .then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        return next(err);
    })
});

router.get('/event', function(req, res, next){
    let event = SPSHelper.SPSAPI.dequeueEvent();
    res.json(event);
});

module.exports = router;