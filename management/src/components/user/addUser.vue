<template>
  <div class="content">
    <el-button :size="'small'" style="margin-bottom: 30px" @click="turnBack()"
      >返回</el-button
    >
    <div style="width: 30%">
      <el-form :model="addUserForm" label-width="100px" :rules="rules" ref="addUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input type="text" v-model="addUserForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input type="text" v-model="addUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="addUserForm.role">
            <el-option
              v-for="(item, index) in roleDropDown"
              :key="index"
              :value="item.role"
              :label="item.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('addUserForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('addUserForm')">重置</el-button>
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
      addUserForm: {
        username: "",
        password: "",
        realName: "",
        phone: "",
        role: "",
      },
      rules: {
        username: [
          { required: "true", message: "请填写用户名", trigger: "blur" },
        ],
        password: [
          { required: "true", message: "请填写密码", trigger: "blur" },
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
        role: [{ required: "true", message: "请选择角色", trigger: "blur" }],
      },
      roleDropDown: [{}],
    };
  },
  methods: {
    turnBack() {
      this.$router.history.go(-1);
    },
    getRoleDropDown() {
      this.request
        .post("/common/getRoleDropDown", {})
        .then((response) => {
          this.roleDropDown = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    restForm(formName) {
      this.$refs[formName].resetFields();
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let submitForm = {
            username: this.addUserForm.username,
            password: md5(this.addUserForm.password),
            realName: this.addUserForm.realName,
            phone: this.addUserForm.phone,
          };
          this.request
            .post(`user/addUser/${this.addUserForm.role}`, submitForm)
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
    this.getRoleDropDown();
  },
};
</script>

<style>
</style>