<template>
  <view class="">
    <scroll-view scroll-x class="bg-white nav">
      <view class="flex text-center">
        <view class="cu-item flex-sub" @click="toInfo()"> 房间信息 </view>
        <view class="cu-item flex-sub text-blue cur"> 房间账单 </view>
        <view class="cu-item flex-sub" @click="toUtilityRecord()">
          水电记录
        </view>
      </view>
    </scroll-view>
    <!-- <view class="flex justify-center">
      <view class="basis-sub padding-lr" style="width: 50%">
        <button
          class="cu-btn bg-gray lg"
          style="width: 100%"
          @click="lastRoom()"
        >
          <text class="cuIcon-back"></text>
          上一间
        </button>
      </view>
      <view class="basis-sub padding-lr" style="width: 50%">
        <button
          class="cu-btn bg-gray lg"
          style="width: 100%"
          @click="nextRoom()"
        >
          下一间
          <text class="cuIcon-right"></text>
        </button>
      </view>
    </view> -->
    <view :style="'padding-bottom: ' + barHeight + 'px'">
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
                >{{ item.time }}入住账单</view
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
                  <view class="basis-sm padding-lr-sm paddingrb-xs">
                    状态
                  </view>
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
      </view>
    </view>
    <view class="box">
      <view
        class="cu-bar tabbar btn-group foot bg-white"
        id="box"
        v-if="roomInfo.statusCode === 'ON_RENT'"
      >
        <block>
          <button
            class="cu-btn bg-green shadow-blur round lg"
            @click="toBillRegister()"
          >
            填写月度账单
          </button>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      roomInfo: {},
      billList: [],
      queryForm: {
        pageSize: 10,
        pageIndex: 1,
      },
      haveMore: true,
      showLoading: false,
      barHeight: 0,
    };
  },
  methods: {
    toInfo() {
      uni.redirectTo({
        url: `/pages/admin/roomInfo/roomInfo?roomId=${this.roomInfo.roomId}`,
      });
    },
    toUtilityRecord() {
      uni.redirectTo({
        url: `/pages/admin/roomUtility/roomUtility?roomId=${this.roomInfo.roomId}&roomNumber=${this.roomInfo.roomNumber}&houseId=${this.roomInfo.houseId}&houseName=${this.roomInfo.houseName}&statusCode=${this.roomInfo.statusCode}`,
      });
    },
    toBillRegister() {
      uni.navigateTo({
        url: `/pages/admin/fillBill/fillBill?roomId=${this.roomInfo.roomId}`,
      });
    },
    getRoomBillList() {
      this.showLoading = true;
      let queryForm = this.queryForm;
      queryForm.roomId = this.roomInfo.roomId;
      this.request.post("/bill/getRoomBillList", queryForm).then((response) => {
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
    nextRoom() {
      let roomIdList = this.getStorage("roomIdList");
      let id = parseInt(this.roomInfo.roomId)
      let index = roomIdList.indexOf(id);
      if (index === roomIdList.length - 1) {
        uni.showToast({
          title: "已经是最后一间房间了",
          icon: "none",
        });
        return;
      }
      let nextId = roomIdList[index + 1];
      uni.redirectTo({
        url: `/pages/admin/roomInfo/roomInfo?roomId=${nextId}`,
      });
    },
    lastRoom() {
      let roomIdList = this.getStorage("roomIdList");
      let id = parseInt(this.roomInfo.roomId)
      let index = roomIdList.indexOf(id);
      if (index === 0) {
        uni.showToast({
          title: "已经是第一间房间了",
          icon: "none",
        });
        return;
      }
      let lastId = roomIdList[index - 1];
      uni.redirectTo({
        url: `/pages/admin/roomInfo/roomInfo?roomId=${lastId}`,
      });
    },
  },
  onLoad(params) {
    this.roomInfo = {
      roomId: params.roomId,
      roomNumber: params.roomNumber,
      houseId: params.houseId,
      houseName: params.houseName,
      statusCode: params.statusCode,
    };
    uni.setNavigationBarTitle({
      title: `${params.houseName}-${params.roomNumber}账单`,
    });
    if (this.roomInfo.statusCode === "ON_RENT") {
      this.$nextTick(() => {
        let view = uni.createSelectorQuery().select("#box");
        view
          .fields(
            {
              size: true,
            },
            (data) => {
              this.barHeight = data.height;
            }
          )
          .exec();
      });
    } else {
      this.barHeight = 0;
    }
  },
  onShow() {
    this.queryForm.pageIndex = 1;
    this.getRoomBillList();
  },
  onReachBottom() {
    if (!this.haveMore) {
      this.showLoading = true;
      setTimeout(() => {
        this.showLoading = false;
      }, 2000);
    }
    this.getRoomBillList();
  },
};
</script>

<style>
</style>