<template>
  <view class="page" id="page" :style="'padding-bottom: ' + barHeight + 'px'">
    <form class="bg-gray">
      <view class="cu-form-group margin-top">
        <view class="title"> 押金 </view>
        <input
          type="number"
          v-model.number="roomForm.deposit"
          style="font-size: 16px"
          @input="onDepositChange"
        />
      </view>
      <view class="cu-form-group">
        <view class="title"> 门卡数量 </view>
        <input
          type="number"
          v-model.number="roomForm.cardQuantity"
          style="font-size: 16px"
          @input="onAccessCardChange"
        />
      </view>
      <view class="cu-form-group">
        <view class="title">入住日期</view>
        <picker mode="date" :start="start" :end="end" @change="DateChange">
          <view class="picker" style="text-align: left; font-size: 16px">
            {{ dateString }}
          </view>
        </picker>
      </view>
      <view class="cu-form-group">
        <view class="title">支付方式</view>
        <picker
          @change="paymethodChange"
          :value="payMethodIndex"
          :range="payMethodList"
          range-key="value"
        >
          <view class="picker" style="text-align: left; font-size: 16px">
            {{ payMethodList[payMethodIndex].value }}
          </view>
        </picker>
      </view>
      <view class="cu-form-group">
        <view class="title"> 备注 </view>
        <textarea
          v-model="roomForm.remark"
          cols="30"
          rows="10"
          maxlength="140"
          style="font-size: 16px"
        ></textarea>
      </view>
      <view class="cu-form-group">
        <view class="title"> 水 </view>
        <input type="number" v-model="roomForm.water" />
      </view>
      <view class="cu-form-group solid-bottom">
        <view class="title"> 电 </view>
        <input type="number" v-model="roomForm.electricity" />
      </view>
    </form>
    <view class="padding-xs text-xl" style="font-weight: 700"> 入住人: </view>
    <view
      v-for="(tenant, index) in tenantList"
      :key="index"
      class="solid-bottom bg-white"
    >
      <view class="padding-sm flex">
        <view class="font-size-20">
          <text class="cuIcon-people margin-right-xs text-brown"></text>
        </view>
        <view class="font-size-17"> 姓名：{{ tenant.name }} </view>
      </view>
      <view
        class="padding-sm flex"
        v-if="
          !(
            tenant.phone === null ||
            tenant.phone === undefined ||
            tenant.phone == ''
          )
        "
      >
        <view class="font-size-20">
          <text class="cuIcon-phone margin-right-xs text-yellow"></text>
        </view>
        <view class="font-size-17"> 联系电话：{{ tenant.phone }} </view>
      </view>
      <!-- <view
        class="padding-sm flex"
        v-if="
          !(
            tenant.identificationNumber === null ||
            tenant.identificationNumber == 'undefined' ||
            tenant.identificationNumber === ''
          )
        "
      >
        <view class="font-size-20">
          <text class="cuIcon-card margin-right-xs text-blue"></text>
        </view>
        <view class="font-size-17">
          身份证号码：{{ tenant.identificationNumber }}
        </view>
      </view> -->
      <view class="basis-xs padding-xs">
        <button class="cu-btn bg-red round" @click="deleteTenant(index)">
          删除
        </button>
      </view>
    </view>
    <view v-show="formShow" id="tenantFormDiv">
      <form class="bg-gray">
        <view class="cu-form-group">
          <view class="title">姓名</view>
          <input placeholder="姓名" name="name" v-model="tenantForm.name" />
        </view>
        <view class="cu-form-group">
          <view class="title">联系电话</view>
          <input
            placeholder="联系电话"
            name="phone"
            v-model="tenantForm.phone"
          />
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
      <view class="flex justify-start">
        <view class="padding">
          <button class="basis-xs cu-btn bg-green" @click="addTenant()">
            确定
          </button>
        </view>
        <view class="padding">
          <button class="basis-xs cu-btn bg-red" @click="hideTenantForm()">
            取消
          </button>
        </view>
      </view>
    </view>
    <view class="box">
      <view class="cu-bar tabbar btn-group foot bg-white" id="box">
        <button
          class="cu-btn bg-green shadow-blur round lg"
          @click="showTenantForm()"
        >
          添加房客
        </button>
        <button
          class="cu-btn bg-blue shadow-blur round lg"
          @click="saveAdd()"
          v-if="tenantList.length > 0"
        >
          保存
        </button>
      </view>
    </view>
    <view class="flex justify-start">
      <view class="padding"> </view>
      <view class="padding" v-show="tenantList.length > 0"> </view>
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
import Schema from "async-validator";
import region from "@/utils/cities.js";
import dayjs from "dayjs";
Schema.warning = function () {};

export default {
  data() {
    return {
      id: "",
      roomNumber: "",
      houseId: "",
      houseName: "",
      price: null,
      accessCardPrice: 0,
      tenantList: [],
      formShow: true,
      tenantForm: {
        name: "",
        identificationNumber: "",
        phone: "",
        hometown: [],
        gender: "male",
      },
      end: dayjs().add(1, "month").format("YYYY-MM-DD"),
      start: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
      roomForm: {
        deposit: null,
        cardQuantity: null,
        checkInDate: dayjs().format("YYYY-MM-DD"),
        remark: "",
        water: "",
        electricity: "",
      },
      dateString: dayjs().format("YYYY年M月D日"),
      payMethodList: [
        { value: "微信", key: "WEIXIN" },
        { value: "现金", key: "CASH" },
      ],
      payMethodIndex: 0,
      errorModal: false,
      errorMessage: [],
      rules: {
        name: {
          type: "string",
          required: true,
          message: "姓名不能为空",
        },
        phone: [
          {
            pattern: /^1([3456789])\d{9}$/,
            message: "请输入正确的手机号码",
          },
        ],
        identificationNumber: [
          {
            pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "请填写正确的身份证号码",
          },
          {
            validator: this.checkIdentificationNumberExist,
          },
        ],
      },
      cityList: [region.provinceList, region.getCityList("北京市")],
      responseModal: {
        show: false,
        title: "",
        message: "",
        action: null,
        loading: false,
      },
      responseModalShow: false,
      barHeight: 0,
      loadingModal: false,
    };
  },
  methods: {
    showTenantForm() {
      this.formShow = true;
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .select("#page")
          .boundingClientRect((data) => {
            uni
              .createSelectorQuery()
              .select("#tenantFormDiv")
              .boundingClientRect((res) => {
                uni.pageScrollTo({
                  duration: 0,
                  scrollTop: res.top - data.top,
                });
              })
              .exec();
          })
          .exec();
      });
    },
    addTenant() {
      const validator = new Schema(this.rules);
      validator
        .validate(this.tenantForm)
        .then((valid) => {
          this.tenantList.push({
            name: this.tenantForm.name,
            gender: this.tenantForm.gender,
            identificationNumber: this.tenantForm.identificationNumber,
            phone: this.tenantForm.phone,
            hometownProvince: this.tenantForm.hometown[0],
            hometownCity: this.tenantForm.hometown[1],
          });
          this.hideTenantForm();
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
    deleteTenant(index) {
      this.tenantList.splice(index, 1);
    },
    hideTenantForm() {
      this.formShow = false;
      this.onTenantFormHide();
    },
    onTenantFormHide() {
      this.tenantForm = {
        name: "",
        identificationNumber: "",
        phone: "",
        hometown: "",
        gender: "male",
      };
    },
    showErrorModal(messages) {
      this.errorMessage = messages;
      this.errorModal = true;
    },
    hideErrorModal() {
      this.errorModal = false;
    },
    checkIdentificationNumberExist(rule, value, callback) {
      if (value === "") callback();
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
    },
    genderChange(e) {
      this.tenantForm.gender = e.detail.value;
    },
    hometownChange(e) {
      let provinceIndex = e.detail.value[0];
      let cityIndex = e.detail.value[1];
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
    saveAdd() {
      // this.responseModal.title = "操作中";
      // this.responseModal.message = "操作中，请稍后";
      // this.responseModal.loading = true;
      // this.responseModal.action = ""
      this.loadingModal = true;
      let {
        deposit,
        cardQuantity,
        remark,
        checkInDate,
        water,
        electricity,
      } = this.roomForm;
      this.request
        .post("/tenant/checkIn", {
          roomId: this.id,
          roomNumber: this.roomNumber,
          houseId: this.houseId,
          houseName: this.houseName,
          deposit: deposit === "" || deposit === null ? 0 : deposit,
          cardQuantity:
            cardQuantity === "" || cardQuantity === null ? 0 : cardQuantity,
          checkInDate: checkInDate,
          payMethod: this.payMethodList[this.payMethodIndex].key,
          remark: remark,
          tenantList: this.tenantList,
          water: water,
          electricity: electricity,
        })
        .then((response) => {
          let { message } = response;
          this.responseModal.title = "成功";
          this.responseModal.message = message;
          this.responseModal.action = this.successAction;
          this.loadingModal = false;
          this.$nextTick(() => {
            this.responseModalShow = true;
          });
        })
        .catch((err) => {
          console.error(err);
          this.responseModal.title = "失败";
          this.responseModal.message = err;
          this.responseModal.action = this.failAction;
          this.loadingModal = false;
          this.$nextTick(() => {
            this.responseModalShow = true;
          });
        });
    },
    getPrice() {
      this.request.post("/bill/getUtilityPrice", {}).then((response) => {
        let { data } = response;
        this.accessCardPrice = data.accessCardPrice[this.houseName];
      });
    },
    responseModalConfirm() {
      this.responseModalShow = false;
      this.responseModal.action();
    },
    successAction() {
      uni.navigateBack({
        delta: 1,
      });
    },
    failAction() {
      this.responseModalShow = false;
    },
    DateChange(e) {
      console.log(e.detail.value);
      let value = e.detail.value;
      this.dateString = dayjs(value).format("YYYY年M月D日");
      this.roomForm.checkInDate = value;
    },
    paymethodChange(e) {
      this.payMethodIndex = e.detail.value;
    },
    onDepositChange(e) {
      let qunantity =
        this.roomForm.cardQuantity == null ? 0 : this.roomForm.cardQuantity;
      let deposit = new Number(e.detail.value);
      let accessCardCharge = qunantity * this.accessCardPrice;
      let total = deposit + this.price + accessCardCharge;
      if (qunantity > 0) {
        this.roomForm.remark = `押金${deposit}元，房租${this.price}元，门卡${qunantity}个${accessCardCharge}元，总共${total}元，租满三个月后退房时清洁好卫生还原房内现状，计清水电再退回所剩押金，自己财物自己保管`;
      } else {
        this.roomForm.remark = `押金${deposit}元，房租${this.price}元，总共${total}元，租满三个月后退房时清洁好卫生还原房内现状，计清水电再退回所剩押金，自己财物自己保管`;
      }
    },
    onAccessCardChange(e) {
      // let total = new Number(this.price) + new Number(this.accessCardPrice);
      let qunantity =
        e.detail.value == null || e.detail.value == "" ? 0 : e.detail.value;
      let accessCardCharge = this.accessCardPrice * qunantity;
      let total = this.price + accessCardCharge + this.roomForm.deposit;
      if (qunantity > 0) {
        this.roomForm.remark = `押金${this.roomForm.deposit}元，房租${this.price}元，门卡${qunantity}个${accessCardCharge}元，总共${total}元，租满三个月后退房时清洁好卫生还原房内现状，计清水电再退回所剩押金，自己财物自己保管`;
      } else {
        this.roomForm.remark = `押金${this.roomForm.deposit}元，房租${this.price}元，总共${total}元，租满三个月后退房时清洁好卫生还原房内现状，计清水电再退回所剩押金，自己财物自己保管`;
      }
    },
  },
  onLoad(params) {
    this.id = params.roomId;
    this.roomNumber = params.roomNumber;
    this.houseId = params.houseId;
    this.houseName = params.houseName;
    this.price = new Number(params.price);
    this.roomForm.deposit = new Number(params.price);
    // this.roomForm.remark = `押金租满三个月方可退还，共${
    //   this.price + this.roomForm.deposit
    // }元，自己财物自己保管`;
    let total = this.roomForm.deposit + this.price;
    this.roomForm.remark = `押金${this.roomForm.deposit}元，房租${this.price}元，总共${total}元，租满三个月后退房时清洁好卫生还原房内现状，计清水电再退回所剩押金，自己财物自己保管`;
    this.$nextTick(() => {
      let view = uni.createSelectorQuery().select("#box");
      view
        .fields(
          {
            size: true,
          },
          (data) => {
            this.barHeight = data.height;
          }
        )
        .exec();
    });
    uni.setNavigationBarTitle({
      title: `${params.houseName}-${params.roomNumber}号房入住登记`,
    });
    this.getPrice();
  },
  filters: {
    genderStr(value) {
      return value == "male" ? "男" : "女";
    },
  },
};
</script>

<style>
.box {
  margin: 20upx 0;
}

.box view.cu-bar {
  margin-top: 20upx;
}

.cu-form-group .title {
  min-width: calc(4em + 15px);
  font-size: 17px;
}

.cu-form-group {
  font-size: 17px;
}

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