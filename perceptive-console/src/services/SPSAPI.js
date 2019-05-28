import axios from 'axios';

var SPSAPI_URL = 'http://localhost:4000/sps'
var SPSAPI_ORIGINAL_URL = 'http://dev1.scp.standardpatient.org/scpatient/api/interaction/session/mine'

const SPSAPI = {
  SPS: {
    getSessionId() {
      return axios.get(SPSAPI_URL + '/id');
    },

    getEvent(){
        return axios.get(SPSAPI_URL + '/event')
    },
    
    getSessionIdRaw(){
      return axios.get(SPSAPI_ORIGINAL_URL);
    }
  },
}

export default SPSAPI;
