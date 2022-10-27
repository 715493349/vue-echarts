/*
 * @Author: Popcorn
 * @Date: 2022-10-26 16:40:10
 * @Description: 
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import '@/assets/css/global.less'
import './assets/font/iconfont.css'

axios.defaults.baseURL = 'http://localhost:8888/api/'
Vue.prototype.$axios = axios

Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
