import Vue from 'vue'
import Router from 'vue-router'
import Console from '@/components/Console'
import VariableEditor from '@/components/VariableEditor'
import Tuning from '@/components/Tuning'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Console',
      component: Console
    },
    {
      path: '/VariableEditor',
      name: 'VariableEditor',
      component : VariableEditor
    },
    {
      path : '/Tuning',
      name: 'Tuning',
      component : Tuning
    }
  ]
})
