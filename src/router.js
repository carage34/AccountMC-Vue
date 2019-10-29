import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Add from './views/Add.vue'
import Modify from './views/Modify.vue'
import Users from './views/Users.vue'
import Logout from './views/Logout.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/add',
      name: 'name',
      component: Add
    },
    {
      path: '/modify/:id',
      name: 'modify',
      component: Modify
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    }
  ]
})
