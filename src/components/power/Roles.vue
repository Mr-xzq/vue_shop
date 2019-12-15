<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 添加按钮，设置大小，应用到布局 -->
      <el-row>
        <el-col :span="6">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="roleList" stripe border>
        <el-table-column header-align="center" align="center" type="expand">
          <template slot-scope="slotProps">
            <el-row
              v-for="(item1,index1) in slotProps.row.children"
              :key="item1.id"
              :class="['bd-bottom', index1 == 0 ? 'bd-top' : '','v-center']"
            >
              <el-col :span="8">
                <el-tag type="success" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right" size=" medium"></i>
              </el-col>
              <el-col :span="16">
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 == 0 ? '' : 'bd-top','v-center']"
                >
                  <el-col :span="12">
                    <el-tag type="warning" size=" medium" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="12">
                    <el-row
                      v-for="(item3,index3) in item2.children"
                      :key="item3.id"
                      :class="[index3 == 0 ? '' : 'bd-top']"
                    >
                      <el-col>
                        <el-tag
                          type="danger"
                          closable
                          size=" medium"
                          @close="deleteRight(slotProps.row,item3.id)"
                        >{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{slotProps.row}}</pre> -->
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" type="index" label="序号" width="100%"></el-table-column>
        <el-table-column header-align="center" align="center" prop="id" label="id"></el-table-column>
        <el-table-column header-align="center" align="center" prop="roleName" label="角色名称"></el-table-column>
        <el-table-column header-align="center" align="center" prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限树形权限图 -->
    <el-dialog title="提示" :visible.sync="editRoleVisible" width="50%" @close="clearDefaultTree">
      <!-- 需要获得一个嵌套的对象的数据源，也就是树形的数据源，然后需要提供一个 props 来表示和子集树的嵌套规则 -->
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultTree"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getRoleList()
  },
  data () {
    return {
      roleList: [],
      editRoleVisible: false,
      rightsList: [],
      treeProps: {
        //  通过label设置树形节点文本展示authName
        label: 'authName',
        //  设置通过children属性展示子节点信息
        children: 'children'
      },
      /* 树形结构默认展示的图 */
      defaultTree: [],
      roleId: ''
    }
  },
  methods: {
    async getRoleList () {
      const {
        data: { data },
        data: {
          meta: { status }
        }
      } = await this.$axios.get('roles')
      if (status !== 200) {
        this.$message.error('获取数据失败')
      } else {
        this.roleList = data
      }
    },
    async deleteRight (row, id) {
      // console.log(row.id)
      // console.log(id)
      let confirmResult = await this.$confirm(
        '请问是否要删除该权限',
        '删除提示',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult === 'confirm') {
        const {
          data: { data },
          data: {
            meta: { status }
          }
        } = await this.$axios.delete(`roles/${row.id}/rights/${id}`)

        if (status !== 200) {
          this.$message.error('删除失败')
        } else {
          // 不要直接用this.getRoleList,不然会刷新整个页面
          // 直接将删除成功之后的数据交给当前行中的数据的children即可
          // 这个children就是当前角色有的权限
          row.children = data
          this.$message.success('删除成功')
        }
      }
    },
    async showSetRightDialog (row) {
      this.editRoleVisible = true
      // 获取所有权限的数据
      const { data: res } = await this.$axios.get('rights/tree')
      // 如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限树失败')
      }
      this.getLeafKeys(row, this.defaultTree)
      // console.log(this.defaultTree)
      // 如果返回状态正常，将请求的数据保存在data中
      this.rightsList = res.data
      // console.log(this.rightsList)
      /* 获取到角色id并存入data中，方便后面使用 */
      this.roleId = row.id
    },
    getLeafKeys (node, arr) {
      // 该函数会获取到当前角色的所有三级权限id并添加到defKeys中
      // 如果当前节点不包含children属性，则表示node为三级权限
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归调用
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    /* 当关闭分配权限树形图的时候应该清除默认树形结构选中项数组中存储的id */
    clearDefaultTree () {
      this.defaultTree = []
      // console.log(this.defaultTree)
    },
    async addRights () {
      const keys = [
        this.$refs.treeRef.getCurrentKey(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keyStr = keys.join(',')
      // 发送请求完成更新
      const { data: res } = await this.$axios.post(
        `roles/${this.roleId}/rights`,
        { rids: keyStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.editRoleVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.v-center {
  display: flex;
  align-items: center;
}
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 5px;
}
</style>
