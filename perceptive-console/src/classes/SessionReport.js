class SessionReport{
    constructor(session_id){
        this.session_id = session_id;
        this.timeline = [];
    }

    addTimelineRow(timelineRow){
        if(timelineRow instanceof TimelineRow){
            this.timeline.push(timelineRow);
        }
    }

}

export default SessionReport;