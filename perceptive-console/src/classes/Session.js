class Session{
    
    constructor(session_name, frame_infos){
        this.session_name = session_name;
        this.frame_infos = [];
        this.frame_infos = frame_infos;
    }

    addFrameInfo(frame_info){
        this.frame_infos.push(frame_info);
    }
}

export default Session;