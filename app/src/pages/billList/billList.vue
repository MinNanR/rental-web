<template>
  <view class="">
    <view class=""> </view>
    <view
      class="cu-load bg-gray fade"
      v-show="showLoading"
      :class="haveMore ? 'loading' : 'over'"
    ></view>
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
      },
      showLoading: false,
      haveMore: true
    };
  },
  methods: {
    getBillList() {
      this.showLoading = true;
    },
  },
};
</script>

<style>
</style>