<template>
  <view class="page">
    <view class="tabbar-container">
      <view
        class="tabbar-item"
        :class="className.tabbar1"
        ref="tabbar1"
        @click="switchTabbar1()"
      >
        <text class="cuIcon-moneybagfill" style="margin-right: 10px"></text>
        未缴房租
      </view>
      <view
        class="tabbar-item"
        :class="className.tabbar2"
        ref="tabbar2"
        @click="switchTabbar2()"
      >
        <text class="cuIcon-form" style="margin-right: 10px"></text>
        未出收据
      </view>
    </view>
    <unpaid-bill v-show="currentPage === 'unpaidBill'"></unpaid-bill>
    <unprinted-bill v-show="currentPage === 'unprintedBill'"></unprinted-bill>
  </view>
</template>

<script>
import unpaidBill from "./unpaidBill.vue";
import unprintedBill from "./unprintedBill.vue";

export default {
  components: {
    "unpaid-bill": unpaidBill,
    "unprinted-bill": unprintedBill,
  },
  data() {
    return {
      title: "hi",
      className: {
        tabbar1: "tabbar-active",
        tabbar2: "",
      },
      currentPage: "unpaidBill",
    };
  },
  onLoad() {},
  methods: {
    clickMethod() {
      this.request
        .post("/house/getHouseList", { pageSize: 10, pageIndex: 1 })
        .then((response) => {
          let { data } = response;
          console.log(data);
        });
    },
    switchTabbar1() {
      this.className.tabbar1 = "tabbar-active";
      this.className.tabbar2 = "";
      this.currentPage = "unpaidBill";
    },
    switchTabbar2() {
      this.className.tabbar2 = "tabbar-active";
      this.className.tabbar1 = "";
      this.currentPage = "unprintedBill";
    },
  },
};
</script>

<style>
.tabbar-container {
  display: flex;
  justify-content: space-between;
  height: 2rem;
}

.tabbar-item {
  line-height: 2;
  width: 50%;
  text-align: center;
  vertical-align: middle;
  font-size: 16px;
}

.tabbar-active {
  color: #5e99ff;
  border-bottom: solid 1px;
}
</style>
