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
import SPSProxyHelper from "../classes/SPSProxyHelper.js";

export default {
  name: "Console",
  components: {
    VideoPlayer,
    ScoreDial,
    GraphContainer
  },

  data() {
    return {
      player: {
        width: 400,
        height: 300
      },
      ofStarted: false,
      stopButtonD: false,
      eventProxy : new SPSProxyHelper(),
      current_session : null
    };
  },

  methods: {
    /* Check for running Open Face Routine, state stored globally */
    toggleOFRoutine() {
      this.ofStarted = !this.ofStarted;
      if (!MSHelper.enabled) {
        // msRoutine = window.setInterval(this.multisenseRoutine, 1000)
        MSHelper.enabled = true;
        this.stopButtonD = true;
        MSHelper.startRecorder();
        this.getCurrentSessionId();
      } else {
        // clearInterval(msRoutine);
        MSHelper.enabled = false;
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

    async getCurrentSessionId(){
      let response = await SPSAPI.SPS.getRunningSessionID(); 
      this.current_session = response.data;
    },

  }
};
</script>

<style scoped>
</style>
