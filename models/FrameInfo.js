var mongoose = require('mongoose');

const FrameInfo = new mongoose.Schema({
    au_intensity : [Number],
    au_activation : [Number],
    gaze_direction : [Number]
})

module.exports = mongoose.model('FrameInfo',FrameInfoSchema);