var express = require("express");
var router = express.Router();
var Tuning = require("../models/Tuning");
var mongoose = require("mongoose");

/*PUT A TUNING VARIABLE*/
router.post('/tuning', (req, res, next)=>{
    let expression = req.body;
    res.send(expression);
});