<template>
  <view class="">
    <view class="cu-card">
      <view
        class="cu-item bg-img shadow"
        v-for="(item, index) in recordList"
        :key="index"
        style="margin: 10px 10px"
        @click="refer(index)"
      >
        <view style="border-radius: 15px" :class="'bg-' + colorList[index % 4]">
          <view class="cardTitle text-center padding" style="font-size: 20px">
            {{ item.name }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recordList: [],
      queryForm: {
        pageSize: 10,
        pageIndex: 1,
      },
      colorList: ["red", "blue", "yellow", "green"],
    };
  },
  methods: {
    getRecordList() {
      //TODO 无限加载
      this.request
        .post("/utility/getRecordList", this.queryForm)
        .then((response) => {
          let { data } = response;
          this.recordList = data.list;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    refer(index) {
      let { houseId, date, name } = this.recordList[index];
      uni.navigateTo({
        url: `/pages/utilityList/utilityList`,
        success(res) {
          res.eventChannel.emit("acceptData", {
            houseId: houseId,
            date: date,
            name: name,
          });
        },
      });
    },
  },
  onShow() {
    this.getRecordList();
  },
};
</script>

<style>
.cu-card > .cu-item {
  padding: 0;
}
</style>