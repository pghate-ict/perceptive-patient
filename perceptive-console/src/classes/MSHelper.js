import OFAPI from '../services/OFAPI';
import RecordRTC from 'recordrtc';

let instance = null;

class MSHelper {
  constructor () {
    if (!instance) {
      
    
      this.trimUrlMetaData = this.trimUrlMetaData.bind(this);
      this.getFrameData = this.getFrameData.bind(this);
      this.takePicture = this.takePicture.bind(this);
      this.hasGetUserMedia = this.hasGetUserMedia.bind(this);
      this.startRecorder = this.startRecorder.bind(this);
      this.stopRecorder = this.stopRecorder.bind(this);
      this.enabled = false;

      //html video element to insert video
      this.video = document.createElement('video');
      this.video.width = 400;
      this.video.height = 300;

      //canvas element to capture screenshots
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.video.width;
      this.canvas.height = this.video.height;

      this.dateStarted = null;

      

      this.stream = null;

      //Record RTC Video Recorder -> https://www.npmjs.com/package/recordrtc
      this.recorder = null;
      this.recorderConfiguration = {
          type : 'video',
          mimeType : 'video/mp4',
          recorderType : RecordRTC.MediaStreamRecorder,
          frameRate : 24
      }

      if (this.hasGetUserMedia()) {
        this.mediaDevice = navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          })
          .then(stream => {
            this.video.srcObject = stream;
            this.video.play();
            this.recorder = new RecordRTC.RecordRTCPromisesHandler(stream, this.recorderConfiguration);
            //this.recorder = new RecordRTC(stream, this.recorderConfiguration);
            return stream;
          })
          .catch(err => console.log(err));
      }
      this.routineHolder = null;
      instance = this;
    } else {
      return instance;
    }
  }

  takePicture() {
    let ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0, /*this.video.width*/ 800, /*this.video.height*/ 600);
    let url = this.canvas.toDataURL('image/jpeg', 1);
    let base64 = this.trimUrlMetaData(url);
    return base64;
  }

  /*Extracting the Base64 string from the URL & Return*/
  trimUrlMetaData(url) {
    let urlString = url.toString();
    let base64string = urlString.match(/\/9j\/.*/);
    return base64string.toString();
  }


  /*Calling the Openface API*/
  async getFrameData(base64_string) {
    let res = await OFAPI.OpenFace.getFrameData(base64_string);
    return res;
  }

  hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  getVideoElement() {
    return this.video;
  }

  getStream() {
    return this.stream;
  }

  getMediaDevice() {
    return this.mediaDevice;
  }

  //Functions to start and stop recording to capture mp4 and store video file in database eventually.
  startRecorder(){
    this.recorder.startRecording();
    this.dateStarted = new Date();
  }

  getCurrentRecorderTimestamp(){
    var info = (new Date().getTime() - this.dateStarted.getTime())/1000;
    return info;
  }

  async stopRecorder(){
    await this.recorder.stopRecording();
    let blob = await this.recorder.getBlob();
    return blob;
  }

  /* https://recordrtc.org/RecordRTC.html <-- Read the comments */
  getInfo(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = "0" + min;
    }

    if (sec < 10) {
        sec = "0" + sec;
    }

    return {
        hours: hr,
        minutes: min,
        seconds: sec
    };
}

}

instance = new MSHelper();
export default instance;
