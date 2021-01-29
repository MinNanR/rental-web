<template>
  <view class="">
    <view class="block">
      <view class="cu-bar search bg-withe status-bar">
        <view class="content"> 水电 </view>
        <view
          class="action padding-xs"
          style="margin-right: 0"
          @click="toRecordUtility()"
        >
          <text
            class="cuIcon-roundadd margin-right-xs"
            style="font-size: 32px"
          ></text>
        </view>
      </view>
    </view>
    <view class="cu-card">
      <view
        class="cu-item bg-img shadow"
        v-for="(item, index) in recordList"
        :key="index"
        style="margin: 10px 10px"
        @click="refer(index)"
      >
        <view
          style="border-radius: 15px"
          :class="'light bg-' + colorList[index % colorList.length]"
        >
          <view class="cardTitle text-center padding" style="font-size: 20px">
            {{ item.name }}
          </view>
        </view>
      </view>
    </view>
    <view
      class="cu-load bg-gray fade"
      v-show="showLoading"
      :class="haveMore ? 'loading' : 'over'"
    ></view>
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
      colorList: ["red", "blue"],
      haveMore: true,
      showLoading: false,
    };
  },
  methods: {
    getRecordList() {
      this.showLoading = true;
      this.request
        .post("/utility/getRecordList", this.queryForm)
        .then((response) => {
          let { data } = response;
          setTimeout(() => {
            if (this.queryForm.pageIndex == 1) {
              this.recordList = data.list;
            } else {
              this.recordList = this.recordList.concat(data.list);
            }
            this.queryForm.pageIndex = this.queryForm.pageIndex + 1;
            this.haveMore = this.recordList.length < data.totalCount;
            this.showLoading = false;
          }, 1000);
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
    toRecordUtility() {
      uni.navigateTo({ url: "/pages/recordUtility/recordUtility" });
    },
  },
  onShow() {
    this.getRecordList();
  },
  onReachBottom() {
    if (!this.haveMore) {
      this.showLoading = true;
      setTimeout(() => {
        this.showLoading = false;
      }, 2000);
      return;
    }
    this.getRecordList();
  },
};
</script>

<style>
.cu-card > .cu-item {
  padding: 0;
}

.status-bar {
  margin-top: var(--status-bar-height);
}

.a {
  background: #ffffff;
}
</style>