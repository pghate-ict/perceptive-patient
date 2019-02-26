import Vue from 'vue';
import Vuex from 'vuex';
import {
  Configuration,
  ExpressionTypes
} from '../classes/Configuration';
import Session from '../classes/Session';
import User from '../classes/User';
import FrameInfo from '../classes/FrameInfo';
import TimelineRow from '../classes/TimelineRow';
import {
  debug
} from 'util';

Vue.use(Vuex);


export const store = new Vuex.Store({
  state: {
    /* Current User, Session and Configuration Object */
    user: new User("TEST_USER"),
    session: new Session(),
    configuration: new Configuration(),
    frames: [],
    events : [] //SPS Events
  },

  getters: {
    user: state => state.user,
    session: state => state.session,
    configuration: state => state.configuration,
    frames: state => state.frames,
    latest_frame: state => state.frames[state.frames.length - 1],
    variables: state => state.configuration.variables,
    defaultVariables: state => state.configuration.defaultVariables

  },

  mutations: {

    ADD_EVENT: (state, payload) => {
      if(payload){
        state.events.push(payload);
      }
    },

    ADD_FRAME: (state, payload) => {
      if (state.frames.length >= 2 * 30) {
        state.frames.shift();
      }

      //Check Payload Null
      if (payload.au_intensity != null && payload.au_presence != null) {
        let fi = new FrameInfo();
        fi.au_intensity = payload.au_intensity;
        fi.au_presence = payload.au_presence;
        fi.gaze_direction = payload.gaze_direction;
        state.frames.push(fi);
      } else {

        if (state.frames.length > 0) {
          //just repeat the previous frame
          state.frames.push(state.frames[state.frames.length - 1]);
        }
      }

      if (payload.au_intensity != null) {
        for (let i = 0; i < Object.keys(payload.au_intensity).length; i++) {
          let val = Object.values(payload.au_intensity)[i];
          state.configuration.defaultVariables[i].value = val;
        }
      } else {
        for (let i = 0; i < state.configuration.defaultVariables.length; i++) {
          state.configuration.defaultVariables[i].value == 0;
        }
      }

    },

    CALIBRATE: (state, payload) => {
      state.configuration.calibrate(state.frames[state.frames.length - 1], payload.expression);
    },

    UPDATE_CONFIGURATION: (state, payload) => {
      state.configuration = payload.configuration;
    },

    UPDATE_SESSION: (state, payload) => {
      state.session = payload.session;
    },

    UPDATE_USER: (state, payload) => {
      state.user = payload.user;
    }
  }
});
