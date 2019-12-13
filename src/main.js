import Vue from 'vue'
import App from './App.vue'
// 导入我们写的路由规则(路由实例对象)
import router from './router/router'
// 导入elementUI插件相关资源
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入axios
import axios from 'axios'
// 设置baseURL,将所有接口公共部分抽取出来
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 将导入的axios放在Vue的原型上面，这样 Vue的实例就都可以通过this.$axios来
Vue.prototype.$axios = axios

Vue.config.productionTip = false

// 创建Vue实例,将所需要的组件或者属性挂载在这个实例上,这个main.js是整个vue项目的入口
new Vue({
  router,
  render: h => h(App)

  // 这里的$mount('#app')和el: '#app'类似,都是将<div id = 'app'>挂载到这个实例对象上
}).$mount('#app')
