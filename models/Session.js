var mongoose = require('mongoose');

var SessionSchema = new mongoose.Schema({
    name : String,
    frames : [Number],
});

module.exports = mongoose.model("Session",SessionSchema);