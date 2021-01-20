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
      <view
        class="paid-bill-container"
        v-for="(item, index) in billList"
        :key="item.id"
      >
        <view
          :class="item.className"
          @click="showContent(index)"
          style="font-size: 16px"
        >
          <view class="padding-sm margin-xs">
            房号：{{ item.roomNumber }}
          </view>
          <view class="padding-sm margin-xs">
            缴费{{ item.totalCharge }}元
          </view>
        </view>
        <view
          v-show="item.show"
          class="grid col-2 bg-gray"
          style="font-size: 14px"
        >
          <view class="padding-xs"> 居住人：{{ item.livingPeople }} </view>
          <view class="padding-xs"> 账单时间：{{ item.time }} </view>
          <view class="padding-xs"> 支付时间：{{ item.payTime }} </view>
          <view class="padding-xs"> 支付方式：{{ item.paymentMethod }} </view>
          <view class="padding-xs"> 水费：{{ item.waterCharge }}元 </view>
          <view class="padding-xs"> 电费：{{ item.electricityCharge }}元 </view>
          <view class="padding-xs"> 房租：{{ item.rent }}元 </view>
          <view class="padding-xs" style="color: blue" @click="refer(item.id)">
            详情
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      billList: [],
      queryForm: {
        pageIndex: 1,
        pageSize: 15,
      },
      expandClass: "flex solid-bottom justify-between expand",
      collapseClass: "flex solid-bottom justify-between",
      triggered: false,
      _freshing: false,
      haveMore: true,
    };
  },
  methods: {
    getBillList(pageIndex) {
      this.queryForm.pageIndex = pageIndex;
      this.request
        .post("/bill/getBillList/paid", this.queryForm)
        .then((response) => {
          let { data } = response;
          data.list.forEach((e) => {
            e.show = false;
            e.className = this.collapseClass;
          });
          if (this.queryForm.pageIndex === 1) {
            this.billList = data.list;
          } else {
            data.list.forEach((e) => this.billList.push(e));
          }
          if (this.billList.length === data.totalCount) {
            this.haveMore = false;
          }
          this.triggered = false;
          this._freshing = false;
        });
    },
    showContent(index) {
      this.billList[index].show = !this.billList[index].show;
      this.billList[index].className = this.billList[index].show
        ? this.expandClass
        : this.collapseClass;
    },
    onRefresh() {
      if (this._freshing) return;
      this._freshing = true;
      if (!this.triggered) this.triggered = true;
      this.getBillList(1);
    },
    onRestore() {
      this.triggered = false; // 需要重置
    },
    onScrollToLower() {
      if (this.haveMore) {
        this.getBillList(this.queryForm.pageIndex + 1);
      }
    },
    refer(id) {
      uni.navigateTo({
        url: `/pages/billDetails/billDetails?id=${id}`,
      });
    },
  },
  mounted() {
    this.getBillList(1);
  },
};
</script>

<style>
.paid-bill-container {
  border-bottom: solid 1px #e7e7e7;
}

.expand {
  color: #7dadff;
}

.scroll {
  height: 80vh;
}
</style>