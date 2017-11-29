// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App'
//import App from './Index';
import router from './router';
import axios from 'axios';
import jsonp from 'jsonp';
import './common.css';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$jsonp = jsonp;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
