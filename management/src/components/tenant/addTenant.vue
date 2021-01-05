<template>
  <div class="content">
    <div>
      <el-button :size="'small'" style="margin-bottom: 30px" @click="turnBack()"
        >返回</el-button
      >
    </div>
    <div style="width: 30%">
      <el-form
        :model="addTenantForm"
        :rules="rules"
        ref="addTenantForm"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="addTenantForm.name"></el-input>
        </el-form-item>
        <el-form-item label="房间" prop="room">
          <el-cascader
            v-model="addTenantForm.room"
            :props="props"
            ref="roomCascader"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="addTenantForm.gender">
            <el-radio label="MALE">男</el-radio>
            <el-radio label="FEMALE">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input type="text" v-model="addTenantForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="identificationNumber">
          <el-input
            type="text"
            v-model="addTenantForm.identificationNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            type="date"
            v-model="addTenantForm.birthday"
            placeholder="选择日期"
            format="YYYY 年 M 月 D 日"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="籍贯">
          <el-cascader
            v-model="addTenantForm.hometown"
            :options="cities"
            ref="hometownCascader"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('addTenantForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('addTenantForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import provinceList from "../../utils/cities";

export default {
  data() {
    return {
      addTenantForm: {
        name: "",
        gender: "",
        phone: "",
        identificationNumber: "",
        birthday: "",
        room: [],
        hometown: [],
      },
      rules: {
        name: [{ required: true, message: "请填写房客姓名", trigger: "blur" }],
        room: [
          {
            type: "array",
            required: true,
            message: "请选择房屋",
            trigger: "blur",
          },
        ],
        gender: [{ required: true, message: "请填写性别", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            pattern: /^1([3456789])\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        identificationNumber: [
          { required: true, message: "请输入身份证号码", trigger: "blur" },
          {
            pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "请输入正确的身份证号码",
            trigger: "blur",
          },
        ],
      },
      optionList: [],
      value: "",
      cities: provinceList,
      props: {
        lazy: true,
        lazyLoad: this.loadData,
      },
    };
  },
  methods: {
    turnBack() {
      this.$router.history.go(-1);
    },
    loadData(node, resolve) {
      const { level } = node;
      if (level == 0) {
        this.getHouseDropDown().then((dropDown) => {
          resolve(dropDown);
        });
      } else {
        let houseId = node.data.value;
        this.getRoomDropDown(houseId).then((dropDown) => {
          resolve(dropDown);
        });
      }
    },
    getHouseDropDown() {
      return new Promise((resolve) => {
        this.request
          .post("/house/getHouseDropDown", {})
          .then((response) => {
            let houseList = response.data;
            var optionList = [];
            for (let house of houseList) {
              optionList.push({
                value: house.id,
                label: house.houseName,
                leaf: false,
              });
            }
            resolve(optionList);
          })
          .catch((error) => {
            console.log(error);
            resolve([]);
          });
      });
    },
    getRoomDropDown(houseId) {
      return new Promise((resolve) => {
        this.request
          .post("/room/getRoomDropDown", { houseId: houseId })
          .then((response) => {
            let roomList = response.data;
            let optionList = [];
            for (let room of roomList) {
              optionList.push({
                value: room.id,
                label: room.roomNumber,
                leaf: true,
              });
            }
            resolve(optionList);
          })
          .catch((error) => {
            console.log(error);
            resolve([]);
          });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let submitForm = {
            name: this.addTenantForm.name,
            gender: this.addTenantForm.gender,
            phone: this.addTenantForm.phone,
            identificationNumber: this.addTenantForm.identificationNumber,
            birthday: dayjs(this.addTenantForm.birthday).format("YYYY-MM-DD"),
          };
          const { pathLabels, pathValues } = this.$refs[
            "roomCascader"
          ].getCheckedNodes()[0];
          submitForm.houseId = pathValues[0];
          submitForm.houseName = pathLabels[0];
          submitForm.roomId = pathValues[1];
          submitForm.roomNumber = pathLabels[1];
          if (this.addTenantForm.hometown.length > 0) {
            submitForm.hometownProvince = this.addTenantForm.hometown[0];
            submitForm.hometownCity = this.addTenantForm.hometown[1];
          }
          this.request
            .post("/tenant/addTenant", submitForm)
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
  mounted() {
    this.getHouseDropDown();
  },
};
</script>

<style>
.content{
  background-color: white;
  padding: 10px 10px 10px 10px;
}
</style>