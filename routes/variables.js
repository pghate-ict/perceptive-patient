var express = require('express');
var router = express.Router();
var Variable = require('../models/Variable');
var Configuration = require('../models/Configuration');
var mongoose = require("mongoose");

/*GET ALL VARIABLES*/
router.get('/',(req, res, next)=>{
    Variable.find((err, variables)=>{
        if(err) return next(err);
        res.json(variables);
    })
});


/*GET VARIABLE BY ID*/
router.get('/:variable_id', (req, res, next)=>{
    Variable.findById(req.params.variable_id, (err, variable)=>{
        if(err) return next(err);
        res.json(variable);
    });
});

/*GET VARIABLE VALUES*/
router.get('/:variable_id/values',(req,res,next)=>{
    Variable.findById(req.params.variable_id, 'values', (err, variable)=>{
        console.log(variable.values);
        if(err) return next(err);
        Variable.find({
            '_id' : {
                $in : variable.values
            }
        },'value',(err, values)=>{
            if(err) res.send(err);
            res.json(values.map(x=>x.value));
        })
    })
})


/*GET VARIABLES BELONGING TO CONFIG*/
router.get('/config/:configuration_id', (req, res, next)=>{

    Configuration.findById(req.params.configuration_id, 'variables', (err, configurations)=>{
        if(err) res.send(err);
        Variable.find({
            '_id' : {
                $in : configurations.variables
            }
        },(err, variables) => {
            if(err) res.send(err);
            res.json(variables);
        })
    });

});

module.exports = router;