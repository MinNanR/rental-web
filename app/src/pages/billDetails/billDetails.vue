<template>
  <view class="page" :style="'padding-bottom: ' + barHeight + 'px'">
    <view class="grid col-2 border-solid">
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
      <view class="padding solid flex">
        <view>
          <span
            class="iconfont icon-5 text-blue margin-right-xs font-size-20"
          ></span>
        </view>
        <view class="font-size-17"> 用水量：{{ bill.waterUsage }}度 </view>
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
      </view>
      <view class="padding solid flex">
        <view class="font-size-20">
          <text class="cuIcon-recharge margin-right-xs text-yellow"></text>
        </view>
        电费：{{ bill.electricityCharge }}元
      </view>
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
        <view class="font-size-17"> 账单生成时间：{{ bill.updateTime }} </view>
      </view>
      <template v-if="bill.statusCode === 'PAID'">
        <view class="padding solid flex">
          <view class="font-size-20">
            <text class="cuIcon-time margin-right-xs text-yellow"></text>
          </view>
          <view class="font-size-17"> 支付时间：{{ bill.payTime }} </view>
        </view>
        <view class="padding solid flex">
          <view class="font-size-20">
            <text
              :class="
                'cuIcon-' +
                paymentMethodIcon[this.bill.paymentMethodCode] +
                ' margin-right-xs text-' +
                paymentMethodColor[this.bill.paymentMethodCode]
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
          <button class="cu-btn bg-green shadow-blur round lg">已支付</button>
        </template>
        <template v-if="bill.statusCode === 'UNSETTLED'">
          <button class="cu-btn bg-green shadow-blur round lg">确认结算</button>
        </template>
        <button class="cu-btn bg-blue shadow-blur round lg" @click="referReceipt">
          查看收据
        </button>
      </view>
    </view>
  </view>
</template>

<script>
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
      loading: false,
      statusIcon: {
        UNPAID: "icon-weizhifu",
        PAID: "icon-ic_paid",
        PRINTED: "icon-ic_paid",
        UNSETTLED: "icon-jiesuan",
      },
      paymentMethodIcon: {
        WEIXIN: "weixin",
        CASH: "moneybagfill",
      },
      paymentMethodColor: {
        WEIXIN: "green",
        CASH: "red",
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
          this.loading = false;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  onLoad(param) {
    this.id = param.id;
    this.loading = true;
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