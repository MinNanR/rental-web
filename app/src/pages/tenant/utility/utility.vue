<template>
  <view class="">
    水电
    <view class="">
      {{ roomId }}
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      roomId: "",
    };
  },
  onLoad(params) {
    this.roomId = params.roomId;
  },
};
</script>

<style>
</style>