import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Aside, Header, Menu, Submenu, MenuItem, Main } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Main)
Vue.use(Container)

// 将Messege在Vue的原型上进行注册
Vue.prototype.$messege = Message
