<template>
  <div>
    <v-container>
      <v-layout row>
        <v-flex md12>
          <div class="display-1">After-Action Timeline</div>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex md12>
          <!-- <TimelineRow :v-for="timeline_row in timeline" key="timeline_row.id"/> -->
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>

import TimelineRow from './TimelineRow';

export default {
  props : ['timeline'], //passing the timeline object as a prop
  components : {
    TimelineRow
  }
};
</script>

<style>
</style>
