<template>
        
            <GChart ref="chart" :type="graph_type" :data="data" :options="chart_options"/>

</template>

<script>
import Variable from "../classes/Variable";
import { computeGraphData } from "../classes/GraphUtility";
export default {
  data: function() {
    return {
      chart_options: {
        title: this.variable.name,
        backgroundColor: {
          fill: "transparent"
        },
        colors : ["blue"],
        width : 500,
        height : 300
      }
    };
  },
  props: {
    variable: {
      type: Object,
      required: true,
      validator: function(value) {
        return value !== null || value !== undefined;
      }
    },
    threshold : {
      type : Number
    }
  },

  computed: {

    gcolor : function(){
      this.data.chart_options
    },

    graph_type: function() {
      let t = this.variable.type;

      switch (t) {
        /* Line Graph*/
        case Variable.VariableTypes.INPUT_VARIABLE:
          return "LineChart";
          break;

        /*Line Graph*/
        case Variable.VariableTypes.AVERAGE_VARIABLE:
          return "LineChart";
          break;

        /*Step Graph*/
        case Variable.VariableTypes.THRESHOLD_VARIABLE:
          return "SteppedAreaChart";
          break;
      }
    },

    data : function(){
        let d = [["X", "Y"]];
        let darr = computeGraphData(this.variable, this.$store.getters.frames, this.graph_type);
        return d.concat(darr);
    },
  }
};
</script>

<style>
</style>
