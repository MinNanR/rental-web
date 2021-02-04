<template>
  <view class="">
    <view class="" :style="'padding-bottom: ' + barHeight + 'px'">
      <cover-image
        class="controls-play img receipt"
        @click="play"
        :src="imageUrl"
      ></cover-image>
    </view>
    <view class="box">
      <view class="cu-bar tabbar btn-group foot bg-white" id="box">
        <button
          class="cu-btn bg-green shadow-blur round lg"
          @click="saveImage()"
        >
          保存图片
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      imageUrl: "",
      barHeight: 0,
    };
  },
  methods: {
    saveImage() {
      uni.downloadFile({
        url: this.imageUrl, //仅为示例，并非真实的资源
        success: (res) => {
          if (res.statusCode === 200) {
            console.log(res.tempFilePath);
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: (message) => {
                console.log(message);
              },
            });
          }
        },
      });
    },
  },
  onLoad(params) {
    this.imageUrl = JSON.parse(decodeURIComponent(params.url));
    this.$nextTick(() => {
      let view = uni.createSelectorQuery().select("#box");
      view
        .fields(
          {
            size: true,
          },
          (data) => {
            this.barHeight = data.height;
          }
        )
        .exec();
    });
  },
};
</script>

<style>
</style>