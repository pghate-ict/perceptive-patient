var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfiguratonSchema = new mongoose.Schema({
    name : String,
    phaseType : String,
    phaseDuration : Number,
    variables : [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Configuration', ConfiguratonSchema);