<template>
  <view class="">
    <view class="margin-top-xl bg-white">
      <button class="cuBtn" @click="logout()">退出登录</button>
    </view>
    <view class="box">
      <view class="cu-bar tabbar bg-white foot">
        <view class="action" @click="switchPage()">
          <view class="cuIcon-cu-image">
            <image src="/static/tabbar/home.png" ></image>
          </view>
          <view>首页</view>
        </view>
        <view class="action">
          <view class="cuIcon-cu-image">
            <image
              src="/static/tabbar/info_selected.png"
            ></image>
          </view>
          <view class="text-blue">我的</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    logout() {
      uni.navigateTo({
        url: "/pages/login/login",
        success: () => {
          this.removeStorage("token");
        },
      });
    },
    switchPage() {
      uni.redirectTo({ url: "/pages/tenant/index/index" });
    },
  },
};
</script>

<style>
</style>