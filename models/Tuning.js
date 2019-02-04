var mongoose = require("mongoose");

var TuningSchema = new mongoose.Schema({
    id : Number,
    expression : String,
    tunedvalues : mongoose.Schema.Types.Mixed
});

module.exports = mongoose.Model("Tuning", TuningSchema)