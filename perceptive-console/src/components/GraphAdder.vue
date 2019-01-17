<template>
    <div>
        <v-layout row wrap>
            <v-flex md12 sm12 lg12>
                <v-btn color="primary" @click="choosing_graph = !choosing_graph" large>Add Graph</v-btn>
                <v-dialog v-model="choosing_graph">
                    <v-card>
                        <v-card-title headline>
                            Choose Variable
                        </v-card-title>
                        <v-data-table 
                        :headers="table_meta_data.headings" 
                        :items="vitems" 
                        :item-key="vitems.name">
                            <template slot="items" slot-scope="props">
                                <tr @click="addGraph(props.item)">
                                    <td>{{props.item.name}}</td>
                                    <td>{{props.item.type}}</td>
                                    <td>{{props.item.hidden ? 'Yes' : 'No'}}</td>
                                </tr>
                            </template>

                        </v-data-table>
                    </v-card>
                </v-dialog>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <template v-for="graph in graphs">
                <Graph :key="graph.id" :variable="graph.variable"/>
            </template>
        </v-layout>
    </div>    
</template>

<script>
import Graph from './Graph';

export default {
  components: {
    Graph
  },
  data: function() {
    return {
      table_meta_data: {
        headings: [
          {
            text: "Name",
            value: "name"
          },
          {
            text: "Type",
            value: "type"
          },
          {
            text: "Hidden",
            value: "hidden"
          }
        ]
      },
      graphs : [],
      choosing_graph: false
    };
  },
  computed: {
    vitems: function() {
      return this.$store.getters.variables;
    }
  },
  methods : {
      addGraph : function(v){
          this.graphs.push({
              id : this.graphs.length + 1,
              variable : v
          })
      }
  }
};
</script>

<style>
</style>
