<template>
  <div>
    <v-container fluid>
      <v-layout column wrap align-center>
        <v-flex md-6>
          <VideoPlayer ref="player" :width="player.width" :height="player.height"></VideoPlayer>
        </v-flex>
        <v-flex md-6>
          <div>
            <v-select
              :items="Object.keys(ExpressionTypes)"
              label="Select Expression"
              @change="onExpressionSelect"
            ></v-select>
          </div>
        </v-flex>
        <v-flex md-6>
          <v-layout row wrap align-center justify-center>
            <div v-for="(v, index) in variable_set" :key="index + 1">
              <Graph :variable="v" ref="graphs" :threshold="threshold_values[index]"/>
              <span class="headline">
                {{Number(v.value).toFixed(2)}}
                <br>
                <input
                  type="text"
                  placeholder="Enter Threshold Value"
                  @change="changeHandler($event.target.value, index)"
                >
              </span>
            </div>
          </v-layout>
        </v-flex>
        <v-flex md6 align-center justify-center>
          <v-btn
            v-if="graphs_loaded"
            color="primary"
            @click="addExpressionThresholdVariable()"
          >Add Threshold Variable</v-btn>
          <v-btn
            v-if="graphs_loaded"
            color="primary"
            @click="tune()"
            />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import VideoPlayer from "./VideoPlayer";
import { ExpressionTypes, Configuration } from "../classes/Configuration";
import Graph from "./Graph";
import {saveAs} from 'file-saver';

/* Delegate for SetInterval*/
let openfaceRoutine = null;

export default {
  name: "Tuning",
  data: function() {
    return {
      player: {
        width: 400,
        height: 300
      },
      current_expression : '',
      ExpressionTypes,
      variable_set: [],
      threshold_values: [],
      graphs_loaded: false
    };
  },
  components: {
    VideoPlayer,
    Graph
  },
  methods: {
    calibrate(type) {
      this.$store.commit("CALIBRATE", { expression: type });
    },

    changeHandler(value, index) {
      this.threshold_values[index] = Number(value);
    },

    tune(){
      //Save a json file with tuning variables
      
      
      let expression_obj = {
        expression : this.current_expression,
        values : {}
      };
      
      this.threshold_values.forEach((value, index)=>{
        expression_obj.values[this.variable_set[index].name] = value;
      });

      let exp_blob = new Blob([JSONs.stringify(expression_obj)], {type:"application/json; charset=utf-8}"});
      
      saveAs(exp_blob, "expression_" + this.current_expression + "-" + Math.floor((Math.random()*1000)).toString() + ".json");

      //console.log(expression_obj);

    },
    onExpressionSelect(exp) {
      //Reset Default Variables based on Expression from Dropdown
      this.variable_set = [];
      this.threshold_values = [];
      this.graphs_loaded = false;
      switch (exp) {
        case "HAPPY":
          this.variable_set.push(
            this.findVariable("AU06"),
            this.findVariable("AU12")
          );
          this.threshold_values.push(0, 0);
          break;

        case "ANGER":
          this.variable_set.push(
            this.findVariable("AU04"),
            this.findVariable("AU05")
          );
          this.threshold_values.push(0, 0);
          break;

        case "SAD":
          this.variable_set.push(
            this.findVariable("AU01"),
            this.findVariable("AU04"),
            this.findVariable("AU15"),
            this.findVariable("AU17")
          );
          this.threshold_values.push(0, 0, 0, 0);
          break;

        case "SURPRISE":
          this.variable_set.push(
            this.findVariable("AU01"),
            this.findVariable("AU02"),
            this.findVariable("AU05"),
            this.findVariable("AU26")
          );
          this.threshold_values.push(0, 0, 0, 0);
          break;

        case "DISGUST":
          this.variable_set.push(
            this.findVariable("AU09"),
            this.findVariable("AU10"),
            this.findVariable("AU25"),
            this.findVariable("AU26")
          );
          this.threshold_values.push(0, 0, 0, 0);
          break;

        case "DISTRESS":
          this.variable_set.push(
            this.findVariable("AU01"),
            this.findVariable("AU02"),
            this.findVariable("AU04")
          );
          this.threshold_values.push(0, 0, 0);
          break;

        case "OFFTASK":
          this.variable_set.push(
            this.findVariable("AU01"),
            this.findVariable("AU14"),
            this.findVariable("AU20")
          );
          this.threshold_values.push(0, 0, 0);
          break;

        case "THINKING":
          this.variable_set.push(this.findVariable("AU14"));
          this.threshold_values.push(0);
          break;

        case "ENGAGEMENT":
          this.variable_set.push(this.findVariable("AU02"));
          this.threshold_values.push(0);
          break;

        case "CONFUSION":
          this.variable_set.push(
            this.findVariable("AU01"),
            this.findVariable("AU02"),
            this.findVariable("AU14"),
            this.findVariable("AU17")
          );
          this.threshold_values.push(0, 0, 0, 0);
          break;

        case "FRUSTRATION":
          this.variable_set.push(
            this.findVariable("AU10"),
            this.findVariable("AU25")
          );
          this.threshold_values.push(0, 0, 0, 0);
          break;

        case "DELIGHT":
          this.variable_set.push(
            this.findVariable("AU06"),
            this.findVariable("AU10"),
            this.findVariable("AU12")
          );
          this.threshold_values.push(0, 0, 0);
        break;
      }
      this.current_expression = exp;
      this.threshold_values = new Array(this.variable_set.length).fill(0);
      this.graphs_loaded = true;
    },

    findVariable(name) {
      return this.$store.getters.defaultVariables.find(element => {
        return element.name === name;
      });
    }
  },

  beforeUpdate() {
    //console.log(this.variable_set);
    if (this.$refs.graphs && this.graphs_loaded && this.variable_set.length != 0) {
      this.$refs.graphs.forEach((element, index) => {
        if (this.variable_set[index].value > this.threshold_values[index]) {
          element.chart_options.colors[0] = "red";
        } else {
          element.chart_options.colors[0] = "blue";
        }
      });
    }
  }
};
</script>

<style>
</style>
