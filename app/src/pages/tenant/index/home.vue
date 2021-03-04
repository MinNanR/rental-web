<template>
  <view class="">
    <view class="flex margin-top" style="background: #ffffff">
      <view
        class="basis-sub padding text-center flex align-center"
        style="height: 102px"
      >
        <view class="cu-avatar round lg">{{ baseInfo.roomNumber }}</view>
      </view>
      <view>
        <view class="padding-sm-lr padding-top text-xxl">
          你好，{{ baseInfo.name }}
        </view>
        <!-- <view class="padding-sm-lr padding-top-sm text-lg">
          房号：{{ baseInfo.roomNumber }}
        </view> -->
        <view class="padding-sm-lr padding-top-sm text-lg">
          入住日期：{{ baseInfo.checkInDate }}
        </view>
        <view class="padding-sm-lr padding-tb-sm text-lg">
          已入住 {{ baseInfo.checkInDays }} 天
        </view>
      </view>
    </view>
    <view class="padding-top">
      <view class="grid col-3 bg-white">
        <view class="padding solid flex align-center bg-red light" style="height: 120px" @click="toBillList()">
          我的账单
        </view>
        <view class="padding solid flex align-center bg-blue light" style="height: 120px"
          >水电记录</view
        >
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      baseInfo: {
        // name: "张三",
        // firstPinyinLetter: "Z",
        // roomNumber: "203",
        // checkInDate: "2021年1月3日",
        // checkInDays: 60,
      },
      billList: [{}],
      queryForm: {
        pageSize: 10,
        pageIndex: 1,
      },
    };
  },
  methods: {
    getBaseInfo() {
      this.request.post("/tenant/getBaseInfo", {}).then((response) => {
        let { data } = response;
        this.baseInfo = data;
      });
    },
    toBillList(){
      uni.navigateTo({url:"/pages/tenant/billList/billList"})
    }
  },
  mounted() {
    this.getBaseInfo();
    // this.getTenantBill();
  },
  onReachBottom() {
    console.log("123");
  },
};
</script>

<style>
</style>