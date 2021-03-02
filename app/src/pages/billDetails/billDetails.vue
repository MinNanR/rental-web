<template>
  <view class="page" :style="'padding-bottom: ' + barHeight + 'px'">
    <view class="cu-load bg-gray fade loading" v-if="showLoading"></view>
    <view class="border-solid" v-if="!showLoading">
      <!-- <template v-for="(t, index) in bill.tenantList">
        <view class="flex padding solid flex" :key="t.name">
          <view class="">
            <template v-if="bill.tenantList.length > 1">
              <view class="font-size-20">
                <text class="cuIcon-people margin-right-xs text-olive"></text>
              </view>
              <view class="font-size-17">
                <text> 居住人{{ index + 1 }}：{{ t.name }} </text>
              </view>
            </template>
            <template v-else>
              <view class="font-size-20">
                <text class="cuIcon-people margin-right-xs text-olive"></text>
              </view>
              <view class="font-size-17"> 居住人：{{ t.name }} </view>
            </template>
          </view>
          <view class="padding solid flex" :key="t.phone">
            <view class="font-size-20">
              <text class="cuIcon-phone margin-right-xs text-yellow"></text>
            </view>
            <view class="font-size-17"> 联系电话：{{ t.phone }} </view>
          </view>
        </view>
      </template> -->
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
                    bill.payTime == null ? "" : bill.payTime
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
    <view class="margin padding bg-white">
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
          <view class="flex-sub padding solid" v-if="bill.typeCode === 'MONTHLY'">
            {{ bill.waterEnd }}
          </view>
          <view class="flex-sub padding solid" v-if="bill.typeCode === 'CHECK_IN'">
            /
          </view>
        </view>
        <view class="flex bg-white">
          <view class="flex-sub padding solid"> 电 </view>
          <view class="flex-sub padding solid">
            {{ bill.electricityStart }}
          </view>
          <view class="flex-sub padding solid" v-if="bill.typeCode === 'MONTHLY'">
            {{ bill.electricityEnd }}
          </view>
          <view class="flex-sub padding solid" v-if="bill.typeCode === 'CHECK_IN'">
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
        <template v-if="bill.statusCode === 'UNPAID'">
          <button
            class="cu-btn bg-green shadow-blur round lg"
            @click="showPaymentMethodModal()"
          >
            房客已支付
          </button>
        </template>
        <template v-if="bill.statusCode === 'UNCONFIRMED'">
          <button
            class="cu-btn bg-green shadow-blur round lg"
            @click="confirm()"
          >
            确认无误并出单
          </button>
        </template>
        <template v-if="bill.receiptUrl !== '' && bill.receiptUrl !== null">
          <button
            class="cu-btn bg-blue shadow-blur round lg"
            @click="referReceipt"
          >
            查看收据
          </button>
        </template>
        <template v-else>
          <button
            class="cu-btn bg-blue shadow-blur round lg"
            @click="createReceipt()"
          >
            生成收据
          </button>
        </template>
        <template v-if="bill.statusCode === 'UNCONFIRMED'">
          <button
            class="cu-btn bg-red shadow-blur round lg"
            @click="correctBill()"
          >
            校正水电读数
          </button>
        </template>
      </view>
    </view>
    <view class="cu-modal" :class="paymentModal ? 'show' : ''">
      <view class="cu-dialog" @tap.stop="">
        <view class="cu-bar bg-white justify-end">
          <view class="content">Modal标题</view>
          <view class="action" @tap="hidePaymentMethodModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <radio-group class="block" @change="paymentMethodChange">
          <view class="cu-list menu text-left">
            <view
              class="cu-item"
              v-for="(item, index) in paymentMethodList"
              :key="index"
            >
              <label class="flex justify-between align-center flex-sub">
                <view class="flex-sub">{{ item.value }}</view>
                <radio
                  class="round"
                  :class="paymentMethod == item.key ? 'checked' : ''"
                  :checked="paymentMethod == item.key"
                  :value="item.key"
                ></radio>
              </label>
            </view>
          </view>
        </radio-group>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button
              class="cu-btn line-green text-green"
              @tap="hidePaymentMethodModal()"
            >
              取消
            </button>
            <button class="cu-btn bg-green margin-left" @tap="paid()">
              确定
            </button>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-modal" :class="responseModalShow ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content"> </view>
          <view class="action" @tap="responseModalShow = false">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding">
          {{ responseMessage }}
        </view>
        <view class="cu-bar bg-white justify-end">
          <button
            class="cu-btn bg-green margin-left"
            @tap="responseModalShow = false"
          >
            确定
          </button>
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
import Skeleton from "../../components/J-skeleton/J-skeleton.vue";

export default {
  components: {
    Skeleton,
  },
  data() {
    return {
      barHeight: 0,
      id: 0,
      bill: {},
      loadingModal: false,
      showLoading: false,
      responseModalShow: false,
      responseMessage: "",
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
    };
  },
  methods: {
    getBillDetails() {
      this.request
        .post("/bill/getBillInfo", { id: this.id })
        .then((response) => {
          let { data } = response;
          this.bill = data;
          this.showLoading = false;
          this.statusIndex = this.statusIndexList[data.statusCode];
          // uni.setNavigationBarTitle({
          //   title: `${data.houseName}-${data.roomNumber}号房${data.year}年${
          //     data.month
          //   }月${data.typeCode === "CHECK_IN" ? "入住账单" : "账单"}`,
          // });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    referReceipt() {
      console.log(this.id);
      uni.navigateTo({
        url: `/pages/receipt/receipt?url=${encodeURIComponent(
          JSON.stringify(this.bill.receiptUrl)
        )}`,
      });
    },
    createReceipt() {
      this.loadingModal = true;
      this.loadingMessage = "生成收据中";
      this.request
        .post("/bill/createReceipt", { id: this.id })
        .then((response) => {
          let { data } = response;
          this.bill.receiptUrl = data;
          this.loadingModal = false;
          this.$nextTick(() => {
            this.responseMessage = "生成成功";
            this.responseModalShow = true;
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    correctBill() {
      this.loadingModal = true;
      this.loadingMessage = "校正中...";
      this.request
        .post("/bill/correctBill", { id: this.id })
        .then((response) => {
          this.loadingModal = false;
          this.responseMessage = "校正成功";
          this.$nextTick(() => {
            this.responseModalShow = true;
            this.getBillDetails();
          });
        })
        .catch((err) => {
          this.loadingModal = false;
          this.responseMessage = "校正失败";
          this.$nextTick(() => {
            this.responseModalShow = true;
          });
        });
    },
    confirm() {
      this.loadingModal = true;
      this.loadingMessage = "处理中";
      this.request
        .post("/bill/confirmBill", { id: this.id })
        .then((response) => {
          this.loadingModal = false;
          this.responseMessage = "处理成功";
          this.$nextTick(() => {
            this.responseModalShow = true;
            this.getBillDetails();
          });
        })
        .catch((err) => {
          console.error(err);
          this.loadingModal = false;
          this.responseMessage = "处理失败";
          this.$nextTick(() => {
            this.responseModalShow = true;
          });
        });
    },
    showPaymentMethodModal() {
      this.paymentModal = true;
    },
    hidePaymentMethodModal() {
      this.paymentModal = false;
    },
    paymentMethodChange(e) {
      this.paymentMethod = e.detail.value;
    },
    paid() {
      this.paymentModal = false;
      this.$nextTick(() => {
        this.loadingModal = true;
        this.loadingMessage = "处理中";
        this.request
          .post("/bill/paid", {
            id: this.id,
            paymentMethod: this.paymentMethod,
          })
          .then((response) => {
            this.loadingModal = false;
            this.responseMessage = "处理成功";
            this.$nextTick(() => {
              this.responseModalShow = true;
              this.getBillDetails();
            });
          })
          .catch((err) => {
            console.error(err);
            this.loadingModal = false;
            this.responseMessage = "处理失败";
            this.$nextTick(() => {
              this.responseModalShow = true;
            });
          });
      });
    },
    correctUtility() {
      uni.navigateTo({
        url: `/pages/roomUtility/roomUtility?id=${this.bill.roomId}&roomNumber=${this.bill.roomNumber}&houseId=${this.bill.houseId}&houseName=${this.bill.houseName}`,
      });
    },
  },
  onLoad(param) {
    this.id = param.id;

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
    this.showLoading = true;
    this.getBillDetails();
  },
  filters: {
    time(value) {
      return dayjs(value).format("YYYY年M月D日");
    },
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

.cu-timeline > .cu-item::before {
  font-size: 22px;
}
</style>