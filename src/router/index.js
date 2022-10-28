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
    component: () => import('@/views/MapPage')
  },
  {
    path: '/sellerpage',
    name: 'SellerPage',
    component: () => import('@/views/SellerPage')
  },
  {
    path: '/trendpage',
    name: 'TrendPage',
    component: () => import('@/views/TrendPage')
  },
  {
    path: '/mappage',
    name: 'MapPage',
    component: () => import('@/views/MapPage')
  }
]

const router = new VueRouter({
  routes
})

export default router
