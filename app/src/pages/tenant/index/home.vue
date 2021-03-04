<template>
  <view class="">
    <view class="flex margin-top" style="background: #ffffff">
      <view
        class="basis-sub padding text-center flex align-center"
        style="height: 102px"
      >
        <view class="cu-avatar round lg">{{ baseInfo.firstPinyinLetter }}</view>
      </view>
      <view>
        <view class="padding-sm-lr padding-top text-xxl">
          你好，{{ baseInfo.name }}
        </view>
        <view class="padding-sm-lr padding-top-sm text-lg">
          房号：{{ baseInfo.roomNumber }}
        </view>
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
        <view class="padding solid flex align-center text-center bg-red" style="height: 120px">
          我的账单
        </view>
        <view class="padding solid flex align-center bg-blue" style="height: 120px"
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
    getTenantBill() {
      this.request
        .post("/bill/getTenantBill", this.queryForm)
        .then((response) => {
          let { data } = response;
          this.billList = data.list;
        });
    },
  },
  mounted() {
    this.getBaseInfo();
    this.getTenantBill();
  },
  onReachBottom() {
    console.log("123");
  },
};
</script>

<style>
</style>