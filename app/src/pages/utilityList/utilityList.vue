<template>
  <view class="">
    <view v-for="(item, index) in utilityList" :key="index">
      <view
        class="cu-card article"
        style="margin-left: 0px;margin-right 0px;margin-top: 0px;margin-bottom: 0px"
      >
        <view
          class="cu-item shadow"
          style="padding-bottom: 0; margin: 0px 15px 10px 15px"
        >
          <view class="title" :class="'bg-' + colorList[index % 4]"
            ><view
              class="text-cut font-size-20"
              :class="' text-' + colorList[(index + 1) % 4]"
              >{{ item.room }}</view
            ></view
          >
          <view class="font-size-17" :class="'bg-' + colorList[index % 4]">
            <view class="flex">
              <view class="basis-sm padding-lr-sm padding-rb-xs">
                水表计数：
              </view>
              <view class="basis-lg padding-rb-xs">
                {{ item.water }}
              </view>
            </view>
            <view class="flex">
              <view class="basis-sm padding-lr-sm padding-rb-xs">
                电表计数：
              </view>
              <view class="basis-lg padding-rb-xs">
                {{ item.electricity }}
              </view>
            </view>
            <view class="flex">
              <view class="basis-sm padding-lr-sm padding-rb-xs">
                记录人：
              </view>
              <view class="basis-lg padding-rb-xs">
                {{ item.updateUserName }}
              </view>
            </view>
            <view class="flex">
              <view class="basis-sm padding-lr-sm padding-rb-xs">
                记录时间：</view
              >
              <view class="basis-lg padding-rb-xs">
                {{ item.updateTime }}
              </view>
            </view>
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
      queryForm: {
        houseId: "",
        date: "",
        pageSize: 10,
        pageIndex: 1,
      },
      utilityList: [],
      colorList: ["red", "blue", "yellow", "green"],
    };
  },
  methods: {
    getUtilityList() {
      // TODO 无限加载
      this.request
        .post("/utility/getUtilityList", this.queryForm)
        .then((response) => {
          let { data } = response;
          this.utilityList = data.list;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  onLoad(params) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptData", (data) => {
      this.queryForm.houseId = data.houseId;
      this.queryForm.date = data.date;
      uni.setNavigationBarTitle({
        title: data.name,
      });
    });
  },
  onShow() {
    this.$nextTick(() => {
      this.getUtilityList();
    });
  },
};
</script>

<style>
.font-size-20 {
  font-size: 20px;
}

.font-size-17 {
  font-size: 17px;
}
</style>