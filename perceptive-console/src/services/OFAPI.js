import axios from 'axios';
import axiosTiming from 'axios-timing';

let OFAPI_URL = "https://sense.perceptivepatient.org/"
//let OFAPI_URL = "http://localhost:3030";
//let OFAPI_URL = "http://52.53.180.189:3030";


let OFAPI = {
    OpenFace : {
        getFrameData(base64_string){
            return axios.post(OFAPI_URL, {
                image : base64_string
            },{
                headers : {
                    'Content-Type' : 'application/json'
                }
            });
        }
    }
}

export default OFAPI;