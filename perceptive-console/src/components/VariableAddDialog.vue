<template>
    <v-dialog v-model="this.show">
        <v-card>
            <v-card-title class="text-center">
                Create Variable
                <v-spacer></v-spacer>
                <v-select :items="select_items"></v-select>
            </v-card-title>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: "VariableAddDialog",
  props: {
    show: {
      type: Boolean,
      required: true,
      validator: function(value) {
        return [true, false].indexOf(value) !== -1;
      }
    }
  },

  data: function() {
    return {
      select_items: ["Input Variable", "Average Variable", "Threshold Variable"]
    };
  }
};
</script>

<style>
</style>
