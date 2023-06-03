import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import ChargingDetail from '../views/ChargingDetail.vue'
import OrderDetails from '../views/OrderDetails.vue'
import Register from '../views/Register.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/home',
    name: '功能列表',
    component: Home,
    children:[
      {
        path: '/ChargingDetail',
        name: '充电详情',
        component: ChargingDetail
      },
      {
        path: '/OrderDetails',
        name: '订单详情',
        component: OrderDetails
      }
    ]
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
