<template>
  <view class="" :style="'padding-bottom: ' + barHeight + 'px'">
    <view class="margin padding bg-white font-size-17">
      <view class="text-xl" style="font-weight: 700"> 账单日期 </view>
      <view class="flex margin-top bg-cyan">
        <view class="flex-sub padding solid"> </view>
        <view class="flex-twice padding solid"> 日期 </view>
      </view>
      <view class="flex bg-white">
        <view class="flex-sub padding solid"> 从 </view>
        <view class="flex-twice padding solid">
          <view>
            <picker
              mode="date"
              @change="startDateChange"
              :value="modifyForm.startDate"
            >
              <view class="picker" style="text-align: left; font-size: 16px">
                {{ modifyForm.startDate }}
              </view>
            </picker>
          </view>
        </view>
      </view>
      <view class="flex bg-white">
        <view class="flex-sub padding solid"> 至 </view>
        <view class="flex-twice padding solid">
          <picker
            mode="date"
            @change="endDateChange"
            :value="modifyForm.endDate"
          >
            <view class="picker" style="text-align: left; font-size: 16px">
              {{ modifyForm.endDate }}
            </view>
          </picker>
        </view>
      </view>
    </view>
    <view class="margin padding bg-white">
      <view class="text-xl" style="font-weight: 700"> 水电填写 </view>
      <view class="padding-top font-size-17 text-center">
        <view class="flex bg-cyan">
          <view class="flex-sub padding solid"> </view>
          <view class="flex-sub padding solid"> 水 </view>
          <view class="flex-sub padding solid"> 电 </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> 上月行度</view>
          <view class="flex-sub padding solid">
            <input
              type="number"
              v-model.number="modifyForm.waterStart"
              @input="onWaterStartChange"
            />
          </view>
          <view class="flex-sub padding solid">
            <input
              type="number"
              v-model.number="modifyForm.electricityStart"
              @input="onElectricityStartChange"
            />
          </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid">本月行度</view>
          <view class="flex-sub padding solid">
            <input
              type="number"
              v-model.number="modifyForm.waterEnd"
              @input="onWaterEndChange"
            />
          </view>
          <view class="flex-sub padding solid">
            <input
              type="number"
              v-model.number="modifyForm.electricityEnd"
              @input="onElectricityEndChange"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="margin padding bg-white" v-if="!showLoading">
      <view class="text-xl" style="font-weight: 700"> 账单结算 </view>
      <view class="padding-top font-size-17 text-center">
        <view class="flex bg-cyan" style="">
          <view class="flex-sub padding solid"> 收款项 </view>
          <view class="flex-sub padding solid"> 数量 </view>
          <view class="flex-sub padding solid"> 收费(元) </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> 水 </view>
          <view class="flex-sub padding solid"> {{ bill.waterUsage }}度 </view>
          <view class="flex-sub padding solid"> {{ bill.waterCharge }} </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> 电 </view>
          <view class="flex-sub padding solid">
            {{ bill.electricityUsage }}度
          </view>
          <view class="flex-sub padding solid">
            {{ bill.electricityCharge }}
          </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> 房租 </view>
          <view class="flex-sub padding solid"> /</view>
          <view class="flex-sub padding solid"> {{ bill.rent }} </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> 总收费 </view>
          <view class="flex-sub padding solid"> / </view>
          <view class="flex-sub padding solid"> {{ bill.totalCharge }} </view>
        </view>
      </view>
    </view>
    <view class="box">
      <view class="cu-bar tabbar btn-group foot bg-white" id="box">
        <button class="cu-btn bg-green shadow-blur round lg" @click="save()">
          保存修改
        </button>
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
  </view>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      barHeight: 0,
      roomId: "",
      baseData: {},
      showLoading: false,
      bill: {},
      loadingModal: false,
      loadingMessage: "",
      modalShow: false,
      modal: {
        title: "",
        message: [],
      },
      modifyForm: {},
    };
  },
  methods: {
    getBillData() {
      this.request
        .post("/bill/getBillInfo", { id: this.id })
        .then((response) => {
          let { data } = response;
          this.bill = data;
          this.modifyForm = {
            billId: data.id,
            waterStart: data.waterStart,
            waterEnd: data.waterEnd,
            electricityStart: data.electricityStart,
            electricityEnd: data.electricityEnd,
            startDate: data.startDate,
            endDate: data.endDate,
          };
        });
    },
    getUtilityPrice() {
      this.request.post("/bill/getUtilityPrice", {}).then((response) => {
        let { data } = response;
        this.baseData = {
          waterPrice: data.waterPrice,
          electricityPrice: data.electricityPrice,
        };
      });
    },
    onWaterEndChange(e) {
      let waterEnd = new Number(e.detail.value);
      let waterStart = new Number(this.modifyForm.waterStart);
      if (waterEnd < waterStart) {
        waterEnd = 1000 + waterEnd;
      }
      this.bill.waterUsage = waterEnd - waterStart;
      let waterUsage = this.bill.waterUsage;
      if (waterUsage === 0) {
        waterUsage = 1;
      }
      this.bill.waterCharge = waterUsage * this.baseData.waterPrice;
      this.bill.totalCharge =
        this.bill.waterCharge + this.bill.electricityCharge + this.bill.rent;
    },
    onElectricityEndChange(e) {
      let electricityEnd = new Number(e.detail.value);
      let electricityStart = new Number(this.modifyForm.electricityStart);
      if (electricityEnd < electricityStart) {
        electricityEnd = 10000 + electricityEnd;
      }
      this.bill.electricityUsage = electricityEnd - electricityStart;
      this.bill.electricityCharge =
        this.bill.electricityUsage * this.baseData.electricityPrice;
      this.bill.totalCharge =
        this.bill.waterCharge + this.bill.electricityCharge + this.bill.rent;
    },
    onWaterStartChange(e) {
      let waterStart = new Number(e.detail.value);
      let waterEnd = new Number(this.modifyForm.waterEnd);
      if (waterEnd < waterStart) {
        waterEnd = waterEnd + 1000;
      }
      this.bill.waterUsage = waterEnd - waterStart;
      let waterUsage = this.bill.waterUsage;
      if (waterUsage === 0) {
        waterUsage = 1;
      }
      this.bill.waterCharge = waterUsage * this.baseData.waterPrice;
      this.bill.totalCharge =
        this.bill.waterCharge + this.bill.electricityCharge + this.bill.rent;
    },
    onElectricityStartChange(e) {
      let electricityStart = new Number(e.detail.value);
      let electricityEnd = new Number(this.modifyForm.electricityEnd);
      if (electricityEnd < electricityStart) {
        electricityEnd = electricityEnd + 10000;
      }
      this.bill.electricityUsage = electricityEnd - electricityStart;
      this.bill.electricityCharge =
        this.bill.electricityUsage * this.baseData.electricityPrice;
      this.bill.totalCharge =
        this.bill.waterCharge + this.bill.electricityCharge + this.bill.rent;
    },
    startDateChange(e) {
      this.modifyForm.startDate = e.detail.value;
    },
    endDateChange(e) {
      this.modifyForm.endDate = e.detail.value;
    },
    save() {
      let {
        waterStart,
        waterEnd,
        electricityStart,
        electricityEnd,
        startDate,
        endDate,
      } = this.modifyForm;
      let submitForm = {};
      let bill = this.bill;
      if (waterStart !== bill.waterStart) {
        submitForm.waterStart = waterStart;
      }
      if (waterEnd !== bill.waterEnd) {
        submitForm.waterEnd = waterEnd;
      }
      if (electricityStart !== bill.electricityStart) {
        submitForm.electricityStart = electricityStart;
      }
      if (electricityEnd !== bill.electricityEnd) {
        submitForm.electricityEnd = electricityEnd;
      }
      if (startDate !== bill.startDate) {
        submitForm.startDate = startDate;
      }
      if (endDate !== bill.endDate) {
        submitForm.endDate = endDate;
      }
      if (Object.keys(submitForm).length == 0) {
        this.modal.title = "保存成功";
        this.modal.message = ["没有要修改的信息"];
        this.modal.confirmAction = "SUCCESS";
        this.modalShow = true;
        return;
      }
      submitForm.billId = this.modifyForm.billId;
      this.loadingModal = true;
      this.loadingMessage = "保存中";
      this.request
        .post("/bill/modifyBill", submitForm)
        .then((response) => {
          this.loadingModal = false;
          this.modal.confirmAction = "SUCCESS";
          this.modal.title = "保存成功";
          this.modal.message = [response.message];
          this.modalShow = true;
        })
        .catch((err) => {
          this.loadingModal = false;
          this.modal.confirmAction = "FAIL";
          this.modal.title = "保存失败";
          this.modal.message = [err];
          this.modalShow = true;
        });
      setTimeout(() => {}, 1000);
    },
    confirmAction() {
      this.modalShow = false;
      if (this.modal.confirmAction === "SUCCESS") {
        this.modalShow = false;
        uni.navigateBack({
          delta: 1,
        });
      } else if (this.modal.confirmAction === "FAIL") {
        this.modalShow = false;
      }
    },
  },
  onShow() {},
  onLoad(param) {
    this.today = dayjs().format("M月D日");
    this.id = param.id;
    this.getBillData();
    this.getUtilityPrice();
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
};
</script>

<style>
.font-size-17 {
  font-size: 17px;
}

.font-size-20 {
  font-size: 20px;
}

.font-size-22 {
  font-size: 22px;
}
</style>