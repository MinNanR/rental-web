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
      imageUrl: "http://minnan.site:2000/receipt/88.png",
    };
  },
  onLoad(params) {
    this.imageUrl = `http://minnan.site:2000/receipt/${params.id}.png`
  },
};
</script>

<style>
</style>