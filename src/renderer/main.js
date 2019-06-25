import Vue from 'vue'
import axios from 'axios'
import AntDesign from 'ant-design-vue'
import App from './App'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
import 'ant-design-vue/dist/antd.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(AntDesign);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: Object.assign({}, require('./locales/zh-CN'), require('./locales/en-US'))
})

/* eslint-disable no-new */
new Vue({
  i18n,
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')