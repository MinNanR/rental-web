<template>
  <view class="">
    <view class="" :style="'padding-bottom: ' + barHeight + 'px'">
      <!-- <cover-image
        class="controls-play img receipt"
        @click="play"
        :src="imageUrl"
      ></cover-image> -->
      <view class="uni-padding-wrap uni-common-mt">
        <movable-area scale-area>
          <movable-view
            direction="all"
            scale="true"
            scale-min="1"
            scale-max="4"
            :scale-value="scale"
          >
            <image :src="imageUrl" mode="widthFix"></image>
          </movable-view>
        </movable-area>
      </view>
    </view>
    <view class="box">
      <view class="cu-bar tabbar btn-group foot bg-white" id="box">
        <button
          class="cu-btn bg-green shadow-blur round lg"
          @click="saveImage()"
        >
          保存图片
        </button>
        <!-- #ifdef MP-WEIXIN -->
        <button
          class="cu-btn bg-blue shadow-blur round lg"
          @click="shareImage()"
        >
          分享图片
        </button>
        <!-- #endif -->
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
      uni.authorize({
        scope: "scope.writePhotosAlbum",
        success: () => {
          uni.downloadFile({
            url: this.imageUrl,
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
        fail: (errMsg) => {
          console.error(errMsg);
        },
      });
    },
    // #ifdef MP-WEIXIN
    shareImage() {
      uni.downloadFile({
        url: this.imageUrl,
        success: (res) => {
          wx.showShareImageMenu({
            path: res.tempFilePath,
            success: (message) => {
              console.log(message);
            },
            fail: (err) => {
              console.error(err);
            },
          });
        },
      });
    },
    // #endif
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
movable-view {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height:100%;
}

movable-area {
	height: 100%;
	width: 100%;
	position:fixed;
	overflow: hidden;
}
	
movable-view image{
	width:100%;
}
</style>