<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" width="width" label="序号"></el-table-column>
        <el-table-column prop="id" width="width" label="id"></el-table-column>
        <el-table-column prop="authName" width="width" label="管理类别"></el-table-column>
        <el-table-column prop="level" width="width" label="等级">
          <template slot-scope="slotProps">
            <el-tag type="success" v-if="slotProps.row.level == 0">等级一</el-tag>
            <el-tag type="warning" v-if="slotProps.row.level == 1">等级二</el-tag>
            <el-tag type="danger" v-if="slotProps.row.level == 2">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getRightsList()
  },
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList () {
      const {
        data: { data },
        data: {
          meta: { status }
        }
      } = await this.$axios.get('rights/list')
      if (status !== 200) {
        this.$message.error('获取信息失败')
      } else {
        this.rightsList = data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>
