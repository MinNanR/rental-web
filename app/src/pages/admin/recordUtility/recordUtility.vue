<template>
  <view class="" :style="'padding-bottom: ' + barHeight + 'px'">
    <view class="grid col-2" v-if="floorDropDown.length > 0">
      <view class="basis-xl">
        <picker
          mode="multiSelector"
          @change="floorChange"
          :range="floorDropDown"
          :range-key="'value'"
          @columnchange="houseChange"
          :disabled="houseSelected"
          :focus="focus"
        >
          <view
            v-if="selectedFloor.length > 0"
            class="flex justify-around"
            style="font-size: 20px"
          >
            <view>
              {{ selectedFloor[0] }}
            </view>
            <view>
              {{ selectedFloor[1] }}
            </view>
          </view>
          <view v-else class="flex justify-around" style="font-size: 20px">
            请选择楼层
          </view>
        </picker>
      </view>
      <view class="basis-xs">
        <button
          class="cu-btn bg-blue"
          @click="onConfirmFloor()"
          :disabled="houseSelected"
        >
          确定
        </button>
      </view>
    </view>
    <view class="padding-top font-size-17">
      <view class="flex" style="">
        <view class="flex-sub padding solid"> 房号 </view>
        <view class="flex-twice padding solid"> 水表度数 </view>
        <view class="flex-twice padding solid"> 电表度数 </view>
      </view>
      <view v-for="(item, index) in utilityList" :key="index" class="flex">
        <view class="flex-sub padding solid">
          {{ item.roomNumber }}
        </view>
        <view class="flex-twice padding solid">
          <input
            type="number"
            v-model="item.water"
            :placeholder="'当前读数：' + item.currentWater"
            placeholder-style="font-size: 13px"
          />
        </view>
        <view class="flex-twice padding solid">
          <input
            type="number"
            v-model="item.electricity"
            :placeholder="'当前：' + item.currentElectricity"
            placeholder-style="font-size: 13px"
          />
        </view>
      </view>
    </view>
    <view class="box">
      <view class="cu-bar tabbar btn-group foot bg-white" id="box">
        <view class="action">
          <view class="cu-bar btn-group">
            <button
              class="cu-btn bg-green shadow-blur round lg"
              @click="onSave()"
              :disabled="!houseSelected"
            >
              保存
            </button>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-modal" :class="modalShow ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ modal.title }}</view>
          <view class="action" @tap="hideMessageModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding text-lg">
          <view
            v-for="(m, index) in modal.message"
            :key="index"
            class="padding-xs"
          >
            {{ m }}
          </view>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button class="cu-btn bg-green margin-left" @tap="confirmAction">
              确定
            </button>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-load load-modal" v-if="loadingModal">
      <!-- <view class="cuIcon-emojifill text-orange"></view> -->
      <image src="/static/logo.png" mode="aspectFit"></image>
      <view class="gray-text">{{ loadingMessage }}</view>
    </view>
    <view class="cu-modal" :class="resultModal ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">请确认登记结果</view>
          <view class="action" @tap="hideResultModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding">
          <view class="flex" style="">
            <view class="flex-sub padding solid"> 房号 </view>
            <view class="flex-twice padding solid"> 水表度数 </view>
            <view class="flex-twice padding solid"> 电表度数 </view>
          </view>
          <scroll-view scroll-y="true" class="scroll-Y" style="height: 30vh">
            <view
              v-for="(item, index) in utilityList"
              :key="index"
              class="flex"
            >
              <block
                v-if="
                  !(item.water == null || item.water == '') ||
                  !(item.electricity == null || item.electricity == '')
                "
              >
                <view class="flex-sub padding solid">
                  {{ item.roomNumber }}
                </view>
                <view class="flex-twice padding solid">
                  {{ item | water }}
                </view>
                <view class="flex-twice padding solid">
                  {{ item | electricity }}
                </view>
              </block>
            </view>
          </scroll-view>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button class="cu-btn bg-green margin-left" @tap="confirmSave()">
              确定
            </button>
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
      houseId: null,
      houseName: null,
      floor: null,
      floorDropDown: [],
      floorArray: [],
      selectedFloor: [],
      houseSelected: false,
      modalShow: false,
      modal: {
        title: "",
        message: [""],
        loading: false,
        confirmAction: null,
      },
      loadingModal: false,
      loadingMessage: "",
      utilityList: [],
      barHeight: 0,
      resultModal: false,
      focus: false,
    };
  },
  methods: {
    getFloorDropDown() {
      this.request
        .post("/room/getFloorDropDown", {})
        .then((response) => {
          let { data } = response;
          let floorArray = data.map((e) => {
            return {
              key: e.houseId,
              value: e.houseName,
              sub: e.floorList.map((f) => {
                return {
                  key: f,
                  value: `${f}楼`,
                };
              }),
            };
          });
          this.floorDropDown = [floorArray, floorArray[0].sub];
          this.$nextTick(() => {
            this.focus = true;
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getFloor(houseId) {
      return this.floorMap[houseId].floorList;
    },
    houseChange(e) {
      let { column, value } = e.detail;
      console.log(e.detail);
      if (column == 0) {
        this.floorDropDown[1] = this.floorDropDown[0][value].sub;
        // #ifdef MP-WEIXIN
        let pages = getCurrentPages();
        pages[pages.length - 1].setData({
          floorDropDown: this.floorDropDown,
        });
        // #endif
      }
    },
    floorChange(e) {
      let value = e.detail.value;
      let houseIndex = value[0];
      let floorIndex = value[1];
      this.houseId = this.floorDropDown[0][houseIndex].key;
      this.houseName = this.floorDropDown[0][houseIndex].value;
      this.floor = this.floorDropDown[1][floorIndex].key;
      this.selectedFloor = [
        this.floorDropDown[0][houseIndex].value,
        this.floorDropDown[1][floorIndex].value,
      ];
    },
    onConfirmFloor() {
      if (this.houseId == null || this.floor == null) return;
      this.modal.title = "请确认";
      this.modal.message = [
        `即将登记${this.selectedFloor[0]}${this.selectedFloor[1]}水电，确认后不可修改`,
        "不填则不登记，如果只填一项则另一项读数不变",
      ];
      this.modal.confirmAction = "confirmFloor";
      this.modalShow = true;
    },
    confirmFloor() {
      this.modalShow = false;
      this.loadingModal = true;
      this.loadingMessage = "加载中...";
      this.request
        .post("/room/getRoomByFloor", {
          houseId: this.houseId,
          floor: this.floor,
        })
        .then((response) => {
          let { data } = response;
          data.forEach((e) => {
            e.water = null;
            e.electricity = null;
          });
          this.utilityList = data;
          this.loadingModal = false;
          this.houseSelected = true;
        })
        .catch((err) => {
          console.error(err);
          this.loadingModal = false;
        });
    },
    hideMessageModal() {
      this.modalShow = false;
    },
    onSave() {
      this.resultModal = true;
    },
    hideResultModal() {
      this.resultModal = false;
    },
    confirmSave() {
      let filters = this.$options.filters;
      let submitData = [];
      this.utilityList.forEach((e) => {
        if (
          !(e.water == null || e.water == "") ||
          !(e.electricity == null || e.electricity == "")
        ) {
          submitData.push({
            houseId: this.houseId,
            houseName: this.houseName,
            roomId: e.roomId,
            roomNumber: e.roomNumber,
            water: filters.water(e),
            electricity: filters.electricity(e),
          });
        }
      });
      this.hideResultModal();
      this.loadingMessage = "保存中...";
      this.loadingModal = true;
      // console.log(submitData);
      // setTimeout(() => {
      //   this.loadingModal = false;
      //   this.modal.title = "成功";
      //   this.modal.message = ["保存成功"];
      //   this.modal.confirmAction = this.turnBack;
      //   this.modalShow = true;
      // }, 3000);
      this.request
        .post("/utility/recordUtility/batch", submitData)
        .then((response) => {
          setTimeout(() => {
            this.loadingModal = false;
            this.modal.title = "成功";
            this.modal.message = ["保存成功"];
            this.modal.confirmAction = "turnBack";
            this.modalShow = true;
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => {
            this.loadingModal = false;
            this.modal.title = "失败";
            this.modal.message = ["保存失败"];
            this.modal.confirmAction = "";
            this.modalShow = true;
          }, 500);
        });
    },
    turnBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    confirmAction() {
      if (this.modal.confirmAction == "confirmFloor") {
        this.confirmFloor();
      } else if (this.modal.confirmAction == "turnBack") {
        this.turnBack();
      } else if (this.modal.confirmAction == "") {
        this.modalShow = false;
      }
    },
  },
  onShow() {
    this.$nextTick(() => {
      this.getFloorDropDown();
    });
  },
  onLoad() {
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
  filters: {
    water(item) {
      return Number(
        item.water == null || item.water == "" ? item.currentWater : item.water
      );
    },
    electricity(item) {
      return Number(
        item.electricity == null || item.electricity == ""
          ? item.currentElectricity
          : item.electricity
      );
    },
  },
};
</script>

<style>
.font-size-17 {
  font-size: 17px;
}
</style>