<template>
  <div style="margin-top: 10rem">
    <div class="loginContain">
      <h3>请登录</h3>
      <div class="login-form">
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="loginForm"
        >
          <el-form-item label="用户名" style="width: 300px">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" style="width: 300px">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      this.request
        .post("/auth/login/password", this.loginForm)
        .then((response) => {
          let data = response.data;
          let whiteList = data.router;
          let token = data.jwtToken;
          localStorage.setItem("whiteList", whiteList);
          localStorage.setItem("token", `Bearer ${token}`);
          this.$router.push(data.redirectUrl);
        })
        .catch((error) => {
          console.log(error);
          alert("登录失败!");
        });
    },
  },
};
</script>

<style>
/* .loginDiv {
  text-align: center;
  position: relative;
}

.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  align-content: center;
  transform: translate(-50%,-50%);
} */
.loginContain {
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translate(-50%, -50%);
}
</style>