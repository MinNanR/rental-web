<template>
  <view class="">
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
          <view
            class="padding solid flex align-center bg-red light"
            style="height: 120px; font-size: 20px"
            @click="toBillList()"
          >
            我的账单
          </view>
          <view
            class="padding solid flex align-center bg-blue light"
            style="height: 120px; font-size: 20px"
            @click="toUtility()"
            >水电记录</view
          >
        </view>
      </view>
    </view>
    <view class="box">
      <view class="cu-bar tabbar bg-white foot">
        <view class="action">
          <view class="cuIcon-cu-image">
            <image src="/static/tabbar/home_selected.png"></image>
          </view>
          <view class="text-blue">首页</view>
        </view>
        <view class="action" @click="switchPage()">
          <view class="cuIcon-cu-image">
            <image src="/static/tabbar/info.png"></image>
          </view>
          <view>我的</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      baseInfo: {},
    };
  },
  methods: {
    switchPage() {
      uni.redirectTo({ url: "/pages/tenant/info/info" });
    },
    getBaseInfo() {
      this.request.post("/tenant/getBaseInfo", {}).then((response) => {
        let { data } = response;
        this.baseInfo = data;
      });
    },
    toBillList() {
      uni.navigateTo({ url: "/pages/tenant/billList/billList" });
    },
    toUtility() {
      uni.navigateTo({ url: `/pages/tenant/utility/utility?roomId=${this.baseInfo.roomId}` });
    },
  },
  onLoad() {
    // #ifdef MP-WEIXIN
    uni.authorize({
      scope: "scope.writePhotosAlbum",
      success(a, b, c) {
        console.log(a, b, c);
      },
    });
    // #endif
  },
  onShow() {
    this.getBaseInfo();
  },
};
</script>

<style>
</style>