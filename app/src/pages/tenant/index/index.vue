<template>
  <view class="">
    <home v-show="curPage === 'home'"></home>
    <info v-show="curPage === 'info'"></info>
    <view class="box">
      <view class="cu-bar tabbar bg-white foot">
        <view class="action" @click="switchPage('home')">
          <view class="cuIcon-cu-image">
            <image
              src="/static/tabbar/home_selected.png"
              v-if="curPage === 'home'"
            ></image>
            <image src="/static/tabbar/home.png" v-else></image>
          </view>
          <view :class="curPage === 'home' ? 'text-blue' : ''">首页</view>
        </view>
        <view class="action" @click="switchPage('info')">
          <view class="cuIcon-cu-image">
            <image
              src="/static/tabbar/info_selected.png"
              v-if="curPage === 'info'"
            ></image>
            <image src="/static/tabbar/info.png" v-else></image>
          </view>
          <view :class="curPage === 'info' ? 'text-blue' : ''">我的</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import home from "./home.vue";
import info from "./info.vue";

export default {
  components: {
    home: home,
    info: info,
  },
  data() {
    return {
      curPage: "home",
    };
  },
  methods: {
    switchPage(page) {
      this.curPage = page;
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
};
</script>

<style>
</style>