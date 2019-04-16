import axios from 'axios';

var SPSAPI_URL = 'http://localhost:4000/sps'
var SPSAPI_URL_SESSION = 'http://dev1.scp.standardpatient.org/scpatient/api/interaction/session/mine'

const SPSAPI = {
  SPS: {
    getSessionId() {
      return axios.get(SPSAPI_URL + '/id');
    },

    getSessionDirect(){
      return axios.get(SPSAPI_URL_SESSION);
    },

    getEvent(){
        return axios.get(SPSAPI_URL + '/event')
    }
  },
}

export default SPSAPI;
