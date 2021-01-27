<template>
  <view class="">
    <view class="flex justify-around">
      <view class="padding"> 房屋下拉框 </view>
      <view class="padding"> 楼层下拉框 </view>
    </view>
    <view class="cu-modal" :class="houseModal ? 'show' : ''" @tap="hideModal">
      <view class="cu-dialog" @tap.stop="">
        <radio-group class="block" @change="RadioChange">
          <view class="cu-list menu text-left">
            <view class="cu-item" v-for="(item, index) in 5" :key="index">
              <label class="flex justify-between align-center flex-sub">
                <view class="flex-sub">Item {{ index + 1 }}</view>
                <radio
                  class="round"
                  :class="radio == 'radio' + index ? 'checked' : ''"
                  :checked="radio == 'radio' + index ? true : false"
                  :value="'radio' + index"
                ></radio>
              </label>
            </view>
          </view>
        </radio-group>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      houseId: 0,
      floor: 0,
      houseModal:false,
      floorModal:false,
      houseDoprDown:{},
    }
  },
  methods: {
    getFloorDropDown() {
      this.request.post("/room/getFloorDropDown", {}).then((response) => {
      })
      .catch(err => {
        console.error(err);
      })
    },
  },
  onShow() {
    this.getHouseDropDown();
  },
};
</script>

<style>
</style>