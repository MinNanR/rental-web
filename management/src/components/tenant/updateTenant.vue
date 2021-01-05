<template>
  <div class="content">
    <div>
      <el-button :size="'small'" style="margin-bottom: 30px" @click="turnBack()"
        >返回</el-button
      >
    </div>
    <div style="width: 30%">
      <el-form
        :model="updateTenantForm"
        :rules="rules"
        ref="updateTenantForm"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="updateTenantForm.name"></el-input>
        </el-form-item>
        <el-form-item label="房间" prop="room">
          <el-cascader
            v-model="updateTenantForm.room"
            :props="props"
            ref="roomCascader"
            disabled
          ></el-cascader>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="updateTenantForm.gender">
            <el-radio label="MALE">男</el-radio>
            <el-radio label="FEMALE">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input type="text" v-model="updateTenantForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="identificationNumber">
          <el-input
            type="text"
            v-model="updateTenantForm.identificationNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            type="date"
            v-model="updateTenantForm.birthday"
            placeholder="选择日期"
            format="YYYY 年 M 月 D 日"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="籍贯">
          <el-cascader
            v-model="updateTenantForm.hometown"
            :options="cities"
            ref="hometownCascader"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('updateTenantForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('updateTenantForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import provinces from "../../utils/cities.js";
import * as dayjs from "dayjs";

export default {
  data() {
    return {
      tenantInfo: {},
      updateTenantForm: {},
      id: 0,
      cities: provinces,
      props: {
        lazy: true,
        lazyLoad: this.loadData,
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
    };
  },
  methods: {
    turnBack() {
      this.$router.history.go(-1);
    },
    getTenantInfo() {
      this.request
        .post("/tenant/getTenantInfo", { id: this.id })
        .then((response) => {
          let tenant = response.data;
          this.tenantInfo = {
            name: tenant.name,
            houseId: tenant.houseId,
            houseName: tenant.houseName,
            roomId: tenant.roomId,
            roomNumber: tenant.roomNumber,
            phone: tenant.phone,
            identificationNumber: tenant.identificationNumber,
            gender: tenant.gender,
            birthday: tenant.birthday,
            hometownProvince: tenant.hometownProvince,
            hometownCity: tenant.hometownCity,
          };
          this.updateTenantForm = tenant;
          this.updateTenantForm.hometown = [
            tenant.hometownProvince,
            tenant.hometownCity,
          ];
          this.updateTenantForm.room = [tenant.houseId, tenant.roomId];
          this.updateTenantForm.gender =
            tenant.gender == "男" ? "MALE" : "FEMALE";
          this.tenantInfo.gender = tenant.gender == "男" ? "MALE" : "FEMALE";
        })
        .catch((error) => {
          console.log(error);
        });
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
          let submitForm = {};
          if (this.updateTenantForm.name !== this.tenantInfo.name) {
            submitForm.name = this.updateTenantForm.name;
          }
          if (this.updateTenantForm.gender !== this.tenantInfo.gender) {
            submitForm.gender = this.updateTenantForm.gender;
          }
          if (this.updateTenantForm.phone !== this.tenantInfo.phone) {
            submitForm.phone = this.updateTenantForm.phone;
          }
          if (
            this.updateTenantForm.identificationNumber !==
            this.tenantInfo.identificationNumber
          ) {
            submitForm.identificationNumber = this.updateTenantForm.identificationNumber;
          }
          let birthday = dayjs(this.updateTenantForm.birthday).format(
            "YYYY-MM-DD"
          );
          if (birthday !== this.tenantInfo.birthday) {
            submitForm.birthday = birthday;
          }
          let [hometownProvince, hometownCity] = this.updateTenantForm.hometown;
          if (hometownProvince !== this.tenantInfo.hometownProvince) {
            submitForm.hometownProvince = hometownProvince;
          }
          if (hometownCity !== this.tenantInfo.hometownCity) {
            submitForm.hometownCity = hometownCity;
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
            .post("/tenant/updateTenant", submitForm)
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
    this.getTenantInfo();
  },
};
</script>

<style>

</style>