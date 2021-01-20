<template>
  <view class="page"> roomList </view>
</template>

<script>
export default {
  data() {
    return {
      id: 0,
    };
  },
  methods:{
    getRoomList(){
      console.log(this.id);
    }
  },
  onLoad(params) {
    this.id = params.id;
    this.getRoomList()
  },
};
</script>

<style>
</style>