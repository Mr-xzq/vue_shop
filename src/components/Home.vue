<template>
  <div>
    this is home
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout () {
      // 当用户点击退出时,应该删除掉客户端的sessionStorage中存储的token
      window.sessionStorage.clear()
      // 回跳到Login页面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang='less' scoped>
</style>
