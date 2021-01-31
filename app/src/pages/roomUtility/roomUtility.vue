<template>
  <view class="" id="page" :style="'padding-bottom: ' + barHeight + 'px'">
    <view class="padding-top font-size-17 text-center">
      <view class="flex" style="">
        <view class="flex-twice padding solid"> 时间 </view>
        <view class="flex-sub padding solid"> 水表行度 </view>
        <view class="flex-sub padding solid"> 电表行度 </view>
      </view>
      <view
        v-for="(item, index) in utilityList"
        :key="index"
        class="flex"
        :class="colorList[index % colorList.length]"
      >
        <view class="flex-twice padding solid" style="font-size: 15px">
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
              <input type="text" v-model.number="utilityForm.water" />
              度
            </view>
            <view class="cu-form-group">
              <view class="title font-size-17"> 电表行度 </view>
              <input type="text" v-model.number="utilityForm.electricity" />
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
    <view class="cu-load load-modal" v-if="loadingModal">
      <!-- <view class="cuIcon-emojifill text-orange"></view> -->
      <image src="/static/logo.png" mode="aspectFit"></image>
      <view class="gray-text">保存中...</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: 0,
      roomNumber: null,
      houseId: null,
      houseName: null,

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
      },
      registerModal: false,
      loadingModal: false,
      colorList: ["color-0", "color-1"],
    };
  },
  methods: {
    getUtlityList() {
      this.queryForm.roomId = Number(this.id);
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
          }, 2000);
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
      let index = this.utilityList.findIndex((e) => e.status == "使用中");
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
  },
  onLoad(params) {
    uni.setNavigationBarTitle({
      title: `${params.houseName}-${params.roomNumber}水电登记表`,
    });
    this.id = params.id;
    this.roomNumber = params.roomNumber;
    this.houseId = params.houseId;
    this.houseName = params.houseName;
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
    this.getUtlityList();
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