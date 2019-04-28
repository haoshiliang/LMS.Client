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
    if (router.currentRoute.path!='/login') {
      Vue.prototype.$common.openLoading();
    }
    return config;
  },
  err => {
    Vue.prototype.$common.closeLoading();
    return Promise.reject(err);
  });

// http response 拦截器
Axios.interceptors.response.use(
  response => {
    Vue.prototype.$common.closeLoading();
    if (response && response.data) {
      if (response.data.status == '-1') {
        sessionStorage.removeItem('token');
        if(router.currentRoute.path!='/login'){
          Vue.prototype.$alert(response.data.message,'错误提示',{
            confirmButtonText: '确定',
            type: 'error',
            callback:action => {
              router.replace({
                path: 'login',
                query: {redirect: router.currentRoute.fullPath}
              });
            }
          })
        }
      }
      else if (response.data.status == "0"){
        this.$message({type:"error",message:resultData.data.message});
      }
    }
    return response;
  },
  error => {
    Vue.prototype.$common.closeLoading();
    if (error.response) {
      switch (error.response.status) {
        case 401:
          sessionStorage.removeItem('token');
          if(router.currentRoute.path!='/login'){
            Vue.prototype.$alert(response.data.message,'错误提示',{
              confirmButtonText: '确定',
              type: 'error',
              callback:action => {
                router.replace({
                  path: 'login',
                  query: {redirect: router.currentRoute.fullPath}
                });
              }
            });
          }
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

