<template>
  <view class="">
    <view class="flex margin-top" style="background: #ffffff">
      <view class="basis-sub padding" style="width: 102px;  height: 102px" st>
        <!-- #ifdef MP-WEIXIN -->
        <open-data type="userAvatarUrl"></open-data>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <image
          src="/static/logo.png"
          style="width: 102px;  height: 72px"
        ></image>
        <!-- #endif -->
      </view>
      <view class="text-xl">
        <view class="padding-lr padding-top text-xl">
          <!-- #ifdef MP-WEIXIN -->
          <open-data type="userNickName"></open-data>
          <!-- #endif -->
          <!-- #ifndef MP-WEIXIN -->
          用户名
          <!-- #endif -->
        </view>
        <view class="padding-lr padding-top text-lg">
          {{ realName }}
        </view>
      </view>
    </view>
    <view class="margin-top">
      <view class="cu-list menu">
        <view class="cu-item">
          <view class="content">
            <text class="cuIcon-lock text-red font-size-20"></text>
            <text class="text-grey">修改密码</text>
          </view>
        </view>
        <view class="cu-item" @click="showChangePriceModal()">
          <view class="content flex align-center">
            <view class="margin-xs">
              <span
                class="iconfont icon-shuidian text-blue"
                style="font-size: 22px"
              ></span
            ></view>
            <text class="text-grey">设置水电价格</text>
          </view>
        </view>
        <view class="cu-item" @click="toBillList()">
          <view class="content">
            <text class="cuIcon-form text-yellow font-size-20"></text>
            <text class="text-grey">历史账单</text>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-modal" :class="changePriceModal ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">修改水电门卡价格</view>
          <view class="action" @tap="hideChangePriceModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view>
          <form>
            <view class="cu-form-group">
              <view class="title font-size-17">水费</view>
              <input
                type="text"
                v-model.number="price.waterPrice"
                style="text-align: right"
              />
              元/度
            </view>
            <view class="cu-form-group">
              <view class="title font-size-17">电费</view>
              <input
                type="text"
                v-model.number="price.electricityPrice"
                style="text-align: right"
              />
              元/度
            </view>
            <!-- <view class="cu-form-group">
              <view class="title font-size-17">门卡</view>
              <input type="text" v-model="price.accessCardPrice" />
              元/张
            </view> -->
            <block v-for="(item, index) in price.accessCardPrice" :key="index">
              <view class="cu-form-group">
                <view class="title font-size-17">
                  {{ item.key }}
                </view>
                <input
                  type="text"
                  v-model.number="item.value"
                  style="text-align: right"
                />
                元/张
              </view>
            </block>
          </form>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button
              class="cu-btn line-green text-green"
              @tap="hideChangePriceModal"
            >
              取消
            </button>
            <button class="cu-btn bg-green margin-left" @tap="changePrice()">
              确定
            </button>
          </view>
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
export default {
  data() {
    return {
      realName: "民难",
      changePriceModal: false,
      price: {
        waterPrice: 0,
        electricityPrice: 0,
        accessCardPrice: 0,
      },
      loadingModal: false,
      loadingMessage: "",
    };
  },
  methods: {
    showChangePriceModal() {
      this.loadingMessage = "加载中...";
      this.loadingModal = true;
      this.request.post("/bill/getUtilityPrice", {}).then((response) => {
        let { data } = response;
        let accessCardPrice = [];
        for (let item in data.accessCardPrice) {
          accessCardPrice.push({
            key: item,
            value: data.accessCardPrice[item],
          });
        }
        this.price = data;
        this.price.accessCardPrice = accessCardPrice;

        this.loadingModal = false;
        this.$nextTick(() => {
          this.changePriceModal = true;
        });
      });
    },
    hideChangePriceModal() {
      this.changePriceModal = false;
    },
    changePrice() {
      this.loadingMessage = "保存中...";
      this.loadingModal = true;
      let { waterPrice, electricityPrice, accessCardPrice } = this.price;
      let cardPrice = {};
      for (let index in accessCardPrice) {
        cardPrice[accessCardPrice[index]["key"]] =
          accessCardPrice[index]["value"];
      }
      this.request
        .post("/bill/setUtilityPrice", {
          waterPrice: waterPrice,
          electricityPrice: electricityPrice,
          accessCardPrice: cardPrice,
        })
        .then((response) => {
          this.loadingModal = false;
          this.changePriceModal = false;
        })
        .then((err) => {
          console.error(err);
        });
    },
    toBillList() {
      uni.navigateTo({ url: "/pages/billList/billList" });
    },
  },
  onShow() {
    // #ifdef MP-WEIXIN
    uni.login({
      provider: "weixin",
      success: function (authResult, code, errMsg) {
        console.log(authResult, code, errMsg);
        uni.getUserInfo({
          provider: "weixin",
          withCredentials: true,
          success: (userInfo) => {
            console.log(userInfo);
          },
          fail: (a, b, c, d) => {
            console.log(a, b, c, d);
          },
        });
      },
      fail: function (authResult, code, errMsg) {
        console.log(authResult, code, errMsg);
      },
    });
    // #endif
  },
};
</script>

<style>
.font-size-20 {
  font-size: 20px;
}
</style>