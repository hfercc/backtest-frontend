import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Reports from '@/components/Reports'
import Register from '@/components/Register'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
        path: '/reports',
        name: 'Reports',
        component: Reports
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    }
  ]
})
