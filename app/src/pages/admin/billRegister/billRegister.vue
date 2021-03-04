<template>
  <view class="">
    <view class="margin padding bg-white">
      <view class="text-xl" style="font-weight: 700"> 水电明细 </view>
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
              @input="onElectricityChange"
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
      <view class="text-xl" style="font-weight: 700"> 账单明细 </view>
      <view class="padding-top font-size-17 text-center">
        <view class="flex bg-cyan" style="">
          <view class="flex-sub padding solid"> 收款项 </view>
          <view class="flex-sub padding solid"> 数量 </view>
          <view class="flex-sub padding solid"> 收费(元) </view>
        </view>
        <view class="flex bg-white" v-if="bill.typeCode === 'CHECK_IN'">
          <view class="flex-sub padding solid"> 门禁卡 </view>
          <view class="flex-sub padding solid"> 张 </view>
          <view class="flex-sub padding solid"> </view>
        </view>
        <view class="flex bg-white" v-if="bill.typeCode === 'CHECK_IN'">
          <view class="flex-sub padding solid"> 押金</view>
          <view class="flex-sub padding solid"> / </view>
          <view class="flex-sub padding solid"> </view>
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
  </view>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
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
        waterEnd: 0,
        electricityStart: 0,
        electricityEnd: 0,
      },
      waterCharge: 0,
    };
  },
  methods: {
    getBillData() {
      this.request
        .post("/bill/getBillData", { roomId: this.roomId })
        .then((response) => {
          let { data } = response;
          this.baseData = data;
          this.bill.waterEnd = data.waterStart;
          this.bill.electricityEnd = data.electricityStart;
          this.bill.waterStart = data.waterStart;
          this.bill.electricityStart = data.electricityStart;
          this.bill.today = dayjs().format("M月DD日");
        });
    },
    onWaterEndChange(e) {
      let waterEnd = e.detail.value;
      this.bill.waterUsage = waterEnd - this.baseData.waterStart;
      console.log(this.bill.waterUsage * this.baseData.waterPrice);
      this.bill.waterCharge = this.bill.waterUsage * this.baseData.waterPrice;
      this.bill.totalCharge =
        this.bill.waterCharge +
        this.bill.electricityCharge +
        this.baseData.price;
    },
    onElectricityEndChange(e) {
      let electricityEnd = e.detail.value;
      this.bill.electricityUsage =
        electricityEnd - this.baseData.electricityStart;
      this.bill.electricityCharge =
        this.bill.electricityUsage * this.baseData.electricityPrice;
      this.bill.totalCharge =
        this.bill.waterCharge +
        this.bill.electricityCharge +
        this.baseData.price;
    },
    onWaterStartChange(e) {
      let waterStart = e.detail.value;
      this.bill.waterUsage = this.bill.waterEnd - waterStart;
      console.log(this.bill.waterUsage * this.baseData.waterPrice);
      this.bill.waterCharge = this.bill.waterUsage * this.baseData.waterPrice;
      this.bill.totalCharge =
        this.bill.waterCharge +
        this.bill.electricityCharge +
        this.baseData.price;
    },
    onWaterStartChange(e) {
      let electricityStart = e.detail.value;
      this.bill.electricityUsage = this.bill.electricityEnd - electricityStart;
      console.log(this.bill.electricityUsage * this.baseData.electricityPrice);
      this.bill.electricityCharge =
        this.bill.electricityUsage * this.baseData.electricityPrice;
      this.bill.totalCharge =
        this.bill.waterCharge +
        this.bill.electricityCharge +
        this.baseData.price;
    },
  },
  onShow() {},
  onLoad(param) {
    this.today = dayjs().format("M月D日");
    this.roomId = param.roomId;
    this.getBillData();
  },
};
</script>

<style>
</style>