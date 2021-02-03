<template>
  <view class="">
    <!-- <view v-for="(item, index) in utilityList" :key="index">
      <view
        class="cu-card article"
        style="margin-left: 0px;margin-right 0px;margin-top: 0px;margin-bottom: 0px"
      >
        <view
          class="cu-item shadow card"
          style="padding-bottom: 0; margin: 0px 15px 10px 15px"
        >
          <view
            class="title light"
            :class="'bg-' + colorList[index % colorList.length]"
            ><view class="text-cut font-size-20">{{ item.room }}</view></view
          >
          <view class="font-size-17 padding-xs">
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
    </view> -->
    <view class="padding-top font-size-17 text-center">
      <view class="flex bg-cyan" style="">
        <view class="flex-sub padding solid"> 房号 </view>
        <view class="flex-sub padding solid"> 水表行度 </view>
        <view class="flex-sub padding solid"> 电表行度 </view>
      </view>
      <view
        v-for="(item, index) in utilityList"
        :key="index"
        class="flex bg-white"
      >
        <view class="flex-sub padding solid" style="font-size: 15px">
          {{ item.roomNumber }}
        </view>
        <view class="flex-sub padding solid"> {{ item.water }}度 </view>
        <view class="flex-sub padding solid"> {{ item.electricity }}度 </view>
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
      queryForm: {
        houseId: "",
        date: "",
        pageSize: 15,
        pageIndex: 1,
      },
      haveMore: true,
      utilityList: [],
      colorList: ["color-1", "color-0"],
      showLoading: false,
    };
  },
  methods: {
    getUtilityList() {
      this.showLoading = true;
      this.request
        .post("/utility/getUtilityList", this.queryForm)
        .then((response) => {
          let { data } = response;
          setTimeout(() => {
            if (this.queryForm.pageIndex == 1) {
              this.utilityList = data.list;
            } else {
              this.utilityList = this.utilityList.concat(data.list);
            }
            this.queryForm.pageIndex = this.queryForm.pageIndex + 1;
            this.haveMore = this.utilityList.length < data.totalCount;
            this.showLoading = false;
          }, 500);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  onLoad(params) {
    this.queryForm.houseId = params.houseId;
    this.queryForm.date = params.date;
    uni.setNavigationBarTitle({
      title: params.name,
    });
  },
  onShow() {
    this.utilityList = []
    this.$nextTick(() => {
      this.getUtilityList();
    });
  },
  onReachBottom() {
    if (!this.haveMore) {
      this.showLoading = true;
      setTimeout(() => {
        this.showLoading = false;
      }, 500);
    }
    this.getUtilityList();
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

.card {
  box-shadow: 5px 5px 3px 3px #909090;
}

.color-0 {
  background-color: #f0f0f0;
}

.color-1 {
  background-color: #d3d3d3;
}
</style>