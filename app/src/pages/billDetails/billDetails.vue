<template>
  <view class="page">
    <view class="grid col-2 border-solid">
      <view class="padding solid font-size"> 房屋：{{ bill.houseName }} </view>
      <view class="padding solid font-size"> 房号：{{ bill.roomNumber }} </view>
      <template v-for="(t, index) in bill.tenantList">
        <view class="padding solid font-size" :key="t.name">
          <template v-if="bill.tenantList.length > 1">
            <text> 居住人{{ index + 1 }} </text>
          </template>
          <template v-else>
            <text> 居住人 </text>
          </template>
          ：{{ t.name }}
        </view>
        <view class="padding solid font-size" :key="t.phone">
          联系电话：{{ t.phone }}
        </view>
      </template>
      <view class="padding solid font-size">
        用水量：{{ bill.waterUsage }}度
      </view>
      <view class="padding solid font-size">
        水费：{{ bill.waterCharge }}元
      </view>
      <view class="padding solid font-size">
        用电量：{{ bill.electricityUsage }}度
      </view>
      <view class="padding solid font-size">
        电费：{{ bill.electricityCharge }}元
      </view>
      <view class="padding solid font-size"> 房租：{{ bill.rent }}元 </view>
      <view class="padding solid font-size">
        总收费：{{ bill.totalCharge }}元
      </view>
      <view class="padding solid font-size"> 账单状态：{{ bill.status }} </view>
      <template v-if="bill.status === '未支付'">
        <view class="padding solid font-size">
          账单生成时间：{{ bill.updateTime }}
        </view>
      </template>
      <template v-else>
        <view class="padding solid font-size" v-if="bill.status !== '未支付'">
          支付时间：{{ bill.payTime }}
        </view>
        <view class="padding solid font-size" v-if="bill.status !== '未支付'">
          支付方式：{{ bill.paymentMethod }}
        </view>
      </template>
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
      id: 0,
      bill: {},
      loading: false,
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
  },
};
</script>

<style>
.font-size {
  font-size: 17px;
}
</style>