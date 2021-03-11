import Vue from 'vue'
import VueRouter from 'vue-router'

//导入
import {routes} from "./router"

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

export default router
