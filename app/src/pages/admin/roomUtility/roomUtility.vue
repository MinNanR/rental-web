<template>
  <view class="" id="page" :style="'padding-bottom: ' + barHeight + 'px'">
    <scroll-view scroll-x class="bg-white nav">
      <view class="flex text-center">
        <view class="cu-item flex-sub" @click="toInfo()"> 房间信息 </view>
        <view class="cu-item flex-sub" @click="toRoomBill()"> 房间账单 </view>
        <view class="cu-item flex-sub text-blue cur" @click="toUtilityRecord()">
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
    <view class="font-size-17 text-center">
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
    </view>
    <view
      class="cu-load bg-gray fade"
      v-show="showLoading"
      :class="haveMore ? 'loading' : 'over'"
    ></view>
    <view class="box">
      <view class="cu-bar tabbar btn-group foot bg-white lg" id="box">
        <button
          class="cu-btn bg-green shadow-blur round lg"
          @click="showRegisterModal()"
        >
          登记
        </button>
        <button
          class="cu-btn bg-red shadow-blur round lg"
          @click="showUpdateModal()"
        >
          修改当前行度
        </button>
      </view>
    </view>
    <view class="cu-modal" :class="registerModal ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">登记水电</view>
          <view class="action" @tap="hideRegisterModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view>
          <form>
            <view class="cu-form-group">
              <view class="title font-szie-17">水表行度</view>
              <input
                type="number"
                v-model.number="utilityForm.water"
                style="text-align: right"
              />
              度
            </view>
            <view class="cu-form-group">
              <view class="title font-size-17"> 电表行度 </view>
              <input
                type="number"
                v-model.number="utilityForm.electricity"
                style="text-align: right"
              />
              度
            </view>
          </form>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button
              class="cu-btn line-green text-green"
              @tap="hideRegisterModal"
            >
              取消
            </button>
            <button
              v-show="
                !(utilityForm.water == null || utilityForm.water == '') ||
                !(
                  utilityForm.electricity == null ||
                  utilityForm.electricity == ''
                )
              "
              class="cu-btn bg-green margin-left"
              @tap="register()"
            >
              确定
            </button>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-modal" :class="updateModal ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ title }}</view>
          <view class="action" @tap="hideUpdateModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view>
          <form>
            <view class="cu-form-group">
              <view class="title font-szie-17">水表行度</view>
              <input
                type="text"
                v-model.number="utilityForm.water"
                style="text-align: right"
              />
              度
            </view>
            <view class="cu-form-group">
              <view class="title font-size-17"> 电表行度 </view>
              <input
                type="text"
                v-model.number="utilityForm.electricity"
                style="text-align: right"
              />
              度
            </view>
          </form>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button class="cu-btn line-green text-green" @tap="hideUpdateModal">
              取消
            </button>
            <button
              v-show="
                !(utilityForm.water == null || utilityForm.water == '') ||
                !(
                  utilityForm.electricity == null ||
                  utilityForm.electricity == ''
                )
              "
              class="cu-btn bg-green margin-left"
              @tap="update()"
            >
              确定
            </button>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-load load-modal" v-if="loadingModal">
      <!-- <view class="cuIcon-emojifill text-orange"></view> -->
      <image src="/static/logo.png" mode="aspectFit"></image>
      <view class="gray-text">保存中...</view>
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      roomId: 0,
      roomNumber: null,
      houseId: null,
      houseName: null,
      statusCode: null,
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
      this.utilityForm.roomId = this.roomId;
      this.utilityForm.roomNumber = this.roomNumber;
      this.utilityForm.houseId = this.houseId;
      this.utilityForm.houseName = this.houseName;
      this.$nextTick(() => {
        this.loadingModal = true;
        this.request
          .post("/utility/recordUtility/single", this.utilityForm)
          .then((response) => {
            this.queryForm.pageIndex = 1;
            this.getUtilityList();
            this.$nextTick(() => {
              this.loadingModal = false;
            });
          })
          .catch((err) => {
            this.loadingModal = false;
            uni.showToast({
              title: err,
              icon: "none",
              duration: 2000,
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
    update() {
      this.updateModal = false;
      this.$nextTick(() => {
        this.loadingModal = true;
        this.request
          .post("/utility/updateUtility", this.utilityForm)
          .then((response) => {
            this.queryForm.pageIndex = 1;
            this.getUtilityList();
            this.$nextTick(() => {
              this.loadingModal = false;
            });
          });
      });
    },
    toInfo() {
      uni.redirectTo({
        url: `/pages/admin/roomInfo/roomInfo?roomId=${this.roomId}`,
      });
    },
    toRoomBill() {
      uni.redirectTo({
        url: `/pages/admin/roomBill/roomBill?roomId=${this.roomId}&roomNumber=${this.roomNumber}&houseId=${this.houseId}&houseName=${this.houseName}&statusCode=${this.statusCode}`,
        animationType: "none",
      });
    },
    nextRoom() {
      let roomIdList = this.getStorage("roomIdList");
      let id = parseInt(this.roomId);
      console.log(id);
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
      let id = parseInt(this.roomId);
      let index = roomIdList.indexOf(id);
      if (index <= 0) {
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
    uni.setNavigationBarTitle({
      title: `${params.houseName}-${params.roomNumber}水电登记表`,
    });
    this.roomId = params.roomId;
    this.roomNumber = params.roomNumber;
    this.houseId = params.houseId;
    this.houseName = params.houseName;
    this.statusCode = params.statusCode;
    this.queryForm.pageIndex = 1;
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
  },
  onShow() {
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
.font-size-17 {
  font-size: 17px;
}

.font-size-20 {
  font-size: 20px;
}

.color-0 {
  background-color: #f0f0f0;
}

.color-1 {
  background-color: #d3d3d3;
}
</style>