<template>
  <view class="">
    <view
      v-for="(item, index) in billList"
      :key="index"
      class="unpaid-bill-container"
    >
      <view class="unpaid-bill-header">
        <text>房号：{{ item.roomNumber }}</text>
        <text>应缴费用：{{ item.totalCharge }}</text>
      </view>
      <view class="unpaid-bill-content">
        <view class="unpaid-bill-content-line">
          <view class="">

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
      billList: [],
      queryForm: {
        pageIndex: 1,
        pageSize: 10,
        status: "UNPAID",
      },
    };
  },
  methods: {
    getBillList() {
      this.request
        .post("/bill/getBillList", this.queryForm)
        .then((response) => {
          let { data } = response;
          this.billList = data.list;
        });
    },
  },
  mounted: function () {
    this.getBillList();
  },
};
</script>

<style>
.unpaid-bill-container {
  border-bottom: solid 1px #e7e7e7;
}

.unpaid-bill-header {
  width: 100vw;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  padding: 0.5px 15px;
  line-height: 4;
  vertical-align: middle;
}

.unpaid-bill-content {
  width: 100vw;
  height: 5rem;
  background: #f2f2f2;

  padding: 10px 15px;
}

.unpaid-bill-content-line {
  height: 1rem;
  display: flex;
  justify-content: space-between;
}
</style>