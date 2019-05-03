<template>
  <div>
    <v-container grid-list-md>
      <TimelineRow v-for="timelineObject in timeline" :timeline="timelineObject"/>
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
