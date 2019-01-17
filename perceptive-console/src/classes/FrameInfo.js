/* Data coming from frame, from OpenFace */

class FrameInfo{
    constructor(timestamp, au_intensity, au_presence, gaze_direction){
        this.timestamp = timestamp;
        this.au_intensity = au_intensity;
        this.au_presence = au_presence;
        this.gaze_direction = gaze_direction;
    }
}

export default FrameInfo;