<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex md6>
        <VideoPlayer ref="player" :width="this.player.width" :height="this.player.height"></VideoPlayer>
      </v-flex>
      <v-flex md6>
        <v-layout column align-center wrap fill-height justify-space-around>
          <v-btn color="primary" large>Select Configuration</v-btn>
          <div class="display-2">Session ID: {{current_session}}</div>
          <div text-center>
            <v-btn color="primary" v-if="!ofStarted" @click="toggleOFRoutine()" large>
              <v-icon dark>play_arrow</v-icon>Start Monitoring
            </v-btn>
            <v-btn color="primary" v-if="ofStarted" @click="toggleOFRoutine()" large>
              <v-icon dark>pause</v-icon>Pause Monitoring
            </v-btn>
            <v-btn
              color="primary"
              @click="stopSession()"
              ref="stopButton"
              large
              :disabled="!stopButtonD"
            >
              <v-icon dark>stop</v-icon>Stop Session
            </v-btn>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex md6></v-flex>

      <v-flex md6></v-flex>
    </v-layout>

    <GraphContainer></GraphContainer>
  </v-container>
</template>

<script>
//Import components
import VideoPlayer from "./VideoPlayer";
import ScoreDial from "./ScoreDial";
import GraphContainer from "./GraphContainer";
import OFAPI from "../services/OFAPI";
import MSHelper from "../classes/MSHelper";
import SPSAPI from "../services/SPSAPI";
import TimelineRow from "../classes/TimelineRow";
import EventTypes from "../classes/EventTypes";

export default {
  name: "Console",
  components: {
    VideoPlayer,
    ScoreDial,
    GraphContainer
  },

  created() {
    this.getCurrentSessionId();
    this.connectSocket();
  },

  data() {
    return {
      player: {
        width: 400,
        height: 300
      },
      ofStarted: false,
      stopButtonD: false,
      current_session: null,
      current_timeline_row: new TimelineRow(),
      current_session_video_url: null,
      ms_routine : null,
      timeline_report: [] //This will be an array of generated TimelineRow objects
    };
  },

  methods: {
    /* Check for running Open Face Routine, state stored globally */
    toggleOFRoutine() {
      this.ofStarted = !this.ofStarted;
      if (!MSHelper.enabled) {
        /* Multisense Routine */
        //this.ms_routine = window.setInterval(this.multisenseRoutine, 1000)
        MSHelper.startRecorder();
        MSHelper.enabled = true;

        /* UI Changes */
        this.stopButtonD = true;
      } else {
        /* Multisense Routine */
        //clearInterval(ms_routine);
        MSHelper.enabled = false;
        MSHelper.stopRecorder().then(()=>{
          console.log("Video Recorded");
        })
        .catch(error=>{
          console.log(error)
        });
        /* UI Changes */
        this.stopButtonD = false;
      }
    },

    stopSession() {
      let k = MSHelper.stopRecorder();
      console.log(k);
      MSHelper.enabled = false;
      this.stopButtonD = true;
    },

    multisenseRoutine() {
      MSHelper.getFrameData(MSHelper.takePicture())
        .then(response => {
          this.$store.commit("ADD_FRAME", response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },

    async getCurrentSessionId() {
      try {
        let response = await SPSAPI.SPS.getSessionId();
        this.current_session = response.data;
      } catch (err) {
        console.log(err);
      }
    },

    addEventToTimeline(event) {
      event = JSON.parse(event);
      
      switch (event.eventType) {
        case EventTypes.STUDENT_ACTION:
          this.current_timeline_row.user_request = event.utterance;
          this.current_timeline_row.user_request_assessment = event.assessableItemFullName;
          break;

        case EventTypes.USER_PROGRESS:
          this.current_timeline_row.user_unlocked_tokens = event.progress.itemsUncoveredInThisTurn;
          break;

        case EventTypes.UTTERANCE_SLIP:
       
          this.current_timeline_row.patient_response = event.text;
          this.current_timeline_row.turn[1] = this.current_session_video_url + `${event.name}.${event.format}`;
          break;

        case EventTypes.CHECKLIST:

          let start = MSHelper.getCurrentRecorderTimestamp();

          //This is the timestamp from which 8 seconds from then, would be the reaction
          //of the user towards his patient
          this.current_timeline_row.turn[2] = start;
          this.timeline_report.push(this.current_timeline_row);
          this.current_timeline_row = new TimelineRow();

          break;

        case EventTypes.MESSAGING_SLIP:
          this.current_session_video_url = `${event.protocol}://${event.domain}/${event.path}/`;
          break;

        default:
          break;
      }
    },

    connectSocket() {
      this.socket = new WebSocket("ws://localhost:4040/?token=perceptive");
      this.socket.onopen = () => {
        console.log("Socket Opened on Perceptive Side!");
      };
      this.socket.onmessage = event => {
        console.log("Event Added!");
        this.addEventToTimeline(event.data);
      };
    },

    disconnectSocket() {
      this.socket.close();
      console.log("Socket Closed on Perceptive Side!");
    }
  }
};
</script>

<style scoped>
</style>
