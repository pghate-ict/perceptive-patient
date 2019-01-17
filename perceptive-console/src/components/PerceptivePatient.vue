<template>
  <v-app>
    <v-toolbar dark color="primary" app>
      <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title>Perceptive Patient Console</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="font-weight-bold">
      <v-btn flat to="/" class="text-capitalize subheading">Console</v-btn>
      <v-btn flat to="/VariableEditor" class="text-capitalize subheading">Variable Editor</v-btn>
      <v-btn flat to="/Tuning" class="text-capitalize subheading">Tuning Console</v-btn>
    </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>


export default {
    mounted(){
        
    }
}
</script>


<style>

</style>
