<template>
  <view class="">
    <view class="padding-top">
      <view v-for="(item, index) in billList" :key="index">
        <view
          class="cu-card article"
          style="margin-left: 0px;margin-right 0px;margin-top: 0px;margin-bottom: 0px"
        >
          <view
            class="cu-item shadow card"
            style="padding-bottom: 0; margin: 0px 15px 10px 15px"
          >
            <view
              class="title light flex justify-between"
              :class="'bg-' + statusColor[item.statusCode]"
              @click="refer(item.id)"
              ><view class="text-cut font-size-20"
                >{{ item.roomNumber }}号房
                <block v-if="item.typeCode === 'CHECK_IN'">入住账单</block>
                <block v-if="item.typeCode === 'MONTHLY'"
                  >{{ item.time }}账单</block
                >
              </view>
              <view class="">
                {{ item.status }}
                <text class="cuIcon-right text-xl"></text> </view
            ></view>
            <view class="font-size-17 padding-xs">
              <view class="flex">
                <view class="basis-sm padding-lr-sm padding-rb-xs">
                  结算日期
                </view>
                <view class="basis-lg padding-rb-xs">
                  {{ item.updateTime }}
                </view>
              </view>
              <view class="flex">
                <view class="basis-sm padding-lr-sm paddingrb-xs">
                  应缴总费用
                </view>
                <view class="bssis-lg padding-rb-xs">
                  {{ item.totalCharge }}
                </view>
              </view>
            </view>
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
      billList: [],
      queryForm: {
        pageIndex: 1,
        pageSize: 10,
      },
      statusColor: {
        PAID: "green",
        UNPAID: "red",
        UNCONFIRMED: "grey",
      },
      showLoading: false,
      haveMore: true,
    };
  },
  methods: {
    getBillList() {
      this.showLoading = true;
      this.request
        .post("/bill/getBillList", this.queryForm)
        .then((response) => {
          let { data } = response;
          if (this.queryForm.pageIndex === 1) {
            this.billList = data.list;
          } else {
            this.billList = this.billList.concat(data.list);
          }
          this.haveMore = this.billList.length < data.totalCount;
          this.showLoading = false;
          this.queryForm.pageIndex = this.queryForm.pageIndex + 1;
        });
    },
    refer(id) {
      uni.navigateTo({
        url: `/pages/admin/billDetails/billDetails?id=${id}`,
      });
    },
  },
  onShow() {
    this.getBillList();
  },
  onPullDownRefresh() {
    this.billList = [];
    this.getBillList();
  },
  mounted() {
    this.billList = []
  },
};
</script>

<style>
</style>