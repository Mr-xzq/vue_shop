import Vue from 'vue'
import App from './App.vue'
// 导入我们写的路由规则(路由实例对象)
import router from './router/router'
// 导入elementUI插件相关资源
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 设置baseURL,将所有接口公共部分抽取出来
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 在将axios挂载到vue原型之前添加下面的代码
axios.interceptors.request.use(config => {
  // 在请求发送到接口发出去之前, 先拦截下来进行处理, 我们这里在发送的axios封装过的request请求头上添加
  // Authorization属性, 值为登录成功之后服务器回复过来的token
  // 这里是为了权限控制访问接口
  // 权限控制访问接口, 和导航守卫有些类似
  // 因此访问哪些需要权限的接口的时候, 服务器会验证request中的请求头上是否有Authorization：token,如果为空
  // 那么就不能 访问
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 将导入的axios放在Vue的原型上面，这样 Vue的实例就都可以通过this.$axios来
Vue.prototype.$axios = axios

Vue.config.productionTip = false

// 创建Vue实例,将所需要的组件或者属性挂载在这个实例上,这个main.js是整个vue项目的入口
new Vue({
  router,
  render: h => h(App)

  // 这里的$mount('#app')和el: '#app'类似,都是将<div id = 'app'>挂载到这个实例对象上
}).$mount('#app')
