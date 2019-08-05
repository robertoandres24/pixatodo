import Vue from 'vue'
import App from './App'
import store from '../store'
import router from './router'
global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser
import * as localStorage from '../plugins/localStorage'
import * as emojiSource from '../plugins/emojiSource'
Vue.prototype.$emojis = emojiSource
Vue.use(localStorage)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
