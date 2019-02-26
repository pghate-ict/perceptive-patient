var express = require('express');
var router = express.Router();
var Configurations = require('../models/Configuration.js');

/* GET ALL CONFIGURATIONS */
router.get('/', function(req, res, next){
    Configurations.find((err, configurations)=>{
        if(err) return next(err);
        res.json(configurations);
    });
});

/* GET CONFIG BY ID */
router.get('/:configuration_id', (req, res, next)=>{
    Configurations.findById(req.params.configuration_id, (err, configurations)=>{
        if(err) return next(err);
        res.json(configurations);
    })
});




module.exports = router;