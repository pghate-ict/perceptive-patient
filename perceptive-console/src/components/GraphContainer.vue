<template>
    <div>
        <v-layout row wrap>
            <v-flex lg12 md12>
                <GChart type="ColumnChart" :data="getAUDataComplete" :options="options"/>
                <GraphAdder/>
            </v-flex>
            
        </v-layout>
    </div>
</template>

<script>
import GraphAdder from "./GraphAdder";
export default {
  name: "GraphContainer",
  components: {
    GraphAdder
  },

  methods: {

    
  },
  computed: {
      getAUDataComplete() {

          let latest_frame = this.$store.getters.latest_frame;
          let latest_au_values = [];
          if(latest_frame != null || latest_frame != undefined){
              latest_au_values = latest_frame.au_intensity;
          }
          let threshold_data = Object.keys(latest_au_values).map(item=>{
            return [item.toString(), latest_au_values[item]];
          })
          threshold_data.unshift(["Action Units", "Intensities"]);
          return threshold_data;
        }
  },
  data() {
    return {
      options: {
        title: "Action Unit",
        height: 400,
        is3D: true,
        backgroundColor: {
          fill: "transparent"
        }
      }
    };
  }
};
</script>

<style scoped>
</style>
