class TimelineRow {
  constructor() {
    this.authority = null;
    this.likeability = null;
    this.compassion = null;

    /*
    Turn contains a triple of user question, patient response and patient reaction. Since it would be bad practice
    to have encoded images, this will contain timestamps of the events happening in the recorded video.
    */
    this.turn = [];

    /*
    Transcript of the event cycle
    */
    this.user_request = null;
    this.patient_response = null;
    this.user_response = null;

    /* Assessments */
    this.user_request_assessment = null;
    this.patient_response_assessment = null;

    /* Unlocked Tokens */
    this.user_unlocked_tokens = null;

    /* User Perception */
    this.user_perception = null;
  }
}




export default TimelineRow;