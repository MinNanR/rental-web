<template>
  <div class="content">
    <el-button :size="'small'" @click="turnBack()">返回</el-button>
    <div style="width: 30%">
      <el-form
        :model="updateHouseForm"
        :rules="rules"
        ref="updateHouseForm"
        label-width="150px"
      >
        <el-form-item label="地址" prop="address">
          <el-input
            type="textarea"
            v-model="updateHouseForm.address"
            autocomplete="off"
            :resize="'none'"
            placeholder="请输入地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="houseName">
          <el-input
            type="text"
            v-model="updateHouseForm.houseName"
            placehoder="请输入简称"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理人姓名" prop="directorName">
          <el-input
            type="text"
            v-model="updateHouseForm.directorName"
            placeholder="管理人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理人联系电话" prop="directorPhone">
          <el-input
            type="text"
            v-model="updateHouseForm.directorPhone"
            placeholder="联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('updateHouseForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      houseInfo: {},
      updateHouseForm: {},
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
    loadData(id) {
      this.request.post("/house/getHouseInfo", { id: id }).then((response) => {
        let data = response.data;
        this.houseInfo = {
          houseName: data.houseName,
          address: data.address,
          directorName: data.directorName,
          directorPhone: data.directorPhone,
        };
        this.updateHouseForm = response.data;
      });
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formToSubmit = {};
          if (this.updateHouseForm.address !== this.houseInfo.address) {
            formToSubmit.address = this.updateHouseForm.address;
          }
          if (
            this.updateHouseForm.directorName !== this.houseInfo.directorName
          ) {
            formToSubmit.directorName = this.updateHouseForm.directorName;
          }
          if (
            this.updateHouseForm.directorPhone !== this.houseInfo.directorPhone
          ) {
            formToSubmit.directorPhone = this.updateHouseForm.directorPhone;
          }
          if (this.updateHouseForm.houseName !== this.houseInfo.houseName) {
            formToSubmit.houseName = this.updateHouseForm.houseName;
          }
          if (Object.keys(formToSubmit).length === 0) {
            this.$notify({
              title: "操作成功",
              message: "没有修改的信息",
              type: "info",
            });
            this.turnBack();
            return;
          }
          formToSubmit.id = this.updateHouseForm.id;
          this.request
            .post("/house/updateHouse", formToSubmit)
            .then((response, message) => {
              console.log(response);
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
  mounted() {
    this.loadData(this.$route.query.id);
  },
};
</script>

<style>

</style>