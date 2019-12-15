<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- 黑马logo -->
        <img src="../assets/heima.png" alt />
        <!-- 顶部标题 -->
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="isCollapse = !isCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <!-- active-text-color被选中的菜单的颜色 -->
        <!-- unique-opened默认值是fasle,只要选定为true,那么就会同时只能打开一个菜单 -->
        <!-- 注意：不能unique-opened = "true"这样设置的是字符串,要么直接写unique-opened = "unique-opened"
        或者 unique-opened或者 :unique-opened = true-->
        <!-- 这里的default-active表示选中的是哪一项 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activeState"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in list" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级子菜单 -->
            <!-- 这里的 :index后面配置的就是点击之后路由的指向 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveActivePath('/' + subItem.path)"
            >
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体结构 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getMenuList()
    // 初始化的时候获取我们存入sessionStorage中的activePath,以便保存页面的选中状态
    this.activeState = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      list: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activeState: ''
    }
  },
  methods: {
    logout () {
      // 当用户点击退出时,应该删除掉客户端的sessionStorage中存储的token
      window.sessionStorage.clear()
      // 回跳到Login页面
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: msg } = await this.$axios.get('menus')
      this.list = msg.data
    },
    // 初始化的时候获取我们存入sessionStorage中的activePath,以便保存页面的选中状态
    saveActivePath (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activeState = activePath
    }
  }
}
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  height: 25px;
  line-height: 25px;
  color: #fff;
  text-align: center;
  letter-spacing: 2px;
  background-color: #67c23a;
}
</style>
