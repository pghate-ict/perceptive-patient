var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var VariableSchema = new mongoose.Schema({
    name : String,
    type : String,
    hidden : Boolean,
    value : Number,
    values : [Schema.Types.ObjectId],
    operator : String,
    source : String,
    ttype : String,
    stype : String
});

module.exports = mongoose.model('Variable', VariableSchema);