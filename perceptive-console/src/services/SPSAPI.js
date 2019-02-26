import axios from 'axios';

var SPSAPI_URL = 'http://localhost:4000/sps'

const SPSAPI = {
  SPS: {
    getSessionId() {
      return axios.get(SPSAPI_URL + '/id');
    },

    getEvent(){
        return axios.get(SPSAPI_URL + '/event')
    }
  },
}

export default SPSAPI;
