/*
 * @Author: Popcorn
 * @Date: 2022-10-26 16:40:10
 * @Description: 
 */
import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/SellerPage')
  },
  {
    path: '/sellerpage',
    name: 'SellerPage',
    component: () => import('@/views/SellerPage')
  },
  {
    path: '/trendPage',
    name: 'Trend',
    component: () => import('@/views/TrendPage')
  }
]

const router = new VueRouter({
  routes
})

export default router
