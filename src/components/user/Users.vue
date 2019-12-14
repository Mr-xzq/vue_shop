<template>
  <div>
    <h3>用户列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          <!-- 添加用户的具体界面Dialog -->
          <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="dialogClose">
            <!-- 对话框主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <!-- 用户数据显示 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="slotProps">
            <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
              <!-- 修改 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editDefaultName(slotProps.row.username)"
              ></el-button>
            </el-tooltip>
            <!-- 编辑用户界面 -->
            <el-dialog
              title="编辑用户信息"
              :visible.sync="editVisble"
              width="50%"
              @close="editDialogClose"
            >
              <el-form
                :model="editForm"
                :rules="editFormRules"
                ref="editFormRedfs"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editVisble = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo(slotProps.row.id)">确 定</el-button>
              </span>
            </el-dialog>
            <!-- hover之后会出现文字提示 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <!-- 删除 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUerInfo(slotProps.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      /* query:查询字段  pagenum：页码  pagesize：每页展示的条数 */
      queryInfo: { query: '', pagenum: 1, pagesize: 2 },
      total: 0,
      userList: [],
      dialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editVisble: false,
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '邮箱格式不正确，请重新输入',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号码不正确，请重新输入',
            trigger: 'blur'
          }
        ]
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur', message: '格式错误' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur', message: '格式错误' }
        ]
      }
    }
  },
  methods: {
    async getUserList () {
      const { data: msg } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      // console.log(msg.data)
      // 如果返回状态为异常状态则报错并返回
      if (msg.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      // 如果返回状态正常，将请求的数据保存在data中
      this.userList = msg.data.users
      this.total = msg.data.total
    },
    /* 每页显示的条数 */
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.getUserList()
      // console.log(size)
    },
    /* 当前的页码 */
    handleCurrentChange (num) {
      this.queryInfo.pagenum = num
      this.getUserList()
      // console.log(change)
    },
    /* 用户状态的控制 */
    async userStateChanged (row) {
      // 发送请求进行状态修改
      const { data: res } = await this.$axios.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      // 如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error('修改状态失败')
      } else {
        console.log('修改成功')
      }
      this.$message.success('更新状态成功')
    },
    dialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        console.log(1)
        if (valid) {
          const {
            data: { meta: result }
          } = await this.$axios.post('users', this.addForm)
          if (result.status !== 201) {
            this.$message.error('添加失败')
            this.$refs.addFormRef.resetFields()
          } else {
            this.$message.success('添加成功')
            this.dialogVisible = false
          }
        }
      })
    },
    editDefaultName (username) {
      this.editVisble = true
      this.editForm.username = username
    },
    editUserInfo (id) {
      // console.log(id)
      this.$refs.editFormRedfs.validate(async valid => {
        if (valid) {
          const {
            data: {
              meta: { status }
            }
          } = await this.$axios.put('users/' + id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (status !== 200) {
            this.$message.error('更新失败')
            // console.log('更新失败')
          } else {
            this.$message.success('更新成功')
            // console.log('更新成功')
            this.getUserList()
          }
        }
      })
      this.editVisble = false
    },
    /* 在dialog关闭的时候直接重置表单, 通过dialog提供的事件监听close */
    editDialogClose () {
      this.$refs.editFormRedfs.resetFields()
    },
    async deleteUerInfo (id) {
      // this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功!'
      //     })
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消删除'
      //     })
      //   })
      const result = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(error => error)
      if (result === 'confirm') {
        const {
          data: {
            meta: { status }
          }
        } = await this.$axios.delete('users/' + id)
        console.log(status)
        if (status !== 200) {
          this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功')
          this.getUserList()
        }
      }
      if (result === 'cancel') {
        this.$message.info('已取消删除')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-tooltip {
  margin-left: 5px;
}
</style>
