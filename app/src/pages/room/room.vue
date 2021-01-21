<template>
  <view class="page">
    <template v-for="(item, index) in houseList">
      <view class="grid col-1" :key="item.id">
        <view
          class="padding-lg margin font-size text-center radius"
          :class="index % 2 == 0 ? 'bg-orange' : 'bg-yellow'"
          @click="refer(item.id, item.houseName)"
        >
          {{ item.houseName }}
        </view>
      </view>
    </template>
  </view>
</template>

<script>
export default {
  data() {
    return {
      houseList: [],
    };
  },
  methods: {
    getHouseList() {
      this.request
        .post("/house/getHouseDropDown", {})
        .then((response) => {
          let { data } = response;
          this.houseList = data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    refer(id, name){
      uni.navigateTo({url : `/pages/roomList/roomList?id=${id}&name=${name}`})
    }
  },
  mounted() {
    this.getHouseList();
  },
};
</script>

<style>
.font-size {
  font-size: 20px;
}

.radius{
  border-radius: 20px;
}
</style>