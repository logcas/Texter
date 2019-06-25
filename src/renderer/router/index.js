import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'editor',
      component: require('@/components/Editor/Editor').default
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/setting',
      name: 'setting',
      component: require('@/components/Setting/Setting').default
    },
    {
      path: '/plugin',
      name: 'plugin',
      component: require('@/components/PluginCenter/PluginCenter').default
    }
  ]
})
