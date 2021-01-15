<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view>
      <text class="title">{{ title }}</text>
    </view>
    <button class="cu-btn bg-purple" @click="clickMethod()">跳转</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "hi",
    };
  },
  onLoad() {},
  methods: {
    clickMethod() {
      uni.navigateTo({
        url: "/pages/login/login",
        fail: (err) => {
          console.log(err);
        },
      });
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
