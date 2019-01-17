<template>
  <div>
    <video width="400" height="300" ref="video"/>
  </div>
</template>

<script>
import MSHelper from '../classes/MSHelper';

export default {
  data: function() {
    return {
      video : null
    };
  },
  components: {
    
  },
  mounted(){

    MSHelper.getMediaDevice()
    .then(stream=>{
      this.$refs.video.srcObject = stream;
      this.$refs.video.autoplay = true;
    })
    .catch(err=>console.log(err));

    this.video = this.$refs.video;
  }
};
</script>


<style>
</style>
