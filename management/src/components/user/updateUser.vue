<template>
  <div class="content">
    <el-button :size="'small'" style="margin-bottom: 30px" @click="turnBack()"
      >返回</el-button
    >
    <div style="width: 30%">
      <el-form
        :model="updateUserForm"
        label-width="100px"
        :rules="rules"
        ref="updateUserForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            type="text"
            v-model="updateUserForm.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="updateUserForm.password"
            placeholder="不填则不修改"
          ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input type="text" v-model="updateUserForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input type="text" v-model="updateUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="updateUserForm.role" disabled> </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('updateUserForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";

export default {
  data() {
    return {
      id: 0,
      userInfo: {},
      updateUserForm: {},
      rules: {
        username: [
          { required: "true", message: "请填写用户名", trigger: "blur" },
        ],
        password: [
          {
            pattern: /^.{6,15}$/,
            message: "密码长度必须为6到15位",
            trigger: "blur",
          },
        ],
        phone: [
          {
            pattern: /^1([3456789])\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    turnBack() {
      this.$router.history.go(-1);
    },
    loadData() {
      this.request
        .post("/user/getUserInfo", { id: this.id })
        .then((response) => {
          let userInfo = response.data;
          (this.userInfo = {
            username: userInfo.username,
            realName: userInfo.realName,
            phone: userInfo.phone,
          }),
            (this.updateUserForm = userInfo);
          this.updateUserForm.password = "";
        })
        .catch((error) => {
          console.error(error);
        });
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let submitForm = {};
          if (this.updateUserForm.password !== "") {
            submitForm.password = md5(this.updateUserForm.password);
          }
          if (this.updateUserForm.realName !== this.userInfo.realName) {
            submitForm.realName = this.updateUserForm.realName;
          }
          if (this.updateUserForm.phone !== this.userInfo.phone) {
            submitForm.phone = this.updateUserForm.phone;
          }
          if (Object.keys(submitForm).length === 0) {
            this.$notify({
              title: "操作成功",
              message: "没有修改的信息",
              type: "info",
            });
            this.turnBack();
            return;
          }
          submitForm.id = this.id;
          this.request
            .post("/user/updateUser", submitForm)
            .then((response, message) => {
              this.$notify({
                title: "操作成功",
                message: message,
                type: "success",
              });
              this.turnBack();
            })
            .catch((error) => {
              console.error(error);
              this.$notify({
                title: "操作失败",
                message: error,
                type: "error",
              });
            });
        }
      });
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.loadData();
  },
};
</script>

<style>
</style>