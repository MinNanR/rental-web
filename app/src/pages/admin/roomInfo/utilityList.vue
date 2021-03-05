<template>
  <view class="">
    <scroll-view
      scroll-y
      class="scroll"
      refresher-enabled
      :refresher-triggered="triggered"
      @refresherrefresh="onRefresh"
      @scrolltolower="onScrollToLower"
    >
      <view class="flex bg-cyan" style="">
        <view class="flex-twice padding solid"> 时间 </view>
        <view class="flex-sub padding solid"> 水表行度 </view>
        <view class="flex-sub padding solid"> 电表行度 </view>
      </view>
      <view
        v-for="(item, index) in utilityList"
        :key="index"
        class="flex bg-white"
      >
        <view class="flex-twice padding solid" style="font-size: 15px">
          <view
            class="cu-tag badge"
            v-if="item.statusCode === 'RECORDING'"
            style="top: 0"
            >当前行度</view
          >
          {{ item.updateTime }}
        </view>
        <view class="flex-sub padding solid"> {{ item.water }}度 </view>
        <view class="flex-sub padding solid"> {{ item.electricity }}度 </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import dayjs from "dayjs";

export default {
  props: ["roomId", "houseId", "roomNumber", "houseName"],
  data() {
    return {
      barHeight: 0,
      queryForm: {
        pageSize: 10,
        pageIndex: 1,
      },
      utilityList: [],
      showLoading: false,
      haveMore: true,
      utilityForm: {
        water: null,
        electricity: null,
        id: null,
      },
      registerModal: false,
      loadingModal: false,
      colorList: ["color-0", "color-1"],
      updateModal: false,
      title: "",
      triggered: false,
      _freshing: false,
    };
  },
  methods: {
    getUtilityList() {
      this.queryForm.roomId = Number(this.roomId);
      this.showLoading = true;
      this.request
        .post("/utility/getUtilityList", this.queryForm)
        .then((response) => {
          let { data } = response;
          setTimeout(() => {
            if (this.queryForm.pageIndex === 1) {
              this.utilityList = data.list;
            } else {
              this.utilityList = this.utilityList.concat(data.list);
            }
            this.haveMore = this.utilityList.length < data.totalCount;
            this.queryForm.pageIndex = this.queryForm.pageIndex + 1;
            this.showLoading = false;
          }, 500);
        });
    },
    showRegisterModal() {
      this.utilityForm = {
        water: null,
        electricity: null,
      };
      this.registerModal = true;
    },
    hideRegisterModal() {
      this.registerModal = false;
    },
    register() {
      this.registerModal = false;
      let index = this.utilityList.findIndex(
        (e) => e.statusCode == "RECORDING"
      );
      let current = this.utilityList[index];
      if (this.utilityForm.water == null || this.utilityForm.water == "") {
        this.utilityForm.water = current.water;
      }
      if (
        this.utilityForm.electricity == null ||
        this.utilityForm.electricity == ""
      ) {
        this.utilityForm.electricity = current.electricity;
      }
      this.utilityForm.roomId = this.id;
      this.utilityForm.roomNumber = this.roomNumber;
      this.utilityForm.houseId = this.houseId;
      this.utilityForm.houseName = this.houseName;
      this.$nextTick(() => {
        this.loadingModal = true;
        this.request
          .post("/utility/recordUtility/single", this.utilityForm)
          .then((response) => {
            this.queryForm.pageIndex = 1;
            this.getUtlityList();
            this.$nextTick(() => {
              this.loadingModal = false;
            });
          });
      });
    },
    showUpdateModal() {
      let index = this.utilityList.findIndex(
        (e) => e.statusCode === "RECORDING"
      );
      let { water, electricity, time, id } = this.utilityList[index];
      this.title = dayjs(time).format("YYYY年M月D日") + "水电行度";
      this.utilityForm = {
        water: water,
        electricity: electricity,
        id: id,
      };
      this.updateModal = true;
    },
    hideUpdateModal() {
      this.updateModal = false;
    },
    onRefresh() {
      if (this._freshing) return;
      this._freshing = true;
      if (!this.triggered) this.triggered = true;
      this.queryForm.pageIndex = 1;
      this.getUtilityList();
    },
    onRestore() {
      this.triggered = false; // 需要重置
    },
    onScrollToLower() {
      if (this.haveMore) {
        this.getUtilityList();
      }
    },
  },
  mounted() {
    this.queryForm.pageIndex = 1;
    this.getUtilityList();
  },
  onReachBottom() {
    if (!this.haveMore) {
      this.showLoading = true;
      setTimeout(() => {
        this.showLoading = false;
      }, 2000);
    }
    this.getUtilityList();
  },
};
</script>

<style>
.scroll {
  height: 80vh;
}
</style>