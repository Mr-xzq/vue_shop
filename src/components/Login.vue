<template>
  <div class="login_container">
    <!-- 登录盒子  -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="用户头像" />
      </div>
      <!-- 登录表单 -->
      <!-- 被ref修饰的标签会被放入vue实例对象的$ref属性中,这样就方便我们获取对应的表单之类的元素 -->
      <el-form
        :model="loginForm"
        ref="LoginFormRef"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 双向绑定表单信息
      loginForm: {
        username: '',
        password: ''
      },
      // 指定输入框校验规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // 被ref修饰的标签会被放入vue实例对象的$ref属性中,这样就方便我们获取对应的表单之类的元素
      this.$refs.LoginFormRef.resetFields()
    },
    login () {
      this.$refs.LoginFormRef.validate(async valid => {
        // 当结果为true才说明校验没有错误
        if (valid) {
          // console.log(this.loginForm.username + '-----' + this.loginForm.password)
          // 有await的地方,他的外面必须配合async的函数,实现异步回调的效果
          // 解构赋值,去对象中找到属性名相同的,直接
          const { data: res } = await this.$axios.post('login', this.loginForm)
          if (res.meta.status !== 200) {
            this.$message.error('登录失败')
            this.loginForm.password = ''
            // console.log('登录失败')
          } else {
            this.$message.success('登录成功')

            // 如果我们登录成功,服务器像我们发送的数据中就会有token这个key
            // 以后我们再发送请求时,只要包含这个字段且value对应的上,那么就无须在输入账号密码
            // token存储在本地的sessionStorage中
            let token = res.data.token
            window.sessionStorage.setItem('token', token)
            // 编程式路由
            this.$router.push('/home')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b5b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
