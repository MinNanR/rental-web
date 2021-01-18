import Vue from 'vue'
import App from './App'
import request from '@/utils/request.js'
import localstorage from '@/utils/localstorage.js'

Vue.config.productionTip = false
Vue.prototype.request = request
Vue.prototype.setStorage = localstorage.setStorage
Vue.prototype.setStorageExpire = localstorage.setStorageExpire
Vue.prototype.getStorage = localstorage.getStorage

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
