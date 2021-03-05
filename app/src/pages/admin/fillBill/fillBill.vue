<template>
  <view class="" :style="'padding-bottom: ' + barHeight + 'px'">
    <view class="margin padding bg-white">
      <view class="text-xl" style="font-weight: 700"> 账单日期 </view>
      <view class="flex margin-top bg-cyan">
        <view class="flex-sub padding solid"> </view>
        <view class="flex-twice padding solid"> 日期 </view>
      </view>
      <view class="flex bg-white">
        <view class="flex-sub padding solid"> 从 </view>
        <view class="flex-twice padding solid">
          <view>
            <picker mode="date" @change="startDateChange">
              <view class="picker" style="text-align: left; font-size: 16px">
                {{ bill.startDate }}
              </view>
            </picker>
          </view>
        </view>
      </view>
      <view class="flex bg-white">
        <view class="flex-sub padding solid"> 至 </view>
        <view class="flex-twice padding solid">
          <picker mode="date" @change="endDateChange">
            <view class="picker" style="text-align: left; font-size: 16px">
              {{ bill.endDate }}
            </view>
          </picker>
        </view>
      </view>
    </view>
    <view class="margin padding bg-white">
      <view class="text-xl" style="font-weight: 700"> 水电填写 </view>
      <view class="padding-top font-size-17 text-center">
        <view class="flex bg-cyan">
          <view class="flex-sub padding solid"> </view>
          <view class="flex-sub padding solid"> 水 </view>
          <view class="flex-sub padding solid"> 电 </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid">
            {{ baseData.utilityStartDate }}</view
          >
          <view class="flex-sub padding solid">
            <input
              type="number"
              v-model="bill.waterStart"
              @input="onWaterStartChange"
            />
          </view>
          <view class="flex-sub padding solid">
            <input
              type="number"
              v-model="bill.electricityStart"
              @input="onElectricityStartChange"
            />
          </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> {{ bill.today }}</view>
          <view class="flex-sub padding solid">
            <input
              type="number"
              v-model="bill.waterEnd"
              @input="onWaterEndChange"
            />
          </view>
          <view class="flex-sub padding solid">
            <input
              type="number"
              v-model="bill.electricityEnd"
              @input="onElectricityEndChange"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="margin padding bg-white" v-if="!showLoading">
      <view class="text-xl" style="font-weight: 700"> 账单结算 </view>
      <view class="padding-top font-size-17 text-center">
        <view class="flex bg-cyan" style="">
          <view class="flex-sub padding solid"> 收款项 </view>
          <view class="flex-sub padding solid"> 数量 </view>
          <view class="flex-sub padding solid"> 收费(元) </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> 水 </view>
          <view class="flex-sub padding solid"> {{ bill.waterUsage }}度 </view>
          <view class="flex-sub padding solid"> {{ bill.waterCharge }} </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> 电 </view>
          <view class="flex-sub padding solid">
            {{ bill.electricityUsage }}度
          </view>
          <view class="flex-sub padding solid">
            {{ bill.electricityCharge }}
          </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> 房租 </view>
          <view class="flex-sub padding solid"> /</view>
          <view class="flex-sub padding solid"> {{ baseData.price }} </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> 总收费 </view>
          <view class="flex-sub padding solid"> / </view>
          <view class="flex-sub padding solid"> {{ bill.totalCharge }} </view>
        </view>
      </view>
    </view>
    <view class="box">
      <view class="cu-bar tabbar btn-group foot bg-white" id="box">
        <button class="cu-btn bg-green shadow-blur round lg" @click="save()">
          保存并出单
        </button>
      </view>
    </view>
    <view class="cu-modal" :class="modalShow ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ modal.title }}</view>
          <view class="action" @tap="hideMessageModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding text-lg">
          <view
            v-for="(m, index) in modal.message"
            :key="index"
            class="padding-xs"
          >
            {{ m }}
          </view>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button class="cu-btn bg-green margin-left" @tap="confirmAction">
              确定
            </button>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-load load-modal" v-if="loadingModal">
      <!-- <view class="cuIcon-emojifill text-orange"></view> -->
      <image src="/static/logo.png" mode="aspectFit"></image>
      <view class="gray-text">{{ loadingMessage }}</view>
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      barHeight: 0,
      roomId: "",
      baseData: {},
      showLoading: false,
      bill: {
        totalCharge: 0,
        rent: 0,
        waterUsage: 0,
        waterCharge: 0,
        electricityUsage: 0,
        electricityCharge: 0,
        today: "",
        waterStart: 0,
        waterEnd: "",
        electricityStart: 0,
        electricityEnd: "",
        startDate: "",
        endDate: "",
      },
      loadingModal: false,
      loadingMessage: "",
      modalShow: false,
      modal: {
        title: "",
        message: [],
      },
    };
  },
  methods: {
    getBillData() {
      this.request
        .post("/bill/getBillData", { roomId: this.roomId })
        .then((response) => {
          let { data } = response;
          this.baseData = data;
          this.bill.waterStart = data.waterStart;
          this.bill.electricityStart = data.electricityStart;
          this.bill.today = dayjs().format("M月DD日");
          this.bill.totalCharge = data.price;
          this.bill.billId = data.id;
          this.bill.utilityStartId = data.utilityStartId;
          this.bill.startDate = data.startDate;
          this.bill.endDate = data.endDate;
        });
    },
    onWaterEndChange(e) {
      let waterEnd = e.detail.value;
      if (waterEnd < this.bill.waterStart) {
        waterEnd = 1000 + new Number(waterEnd);
      }
      this.bill.waterUsage = waterEnd - this.bill.waterStart;
      let waterUsage = this.bill.waterUsage;
      if (waterUsage === 0) {
        waterUsage = 1;
      }
      this.bill.waterCharge = waterUsage * this.baseData.waterPrice;
      this.bill.totalCharge =
        this.bill.waterCharge +
        this.bill.electricityCharge +
        this.baseData.price;
    },
    onElectricityEndChange(e) {
      let electricityEnd = e.detail.value;
      if (electricityEnd < this.bill.electricityStart) {
        electricityEnd = 10000 + new Number(electricityEnd);
      }
      this.bill.electricityUsage = electricityEnd - this.bill.electricityStart;
      this.bill.electricityCharge =
        this.bill.electricityUsage * this.baseData.electricityPrice;
      this.bill.totalCharge =
        this.bill.waterCharge +
        this.bill.electricityCharge +
        this.baseData.price;
    },
    onWaterStartChange(e) {
      let waterStart = e.detail.value;
      let waterEnd = this.bill.waterEnd;
      if (waterEnd < waterStart) {
        waterEnd = waterEnd + 1000;
      }
      this.bill.waterUsage = waterEnd - waterStart;
      let waterUsage = this.bill.waterUsage;
      if (waterUsage === 0) {
        waterUsage = 1;
      }
      this.bill.waterCharge = waterUsage * this.baseData.waterPrice;
      this.bill.totalCharge =
        this.bill.waterCharge +
        this.bill.electricityCharge +
        this.baseData.price;
    },
    onElectricityStartChange(e) {
      let electricityStart = e.detail.value;
      let electricityEnd = this.bill.electricityEnd;
      if (electricityEnd < electricityStart) {
        electricityEnd = electricityEnd + 10000;
      }
      this.bill.electricityUsage = electricityEnd - electricityStart;
      this.bill.electricityCharge =
        this.bill.electricityUsage * this.baseData.electricityPrice;
      this.bill.totalCharge =
        this.bill.waterCharge +
        this.bill.electricityCharge +
        this.baseData.price;
    },
    startDateChange(e) {
      this.bill.startDate = e.detail.value;
    },
    endDateChange(e) {
      this.bill.endDate = e.detail.value;
    },
    save() {
      this.loadingModal = true;
      this.loadingMessage = "保存中";
      this.request
        .post("/bill/fillBill", this.bill)
        .then((response) => {
          this.loadingModal = false;
          this.modal.confirAction = "SUCCESS";
          this.modal.title = "保存成功";
          this.modal.message = [response.message];
          this.modalShow = true;
        })
        .catch((err) => {
          this.loadingModal = false;
          this.modal.confirAction = "FAIL";
          this.modal.title = "保存失败";
          this.modal.message = [err];
          this.modalShow = true;
        });
      setTimeout(() => {}, 1000);
    },
    confirmAction() {
      this.modalShow = false;
      if (this.modal.confirAction === "SUCCESS") {
        uni.redirectTo({
          url: `/pages/admin/billDetails/billDetails?id=${this.bill.billId}`,
        });
      }
    },
  },
  onShow() {},
  onLoad(param) {
    this.today = dayjs().format("M月D日");
    this.roomId = param.roomId;
    this.getBillData();
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
  },
};
</script>

<style>
</style>