<template>
  <view>
    <scroll-view
      scroll-y
      class="indexes"
      :scroll-into-view="'indexes-' + listCurID"
      :style="[{ height: 'calc(100vh  - 50px)' }]"
      :scroll-with-animation="true"
      :enable-back-to-top="true"
    >
      <block v-for="(item, index) in list" :key="index">
        <view :id="'indexes-' + item.key" :data-index="item.name">
          <view class="padding">{{ item.key }}</view>
          <view class="cu-list menu-avatar no-padding">
            <view
              class="cu-item"
              v-for="(tenant, sub) in item.tenantList"
              :key="sub"
               @click="toModifyTenant(tenant.id)"
            >
              <view class="cu-avatar round lg">{{ item.key }}</view>
              <view class="content">
                <view class="text-black" style="font-size: 17px">{{ tenant.name }}</view>
                <view class="text-cyan text-sm">
                  {{ tenant.room }}
                </view>
                <view class="text-brown text-sm">
                  {{ tenant.phone }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </block>
    </scroll-view>
    <view class="indexBar" :style="[{ height: 'calc(100vh - 50px)' }]">
      <view
        class="indexBar-box"
        @touchstart="tStart"
        @touchend="tEnd"
        @touchmove.stop="tMove"
      >
        <view
          class="indexBar-item"
          v-for="(item, index) in list"
          :key="index"
          :id="index"
          @touchstart="getCur"
          @touchend="setCur"
        >
          {{ item.key }}</view
        >
      </view>
    </view>
    <!--选择显示-->
    <view v-show="!hidden" class="indexToast">
      {{ listCur }}
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      StatusBar: this.StatusBar,
      CustomBar: this.CustomBar,
      hidden: true,
      listCurID: "",
      list: [],
      // list:[],
      listCur: "",
    };
  },
  onLoad() {
    // let list = [{}];
    // for (let i = 0; i < 26; i++) {
    //   list[i] = {};
    //   list[i].name = String.fromCharCode(65 + i);
    // }
    // this.list = list;
    // this.listCur = list[0];
  },
  onShow() {
    this.getTenantList();
  },
  onReady() {
    let that = this;
    uni
      .createSelectorQuery()
      .select(".indexBar-box")
      .boundingClientRect(function (res) {
        that.boxTop = res.top;
      })
      .exec();
    uni
      .createSelectorQuery()
      .select(".indexes")
      .boundingClientRect(function (res) {
        that.barTop = res.top;
      })
      .exec();
  },
  methods: {
    //获取文字信息
    getCur(e) {
      this.hidden = false;
      this.listCur = this.list[e.target.id].key;
    },
    setCur(e) {
      this.hidden = true;
      this.listCur = this.listCur;
    },
    //滑动选择Item
    tMove(e) {
      let y = e.touches[0].clientY,
        offsettop = this.boxTop,
        that = this;
      //判断选择区域,只有在选择区才会生效
      if (y > offsettop) {
        let num = parseInt((y - offsettop) / 20);
        this.listCur = that.list[num].name;
      }
    },

    //触发全部开始选择
    tStart() {
      this.hidden = false;
    },

    //触发结束选择
    tEnd() {
      this.hidden = true;
      this.listCurID = this.listCur;
    },
    indexSelect(e) {
      let that = this;
      let barHeight = this.barHeight;
      let list = this.list;
      let scrollY = Math.ceil((list.length * e.detail.y) / barHeight);
      for (let i = 0; i < list.length; i++) {
        if (scrollY < i + 1) {
          that.listCur = list[i].name;
          that.movableY = i * 20;
          return false;
        }
      }
    },
    getTenantList() {
      this.request.post("/tenant/getTenantList/app", {}).then((response) => {
        let { data } = response;
        this.list = data;
      });
    },
    toModifyTenant(id){
      uni.navigateTo({url: `/pages/modifyTenant/modifyTenant?id=${id}`})
    }
  },
};
</script>

<style>
.indexes {
  position: relative;
}

.indexBar {
  position: fixed;
  right: 0px;
  bottom: 0px;
  padding: 20upx 20upx 20upx 60upx;
  display: flex;
  align-items: center;
}

.indexBar .indexBar-box {
  width: 40upx;
  height: auto;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
  border-radius: 10upx;
}

.indexBar-item {
  flex: 1;
  width: 40upx;
  height: 40upx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24upx;
  color: #888;
}

movable-view.indexBar-item {
  width: 40upx;
  height: 40upx;
  z-index: 9;
  position: relative;
}

movable-view.indexBar-item::before {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 10upx;
  height: 20upx;
  width: 4upx;
  background-color: #f37b1d;
}

.indexToast {
  position: fixed;
  top: 0;
  right: 80upx;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100upx;
  height: 100upx;
  border-radius: 10upx;
  margin: auto;
  color: #fff;
  line-height: 100upx;
  text-align: center;
  font-size: 48upx;
}
</style>
