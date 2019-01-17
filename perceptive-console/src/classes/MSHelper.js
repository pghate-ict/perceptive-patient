import OFAPI from '../services/OFAPI';

let instance = null;

class MSHelper{
    constructor(){
        if(!instance){
            this.trimUrlMetaData = this.trimUrlMetaData.bind(this);
            this.getFrameData = this.getFrameData.bind(this);
            this.takePicture = this.takePicture.bind(this);
            this.hasGetUserMedia = this.hasGetUserMedia.bind(this);
           
            this.enabled = false;
    
            /*Canvas element to capture photos, created programatically*/
            this.canvas = document.createElement("canvas");
            this.video = document.createElement("video");
    
            this.video.width = 400;
            this.video.height = 300;
    
            this.stream = null;

            this.canvas.width = this.video.width;
            this.canvas.height = this.video.height;
    
            if(this.hasGetUserMedia()){
                this.mediaDevice = navigator.mediaDevices.getUserMedia({
                    video : true, audio : false
                })
                .then(stream => {
                    this.video.srcObject = stream;
                    this.video.play();
                    return stream;
                })
                .catch(err=>console.log(err));
            }
            this.routineHolder = null;
            instance = this;
        } else {
            return instance;
        }
    }

    takePicture(){
        let ctx = this.canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0, this.video.width, this.video.height);
        let url = this.canvas.toDataURL('image/jpeg', 0.7);
        let base64 = this.trimUrlMetaData(url);
        return base64;
    }

    /*Extracting the Base64 string from the URL & Return*/
    trimUrlMetaData(url){
        let urlString = url.toString();
        let base64string = urlString.match(/\/9j\/.*/);
        return base64string.toString();
    }


    /*Calling the Openface API*/
    async getFrameData(base64_string){
        let res = await OFAPI.OpenFace.getFrameData(base64_string);
        return res;
    }

    hasGetUserMedia(){
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    getVideoElement(){
        return this.video;
    }

    getStream(){
        return this.stream;
    }

    getMediaDevice(){
        return this.mediaDevice;
    }
}

instance = new MSHelper();
export default instance;