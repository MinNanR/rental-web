<template>
  <view class="page">
    {{ roomInfo }}
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      roomInfo: {},
    };
  },
  methods: {
    getRoomInfo() {
      this.request
        .post("/room/getRoomInfo", { id: this.id })
        .then((response) => {
          let { data } = response;
          this.roomInfo = data;
          uni.setNavigationBarTitle({
            title: `${data.houseName}-${data.roomNumber}`,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  onLoad(params) {
    this.id = params.roomId;
    this.getRoomInfo();
  },
};
</script>

<style>
</style>