import Vue from 'vue'
// 导入路由相关资源
import VueRouter from 'vue-router'
// 导入Login组件，因为Login中是export default 因此可以通过直接import 别名 from 路径
// 如果是通过export {}导出，则需要通过{}导入
import Login from '@/components/Login.vue'
// 导入Home组件, 方便跳转路由
import Home from '@/components/Home.vue'
// 导入Welcome组件,跳转路由
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/Users.vue'
// 在vue上使用router
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 添加路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }

  let tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  return next()
})

export default router
