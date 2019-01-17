<template>
  <div>
    <v-layout row align-center>
      <v-flex md-12 class="text-xs-center">
        <v-btn @click="getConfigurations(), configuration_dialog = true" large class="text-capitalize" color="primary">Choose Configuration</v-btn>
        <!-- Modal for selecting configurations-->
        <v-dialog v-model="configuration_dialog">
          <v-card>
          <v-card-title class="text-center">
            Choose Configuration
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details>
            </v-text-field>
          </v-card-title>
          <v-data-table  
            :headers="config_table_headers" 
            :items="configurations_list" 
            :search="search"
            item-key="name">
            <template slot="items" slot-scope="props">
              <tr @click="getVariablesForConfiguration(props.item._id), configuration_dialog=false">
                <td>{{props.item.name}}</td>
                <td>{{props.item.phaseType}}</td>
                <td>{{props.item.phaseDuration}}</td>
                <td>{{props.item.variables.length}}</td>
              </tr>
            </template>
           
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Your search for "{{ search }}" found no results.
            </v-alert>
          </v-data-table>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>

    <v-layout row wrap align-center>
      <v-flex md-12 class="xs-center">
      <v-data-table
        :headers="var_table_headers"
        :items="variables_list"
        item-key="name"
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{props.item.name}}</td>
            <td>{{props.item.type}}</td>
            <td>{{props.item.hidden ? 'Yes' : 'No'}}</td>
            <td></td>
            <td>
              <v-btn flat icon color="primary">
                <v-icon>edit</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template slot="footer">
          <v-btn @click="variable_dialog = true" flat icon color="primary" v-if="load_states.variables">
            <v-icon>add</v-icon>
          </v-btn>
          <VariableAddDialog :show="variable_dialog"></VariableAddDialog>
        </template>
      </v-data-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import DBAPI from "../services/DBAPI";
import Variable from "../classes/Variable";

import VariableAddDialog from "./VariableAddDialog";

export default {
  name: "VariableEditor",
  components: {
    VariableAddDialog
  },
  data() {
    return {
      /* States to check wether data has been loaded */
      load_states : {
        configurations : false,
        variables : false
      },
      configurations_list : [],
      variables_list : [],
      variable_evaluations : [],
      search : '',
      config_table_headers : [
        {
          text : "Name",
          value : "name"
        },
        {
          text : "Phase Type",
          value : "phasetype"
        },
        {
          text : "Phase Duration",
          value : "phaseduration"
        },
        {
          text : "Variables",
          value : "variables"
        }
      ],

      var_table_headers : [
        {
          text : "Name",
          value : "name"
        },
        {
          text : "Type",
          value : "type"
        },
        {
          text : "Hidden",
          value : "hidden"
        },
        {
          text : "Evaluation",
          value : "eval"
        },
        {
          value : "edit"
        }
      ],

      configuration_dialog: false,
      variable_dialog : false
    };
  },
  methods : {
    getConfigurations(){
      DBAPI.Configurations.getAll.then((res)=>{
        this.configurations_list = res.data;
      })  
    },

    getVariablesForConfiguration(configuration_id){
      
      //Inject Configuration Variables from DB to Vue
      DBAPI.Variables.getVariablesFromConfig(configuration_id).then((res)=>{
        this.variables_list = res.data;
      })

      this.load_states.variables = true;

    },

    getEvaluation(id, type){
      var vtype;
      var evalString = "";

      switch(type){
        case "INPUT":
          var vtype = Variable.VariableTypes.INPUT_VARIABLE;
        break;

        case "AVG":
          var vtype = Variable.VariableTypes.AVERAGE_VARIABLE;
        break;
      }

      DBAPI.Variables.getValues(id).then(res=>{
          evalString += Variable.evaluate(vtype, res.data);

      }).catch((err)=>{
        console.log(err);
      })

      console.log(evalString);
    }
  }
};
</script>

<style scoped>
</style>
