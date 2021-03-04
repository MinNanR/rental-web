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
            {{ baseData.waterStart }}
          </view>
          <view class="flex-sub padding solid">
            {{ baseData.electricityStart }}
          </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid">
            3月5日</view
          >
          <view class="flex-sub padding solid">
            <input type="number">
          </view>
          <view class="flex-sub padding solid">
            <input type="number">
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
          <view class="flex-sub padding solid">
           张
          </view>
          <view class="flex-sub padding solid">
            
          </view>
        </view>
        <view class="flex bg-white" v-if="bill.typeCode === 'CHECK_IN'">
          <view class="flex-sub padding solid"> 押金</view>
          <view class="flex-sub padding solid"> / </view>
          <view class="flex-sub padding solid"> </view>
        </view>

        <view class="flex bg-white" v-if="bill.typeCode === 'MONTHLY'">
          <view class="flex-sub padding solid"> 水 </view>
          <view class="flex-sub padding solid"> {{ bill.waterUsage }}度 </view>
          <view class="flex-sub padding solid"> {{ bill.waterCharge }} </view>
        </view>
        <view class="flex bg-white" v-if="bill.typeCode === 'MONTHLY'">
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
          <view class="flex-sub padding solid"> {{ bill.rent }} </view>
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
export default {
  data() {
    return {
      roomId: "",
      baseData: {},
      bill:{}
    };
  },
  methods: {
    getBillData() {
      this.request
        .post("/bill/getBillData", { roomId: this.roomId })
        .then((response) => {
          let { data } = response;
          this.baseData = data;
        });
    },
  },
  onShow() {},
  onLoad(param) {
    console.log(param.roomId);
    this.roomId = param.roomId;
    this.getBillData();
  },
};
</script>

<style>
</style>