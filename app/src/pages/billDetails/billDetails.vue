<template>
  <view class="page" :style="'padding-bottom: ' + barHeight + 'px'">
    <view class="cu-load bg-gray fade loading" v-show="showLoading"></view>
    <view class="grid col-2 border-solid" v-show="!showLoading">
      <view class="padding solid flex">
        <view class="font-size-20">
          <text class="cuIcon-home margin-right-xs text-blue"></text>
        </view>
        <view class="font-size-17"> 房屋：{{ bill.houseName }} </view>
      </view>
      <view class="padding solid flex">
        <view>
          <span
            class="iconfont icon-StudyRoom text-red margin-right-xs font-size-20"
          ></span>
        </view>
        <view class="font-size-17"> 房号：{{ bill.roomNumber }} </view>
      </view>
      <template v-for="(t, index) in bill.tenantList">
        <view class="padding solid flex" :key="t.name">
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
      </template>
      <template v-if="bill.typeCode === 'MONTHLY'">
        <view class="padding solid flex">
          <view>
            <span
              class="iconfont icon-5 text-blue margin-right-xs font-size-20"
            ></span>
          </view>
          <view class="font-size-17"> 用水量：{{ bill.waterUsage }}度 </view>
          <view @click="correctUtility()">
            <text class="cuIcon-settingsfill" style="font-size: 20px"></text>
          </view>
        </view>
        <view class="padding solid flex">
          <view class="font-size-20">
            <text class="cuIcon-recharge margin-right-xs text-red"></text>
          </view>
          <view class="font-size-17"> 水费：{{ bill.waterCharge }}元 </view>
        </view>
        <view class="padding solid flex">
          <view class="font-size-20">
            <text class="cuIcon-light margin-right-xs text-green"></text>
          </view>
          <view class="font-size-17">
            用电量：{{ bill.electricityUsage }}度
          </view>
          <view @click="correctUtility()">
            <text class="cuIcon-settingsfill" style="font-size: 20px"></text>
          </view>
        </view>
        <view class="padding solid flex">
          <view class="font-size-20">
            <text class="cuIcon-recharge margin-right-xs text-yellow"></text>
          </view>
          <view class="font-size-17">
            电费：{{ bill.electricityCharge }}元
          </view>
        </view>
      </template>
      <template v-if="bill.typeCode === 'CHECK_IN'">
        <view class="padding solid flex">
          <view class="font-size-20">
            <text class="cuIcon-moneybag margin-right-xs text-cyan"></text>
          </view>
          <view class="font-size-17"> 押金：{{ bill.deposit }}元 </view>
        </view>
        <view class="padding solid flex">
          <view class="font-size-20">
            <text class="cuIcon-card margin-right-xs text-black"></text>
          </view>
          <view class="font-size-17">
            门禁卡：{{ bill.accessCardCharge }}元
          </view>
        </view>
      </template>
      <view class="padding solid flex">
        <view class="font-size-20">
          <text class="cuIcon-recharge margin-right-xs text-blue"></text>
        </view>
        <view class="font-size-17"> 房租：{{ bill.rent }}元 </view>
      </view>
      <view class="padding solid flex">
        <view class="font-size-20">
          <text class="cuIcon-rechargefill margin-right-xs text-red"></text>
        </view>
        <view class="font-size-17"> 总收费：{{ bill.totalCharge }}元 </view>
      </view>
      <view class="padding solid flex">
        <view>
          <text
            class="iconfont text-green margin-right-xs font-size-20"
            :class="statusIcon[bill.statusCode]"
          ></text>
        </view>
        <view class="font-size-17"> 账单状态：{{ bill.status }} </view>
      </view>
      <view class="padding solid flex">
        <view class="font-size-20">
          <text class="cuIcon-time margin-right-xs text-yellow"></text>
        </view>
        <view class="font-size-17">
          账单生成时间：{{ bill.updateTime | time }}
        </view>
      </view>
      <template v-if="bill.statusCode === 'PAID'">
        <view class="padding solid flex">
          <view class="font-size-20">
            <text class="cuIcon-time margin-right-xs text-yellow"></text>
          </view>
          <view class="font-size-17">
            支付时间：{{ bill.payTime | time }}
          </view>
        </view>
        <view class="padding solid flex">
          <view class="font-size-20">
            <text
              :class="
                'cuIcon-' +
                paymentMethodIcon[bill.paymentMethodCode] +
                ' margin-right-xs text-' +
                paymentMethodColor[bill.paymentMethodCode]
              "
            ></text>
          </view>
          <view class="font-size-17"> 支付方式：{{ bill.paymentMethod }} </view>
        </view>
      </template>
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
        <template v-if="bill.receiptUrl !== '' && bill.receiptUlr !== null">
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
    this.showLoading = true;
    this.getBillDetails();
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
</style>