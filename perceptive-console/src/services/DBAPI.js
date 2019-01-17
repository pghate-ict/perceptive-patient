import axios from 'axios';
import { debug } from 'util';

let DBAPI_URL = "http://localhost:4000"

const DBAPI = {
    Configurations : {
        getAll : axios.get(DBAPI_URL + "/configurations")
    },
    Variables : {
        getVariablesFromConfig : (configuration_id) => {
            return axios.get(DBAPI_URL + "/variables/config/" + configuration_id);
        },

        getVariable : (variable_id) => {
            return axios.get(DBAPI_URL + "/variables/" + variable_id);
        },

        getValues : (variable_id) => {
            return axios.get(DBAPI_URL + "/variables/" + variable_id + "/values/");
        }
    }
}

export default DBAPI;