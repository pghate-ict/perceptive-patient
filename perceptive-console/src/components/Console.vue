<template>
    <v-container fluid>

        <v-layout row wrap>
            <v-flex md6>
                <VideoPlayer ref="player" :width="this.player.width" :height="this.player.height"></VideoPlayer>
            </v-flex>
            <v-flex md6>
                <v-layout column align-center wrap fill-height>
                    <!-- Open Selection Modal -->
                    <v-btn color="primary" large>Select Configuration</v-btn>
                    <!-- Session Data Form -->
                    <v-text-field label="Enter Session ID" required></v-text-field>
                    <!-- WebRTC Control -->
                    <div text-center>
                            <v-btn color="primary" @click="toggleOFRoutine()" large><v-icon dark>play_arrow</v-icon> Start Monitoring</v-btn>
                            <v-btn color="primary" large disabled><v-icon dark>stop</v-icon>Stop Monitoring</v-btn>
                    </div>
                </v-layout>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex md6>
            
            </v-flex>

            <v-flex md6>
            </v-flex>
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

let msRoutine = null;

export default {
  name: "Console",
  components: {
    VideoPlayer,
    ScoreDial,
    GraphContainer,
  },

  data() {
    return {
      player: {
        width: 400,
        height: 300
      }
    };
  },

  methods: {
    /* Check for running Open Face Routine, state stored globally */
    toggleOFRoutine() {
      if(!MSHelper.enabled){
        msRoutine = window.setInterval(this.multisenseRoutine, 1000)
        MSHelper.enabled = true;
      } else {
        clearInterval(msRoutine);
        MSHelper.enabled = false;
      }
    },

    multisenseRoutine(){
      MSHelper.getFrameData(MSHelper.takePicture()).then(response=>{
        this.$store.commit('ADD_FRAME', response.data);
      })
      .catch(error=>{
        console.log(error);
      });
    }
  }
};
</script>

<style scoped>
</style>
