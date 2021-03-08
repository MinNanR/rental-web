<template>
  <view class="" :style="'padding-bottom: ' + barHeight + 'px'">
    <view class="border-solid" v-if="!showLoading">
      <view class="margin padding bg-white">
        <view class="flex justify-center">
          <view
            class="cu-avatar round lg bg-green"
            v-if="bill.typeCode === 'CHECK_IN'"
          >
            <view class="bg-green">
              <span
                class="iconfont icon-checkin"
                style="font-size: 22px"
              ></span>
            </view>
          </view>
          <view
            class="cu-avatar round lg bg-blue"
            v-if="bill.typeCode === 'MONTHLY'"
          >
            <view v-if="bill.typeCode === 'MONTHLY'">
              <text class="cuIcon-calendar" style="font-size-22"></text>
            </view>
          </view>
        </view>
        <view class="flex justify-center margin-top text-lg">
          {{ bill.houseName }}-{{ bill.roomNumber }}号房{{ bill.year }}年{{
            bill.month
          }}月{{ bill.typeCode === "CHECK_IN" ? "入住账单" : "账单" }}
        </view>
        <view class="flex justify-center margin-top text-lg">
          <text class="text-price text-xxl">{{ bill.totalCharge }}</text>
        </view>
        <view class="flex justify-between margin-top">
          <view class="text-xl"> 从 </view>
          <view class="text-xl"> {{ bill.startDate }} </view>
        </view>
        <view class="flex justify-between margin-top">
          <view class="text-xl"> 至 </view>
          <view class="text-xl"> {{ bill.endDate }} </view>
        </view>
        <view class="flex justify-between margin-top">
          <view class="text-xl"> 账单进度 </view>
          <view style="width: 200px">
            <view class="cu-timeline">
              <view
                class="cu-item"
                :class="
                  statusIndex >= 1 ? 'cuIcon-roundcheckfill text-blue' : ''
                "
              >
                <view
                  class="content bg-white"
                  style="padding: 0"
                  :class="statusIndex >= 1 ? 'text-blue text-xl' : ''"
                >
                  等待确认
                  <text style="font-size: 12px" class="padding-left">{{
                    bill.completeDate
                  }}</text>
                </view>
              </view>
              <view
                class="cu-item"
                :class="
                  statusIndex >= 2
                    ? 'cuIcon-roundcheckfill text-blue'
                    : 'cuIcon-more'
                "
              >
                <view
                  class="content bg-white"
                  style="padding: 0"
                  :class="statusIndex >= 2 ? 'text-blue text-xl' : ''"
                >
                  等待支付
                  <text class="margin-right"></text>
                </view>
              </view>
              <view
                class="cu-item"
                :class="
                  statusIndex >= 3
                    ? 'cuIcon-roundcheckfill text-blue'
                    : 'cuIcon-more'
                "
              >
                <view
                  class="content bg-white"
                  style="padding: 0"
                  :class="statusIndex >= 3 ? 'text-blue text-xl' : ''"
                >
                  账单完成<text style="font-size: 12px" class="padding-left">{{
                    bill.payTime == null || bill.statusCode !== "PAID"
                      ? ""
                      : bill.payTime
                  }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view
          class="flex justify-between margin-top"
          v-if="bill.statusCode === 'PAID'"
        >
          <view class="text-xl"> 支付方式 </view>
          <view class="text-xl"> {{ bill.paymentMethod }} </view>
        </view>
      </view>
    </view>
    <view class="padding margin bg-white">
      <view class="text-xl" style="font-weight: 700"> 水电明细 </view>
      <view class="padding-top font-size-17 text-center">
        <view class="flex bg-cyan">
          <view class="flex-sub padding solid"> </view>
          <view class="flex-sub padding solid"> 上月行度 </view>
          <view class="flex-sub padding solid"> 本月行度 </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> 水 </view>
          <view class="flex-sub padding solid">
            {{ bill.waterStart }}
          </view>
          <view
            class="flex-sub padding solid"
            v-if="bill.typeCode === 'MONTHLY'"
          >
            {{ bill.waterEnd }}
          </view>
          <view
            class="flex-sub padding solid"
            v-if="bill.typeCode === 'CHECK_IN'"
          >
            /
          </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> 电 </view>
          <view class="flex-sub padding solid">
            {{ bill.electricityStart }}
          </view>
          <view
            class="flex-sub padding solid"
            v-if="bill.typeCode === 'MONTHLY'"
          >
            {{ bill.electricityEnd }}
          </view>
          <view
            class="flex-sub padding solid"
            v-if="bill.typeCode === 'CHECK_IN'"
          >
            /
          </view>
        </view>
      </view>
    </view>
    <view class="margin padding bg-white" v-if="!showLoading">
      <view class="text-xl" style="font-weight: 700"> 账单明细 </view>
      <view class="padding-top font-size-17 text-center">
        <view class="flex bg-cyan" style="">
          <view class="flex-sub padding solid"> 收款项 </view>
          <view class="flex-sub padding solid"> 数量 </view>
          <view class="flex-sub padding solid"> 收费(元) </view>
        </view>
        <view class="flex bg-white" v-if="bill.typeCode === 'CHECK_IN'">
          <view class="flex-sub padding solid"> 门禁卡 </view>
          <view class="flex-sub padding solid">
            {{ bill.accessCardQuantity }}张
          </view>
          <view class="flex-sub padding solid">
            {{ bill.accessCardCharge }}
          </view>
        </view>
        <view class="flex bg-white" v-if="bill.typeCode === 'CHECK_IN'">
          <view class="flex-sub padding solid"> 押金</view>
          <view class="flex-sub padding solid"> / </view>
          <view class="flex-sub padding solid"> {{ bill.deposit }} </view>
        </view>

        <view class="flex bg-white" v-if="bill.typeCode === 'MONTHLY'">
          <view class="flex-sub padding solid"> 水 </view>
          <view class="flex-sub padding solid"> {{ bill.waterUsage }}度 </view>
          <view class="flex-sub padding solid"> {{ bill.waterCharge }} </view>
        </view>
        <view class="flex bg-white" v-if="bill.typeCode === 'MONTHLY'">
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
        <button
          class="cu-btn bg-green shadow-blur round lg"
          v-if="bill.statusCode !== 'PAID'"
          @click="toPay()"
        >
          前往支付
        </button>
        <button class="cu-btn bg-blue shadow-blur round lg" @click="referReceipt()">
          查看收据
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      bill: {},
      statusIcon: {
        UNPAID: "icon-weizhifu",
        PAID: "icon-ic_paid",
        PRINTED: "icon-ic_paid",
        UNCONFIRMED: "icon-jiesuan",
      },
      paymentMethodIcon: {
        WEIXIN: "weixin",
        CASH: "moneybagfill",
      },
      paymentMethodColor: {
        WEIXIN: "green",
        CASH: "red",
      },
      loadingMessage: "",
      paymentModal: false,
      paymentMethodList: [
        {
          key: "WEIXIN",
          value: "微信支付",
        },
        { key: "CASH", value: "现金支付" },
      ],
      paymentMethod: "WEIXIN",
      waterModalShow: false,
      electricityModalShow: false,
      statusIndex: 0,
      statusIndexList: {
        UNCONFIRMED: 1,
        UNPAID: 2,
        PAID: 3,
      },
      showLoading: false,
      barHeight: 0,
    };
  },
  methods: {
    getBillInfo() {
      this.showLoading = true;
      this.request
        .post("/bill/getBillInfo", { id: this.id })
        .then((response) => {
          let { data } = response;
          this.bill = data;
          this.showLoading = false;
          this.statusIndex = this.statusIndexList[data.statusCode];
        })
        .catch((err) => {
          uni.showToast({
            title: err,
            duration: 2000,
          });
          this.showLoading = false;
        });
    },
    referReceipt() {
      console.log(this.id);
      uni.navigateTo({
        url: `/pages/admin/receipt/receipt?url=${encodeURIComponent(
          JSON.stringify(this.bill.receiptUrl)
        )}`,
      });
    },
    toPay(){
      //TODO 拉起支付
      console.log("pay");
    }
  },
  onLoad(params) {
    this.id = params.id;
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
    this.getBillInfo();
  },

};
</script>

<style>
</style>