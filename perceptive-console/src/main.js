// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import {store} from './store/store';
import VueGoogleCharts from 'vue-google-charts';
import WebRTC from 'vue-webrtc';



Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(VueGoogleCharts);
Vue.use(WebRTC);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});