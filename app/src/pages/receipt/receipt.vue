<template>
  <view class="">
    <cover-image
      class="controls-play img receipt"
      @click="play"
      :src="imageUrl"
    ></cover-image>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      imageUrl: "",
    };
  },
  onLoad(params) {
     this.imageUrl = JSON.parse(decodeURIComponent(params.url))
  },
};
</script>

<style>
</style>