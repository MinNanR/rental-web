<template>
  <div class="content">
    <el-button :size="'small'" @click="turnBack()">返回</el-button>
    <div style="width: 30%">
      <el-form :model="addHouseForm" :rules="rules" ref="addHouseForm" label-width="150px">
        <el-form-item label="地址" prop="address">
          <el-input
            type="textarea"
            v-model="addHouseForm.address"
            autocomplete="off"
            :resize="'none'"
            placeholder="请输入地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="houseName">
          <el-input
            type="text"
            v-model="addHouseForm.houseName"
            placehoder="请输入简称"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理人姓名" prop="directorName">
          <el-input
            type="text"
            v-model="addHouseForm.directorName"
            placeholder="管理人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理人联系电话" prop="directorPhone">
          <el-input
            type="text"
            v-model="addHouseForm.directorPhone"
            placeholder="联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('addHouseForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('addHouseForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addHouseForm: {
        address: "",
        houseName: "",
        directorName: "",
        directorPhone: "",
      },
      rules: {
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        directorName: [
          { required: true, message: "请输入管理人姓名", trigger: "blur" },
        ],
        directorPhone: [
          { required: true, message: "请输入管理人联系电话", trigger: "blur" },
          {
            pattern: /^1([3456789])\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        houseName: [
          { required: true, message: "请输入房屋简称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    turnBack() {
      this.$router.history.go(-1);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.request
            .post("/house/addHouse", this.addHouseForm)
            .then((response, message) => {
              this.$notify({
                title: "操作成功",
                message: message,
                type: "success",
              });
              this.turnBack();
            })
            .catch((error) => {
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
};
</script>

<style>

</style>