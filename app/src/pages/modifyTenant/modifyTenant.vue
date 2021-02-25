<template>
  <view class="">
    <form class="bg-gray" v-if="loaded">
      <view class="cu-form-group margin-top">
        <view class="title">姓名</view>
        <input placeholder="姓名" name="name" v-model="tenantForm.name" />
      </view>
      <view class="cu-form-group">
        <view class="title">联系电话</view>
        <input placeholder="联系电话" name="phone" v-model="tenantForm.phone" />
      </view>
      <!-- <view class="cu-form-group">
        <view class="title">身份证号码</view>
        <input
          placeholder="身份证号码"
          name="identifiNumber"
          v-model="tenantForm.identificationNumber"
        />
      </view> -->
    </form>
    <view class="box">
      <view class="cu-bar tabbar btn-group foot bg-white" id="box">
        <button
            class="cu-btn bg-green shadow-blur round lg"
            @click="saveModify()"
          >
            保存
          </button>
      </view>
    </view>
    <view class="cu-modal" :class="errorModal ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">输入错误</view>
          <view class="action" @tap="hideErrorModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view
          v-for="(item, index) in errorMessage"
          :key="index"
          class="padding text-lg"
        >
          {{ item }}
        </view>
      </view>
    </view>
    <view class="cu-modal" :class="responseModalShow ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ responseModal.title }}</view>
          <view class="action" @tap="responseModalConfirm">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view v-show="responseModal.loading">
          <view class="padding-top">
            <text class="cuIcon-loading2" style="font-size: 20px"></text>
          </view>
        </view>
        <view class="padding">
          {{ responseModal.message }}
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action" v-show="!responseModal.loading">
            <button
              class="cu-btn bg-green margin-left"
              @tap="responseModalConfirm"
            >
              确定
            </button>
          </view>
        </view>
      </view>
    </view>
        <view class="cu-load load-modal" v-if="loadingModal">
      <!-- <view class="cuIcon-emojifill text-orange"></view> -->
      <image src="/static/logo.png" mode="aspectFit"></image>
      <view class="gray-text">保存中...</view>
    </view>
  </view>
</template>

<script>
// import region from "@/utils/cities.js";
import Schema from "async-validator";
Schema.warning = function () {};

export default {
  data() {
    return {
      id: "",
      tenantInfo: {},
      tenantForm: {},
      // cityList: [region.provinceList, region.getCityList("北京市")],
      cityValue: [],
      loaded: false,
      rules: {
        name: {
          type: "string",
          required: true,
          message: "姓名不能为空",
        },
        phone: [
          {
            type: "string",
            required: true,

            message: "电话号码不能为空",
          },
          {
            pattern: /^1([3456789])\d{9}$/,
            message: "请输入正确的手机号码",
          },
        ],
        identificationNumber: [
          {
            type: "string",
            required: true,
            message: "身份证号码不能为空",
          },
          {
            pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "请填写正确的身份证号码",
          },
          {
            validator: this.checkIdentificationNumberExist,
          },
        ],
      },
      errorModal: false,
      errorMessage: [],
      responseModal: {
        show: false,
        title: "",
        message: "",
        action: null,
        loading: false,
      },
      responseModalShow: false,
      loadingModal:false,
    };
  },
  methods: {
    getTenantInfo() {
      this.request
        .post("/tenant/getTenantInfo", { id: this.id })
        .then((response) => {
          let { data } = response;
          this.tenantForm = {
            name: data.name,
            gender: data.gender == "男" ? "male" : "female",
            phone: data.phone,
            identificationNumber: data.identificationNumber,
            hometown: [data.hometownProvince, data.hometownCity],
          };
          this.tenantInfo = data;
          // this.tenantInfo.gender = data.gender == "男" ? "male" : "female";
          // this.tenantInfo.hometown = [data.hometownProvince, data.hometownCity];
          // this.cityList[1] = region.getCityList(data.hometownProvince);
          // this.cityValue = [
          //   region.getProvinceIndex(data.hometownProvince),
          //   region.getCityIndex(data.hometownProvince, data.hometownCity),
          // ];
          this.loaded = true;
          uni.setNavigationBarTitle({
            title: data.name,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    hometownChange(e) {
      let provinceIndex = e.detail.value[0];
      let cityIndex = e.detail.value[1];
      this.cityValue = [e.detail.value[0], e.detail.value[1]];
      this.tenantForm.hometown = [
        this.cityList[0][provinceIndex],
        this.cityList[1][cityIndex],
      ];
    },
    provinceChange(e) {
      if (e.detail.column === 0) {
        this.cityList[1] = region.getCityList(this.cityList[0][e.detail.value]);
      }
    },
    genderChange(e) {
      this.tenantForm.gender = e.detail.value;
    },
    saveModify() {
      const validator = new Schema(this.rules);
      validator
        .validate(this.tenantForm)
        .then(() => {
          let { name, gender, phone, identificationNumber } = this.tenantForm;
          let hometownProvince = this.tenantForm.hometown[0];
          let hometownCity = this.tenantForm.hometown[1];
          let modifyForm = {};
          if (name !== this.tenantInfo.name) {
            modifyForm.name = name;
          }
          if (gender !== this.tenantInfo.gender) {
            modifyForm.gender = gender;
          }
          if (phone !== this.tenantInfo.phone) {
            modifyForm.phone = phone;
          }
          if (identificationNumber !== this.tenantInfo.identificationNumber) {
            modifyForm.identificationNumber = identificationNumber;
          }
          if (hometownProvince !== this.tenantInfo.hometownProvince) {
            modifyForm.hometownProvince = hometownProvince;
          }
          if (hometownCity !== this.tenantInfo.hometownCity) {
            modifyForm.hometownCity = hometownCity;
          }
          if (Object.keys(modifyForm).length == 0) {
            this.responseModal.title = "无更改";
            this.responseModal.message = "无更改的信息";
            this.responseModal.loading = false;
            this.responseModal.action = "success";
            this.responseModalShow = true;
            return;
          }
          // this.responseModal.title = "操作中";
          // this.responseModal.message = "操作中，请稍后";
          // this.responseModal.loading = true;
          // this.responseModal.action = "";
          // this.responseModalShow = true;
          this.loadingModal = true
          modifyForm.id = this.tenantInfo.id;
          this.request
            .post("/tenant/updateTenant", modifyForm)
            .then((response) => {
              let { message } = response;
              this.responseModal.title = "成功";
              this.responseModal.message = message;
              this.responseModal.action = "success";
              this.loadingModal = false
              this.$nextTick(() => {
                this.responseModalShow = true
              })
            })
            .cathc((err) => {
              console.error(err);
              this.responseModal.title = "失败";
              this.responseModal.message = err;
              this.responseModal.action = "fail";
              this.loadingModal = false
              this.$nextTick(() => {
                this.responseModalShow = true
              })
            });
        })
        .catch(({ errors, fields }) => {
          if (errors) {
            let messages = Object.keys(fields).map(
              (index) => fields[index][0].message
            );
            this.showErrorModal(messages);
          }
        });
    },
    checkIdentificationNumberExist(rule, value, callback) {
      if (value !== this.tenantInfo.identificationNumber) {
        this.request
          .post("/tenant/checkIdNumber", { identificationNumber: value })
          .then((response) => {
            let { data } = response;
            if (data) {
              callback(new Error("身份证号码已存在"));
            } else {
              callback();
            }
          });
      } else {
        callback();
      }
    },
    showErrorModal(messages) {
      this.errorMessage = messages;
      this.errorModal = true;
    },
    hideErrorModal() {
      this.errorModal = false;
    },
    responseModalConfirm() {
      this.responseModalShow = false;
      let action = this.responseModal.action;
      if (action === "success") {
        this.successAction();
      } else if (action === "fail") {
        this.failAction();
      }
    },
    successAction() {
      uni.navigateBack({
        delta: 1,
      });
    },
    failAction() {},
  },
  onLoad(params) {
    this.id = params.id;
  },
  onShow() {
    this.$nextTick(() => {
      this.getTenantInfo();
    });
  },
};
</script>

<style>
/* #ifdef H5 */
.cu-bar.btn-group uni-button {
  max-width: 100%;
}
/* #endif */

/* #ifdef MP-WEIXIN */
.cu-bar.btn-group button {
  max-width: 100%;
}
/* #endif */
</style>