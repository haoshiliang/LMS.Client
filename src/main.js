// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
// import ElementUI from 'element-ui';
// import axios from 'axios'



import App from './App'
import router from './router'

import 'babel-polyfill'
import util from './common/util'
import Vuex from 'vuex'
import store from './store'
import Axios from "axios";
import qs from "qs";

window.moment=require('moment')


Vue.prototype.$ajax=axios
Vue.config.productionTip = false

Vue.use(util);
Vue.use(Vuex);

// http request 拦截器
Axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
Axios.interceptors.response.use(
  response => {
    if (response && response.data) {
      if (response.data.status == '-1') {
        sessionStorage.removeItem('token');
        router.replace({
          path: 'login',
          query: {redirect: router.currentRoute.fullPath}
        });
      }
    }
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          sessionStorage.removeItem('token');
          router.replace({
            path: 'login',
            query: {redirect: router.currentRoute.fullPath}
          })
      }
      if(router.currentRoute.path!='/login'){
        console.log("提示");
      }
      return Promise.reject(error);
    }
  });

process.env.MOCK && require('@/apimock')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

