<template>
  <view class="">
    <view v-for="(item, index) in billList" :key="index">
      <view
        class="cu-list menu-avatar comment solids-top"
        @click="refer(item.id)"
      >
        <view class="cu-item">
          <view
            class="cu-avatar round bg-olive"
            v-if="item.typeCode === 'CHECK_IN'"
          >
            <view class="">
              <span
                class="iconfont icon-checkin text-white"
                style="font-size: 20px"
              ></span>
            </view>
          </view>
          <view
            class="cu-avatar round bg-blue"
            v-if="item.typeCode === 'MONTHLY'"
          >
            <text class="cuIcon-calendar" style="font-size-20"></text>
          </view>
          <view class="content">
            <view
              style="font-size: 17px; font-weight: 700"
              v-if="item.typeCode === 'CHECK_IN'"
              >入住账单</view
            >
            <view
              style="font-size: 17px; font-weight: 700"
              v-if="item.typeCode === 'MONTHLY'"
            >
              {{ item.time }}账单
            </view>
            <view class="text-gray text-content text-df">
              <view class="flex">
                <view class="basis-sm padding-lr-sm paddingrb-xs">
                  结算日期
                </view>
                <view class="bssis-lg padding-rb-xs">
                  {{ item.updateTime }}
                </view>
              </view>
            </view>
            <view class="text-gray text-content text-df">
              <view class="flex">
                <view class="basis-sm padding-lr-sm paddingrb-xs"> 状态 </view>
                <view class="bssis-lg padding-rb-xs">
                  {{ item.status }}
                </view>
              </view>
            </view>
          </view>
          <view class="action">
            <view class="text-blue" style="font-size: 17px"
              >{{ item.totalCharge }}元</view
            >
          </view>
        </view>
      </view>
      <!-- <view class="flex">
            <view class="flex-treble"> </view>
            <view class="flex-sub"> 123 </view>
          </view> -->
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
        pageSize: 10,
        pageIndex: 1,
      },
      showLoading: false,
      haveMore: true,
    };
  },
  methods: {
    getTenantBill() {
      this.showloading = true;
      this.request
        .post("/bill/getTenantBill", this.queryForm)
        .then((response) => {
          let { data } = response;
          if (this.queryForm.pageIndex === 1) {
            this.billList = data.list;
          } else {
            this.billList = this.billList.concat(data.list);
          }
          this.haveMore = this.billList.length < data.totalCount;
          this.queryForm.pageIndex = this.queryForm.pageIndex + 1;
          setTimeout(() => {
            this.showloading = false;
          }, 1500);
        });
    },
    refer(id) {
      uni.navigateTo({
        url: `/pages/tenant/billDetails/billDetails?id=${id}`,
      });
    },
  },
  onShow() {
    this.getTenantBill();
  },
  onPullDownRefresh() {
    this.queryForm.pageIndex = 1;
    this.getTenantBill();
  },
  onReachBottom() {
    this.getTenantBill(); 
  },
};
</script>

<style>
</style>