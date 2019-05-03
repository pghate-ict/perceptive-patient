<template>
  <div>
    <v-container grid-list-md>
      
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
