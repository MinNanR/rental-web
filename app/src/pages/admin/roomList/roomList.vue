<template>
  <view class="page">
    <view class="padding-top padding-left-lg padding-right">
      <view
        class="margin-bottom-sm padding-bottom-xs text-xl flex"
        style="border-bottom: solid 1px #b2b8cb"
      >
        <text
          class="cuIcon-search margin-right-xs"
          style="color: #e2e2e2"
        ></text>
        <input
          type="text"
          v-model="queryForm.roomNumber"
          style="width: 800upx"
          placeholder="输入房间号搜索"
          @cofirm-type="search"
          @confirm="getRoomList()"
        />
        <view class="action" @click="refresh()">
          <text class="cuIcon-refresh"></text>
        </view>
      </view>
    </view>
    <view class="VerticalBox">
      <scroll-view
        class="VerticalNav nav"
        scroll-y
        scroll-with-animation
        :scroll-top="verticalNavTop"
        style="height: calc(100vh - 170upx)"
      >
        <view
          class="cu-item"
          :class="index == tabCur ? 'text-blue cur' : ''"
          v-for="(item, index) in list"
          :key="index"
          @tap="TabSelect"
          :data-id="index"
          style="font-size: 22px"
        >
          {{ item.floor }}楼
        </view>
      </scroll-view>
      <scroll-view
        class="VerticalMain"
        scroll-y
        scroll-with-animation
        style="height: calc(100vh - 170upx)"
        :scroll-into-view="'main-' + mainCur"
        @scroll="VerticalMain"
      >
        <view v-for="(item, index) in list" :key="index" :id="'main-' + index">
          <view class="cu-bar solid-bottom bg-white">
            <view class="action" style="font-size: 22px">
              <text
                class="cuIcon-title text-blue"
                style="font-size: 18px"
              ></text
              >{{ item.floor }}楼</view
            >
          </view>
          <view class="cu-list menu-avatar">
            <template v-for="(room, i) in item.roomList">
              <view class="cu-item" :key="i" @click="refer(room.id)">
                <view
                  class="cu-avatar round lg"
                  :class="'bg-' + statusIconColor[room.statusCode]"
                >
                  <span
                    class="iconfont icon-StudyRoom"
                    style="font-size: 28px"
                  ></span>
                </view>
                <view class="content">
                  <view :class="'text-black'" style="font-size: 20px"
                    >{{ room.roomNumber
                    }}<span style="font-size: 16px; margin-left: 10px"
                      ><text
                        class="cuIcon-round margin-right-xs"
                        :class="'text-' + statusTextColor[room.statusCode]"
                      ></text>
                      <text
                        :class="'text-' + statusTextColor[room.statusCode]"
                        >{{ room.status }}</text
                      ></span
                    ></view
                  >
                  <view> 水：{{ room.water }} 度</view>
                  <view> 电：{{ room.electricity }}度 </view>
                  <view> </view>
                </view>
                <view class="action">
                  <text class="cuIcon-right" style="font-size: 20px"></text>
                </view>
              </view>
            </template>
          </view>
        </view>
        <view
          class="cu-load bg-gray fade"
          v-show="showLoading"
          :class="haveMore ? 'loading' : 'over'"
        ></view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      tabCur: 0,
      mainCur: 0,
      verticalNavTop: 0,
      load: true,
      houseId: 0,
      // colorList: ["red", "blue", "yellow", "green"],
      statusTextColor: {
        VACANT: "gray",
        ON_RENT: "on-rent",
      },
      statusIconColor: {
        VACANT: "grey",
        ON_RENT: "on-rent",
      },
      queryForm: {
        houseId: "",
        roomNumber: "",
      },
      showLoading: false,
      haveMore: true,
    };
  },
  onLoad(params) {
    this.queryForm.houseId = params.id;
    // this.getRoomList();
    uni.setNavigationBarTitle({
      title: params.name,
    });
    // this.listCur = this.list[0];
  },
  onShow() {
    console.log("show");
    this.$nextTick(() => this.getRoomList());
  },
  onReady() {
    uni.hideLoading();
  },
  methods: {
    TabSelect(e) {
      this.tabCur = e.currentTarget.dataset.id;
      this.mainCur = e.currentTarget.dataset.id;
      this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50;
    },
    VerticalMain(e) {
      let that = this;
      let tabHeight = 0;
      if (this.load) {
        for (let i = 0; i < this.list.length; i++) {
          let view = uni
            .createSelectorQuery()
            .select("#main-" + this.list[i].id);
          view
            .fields(
              {
                size: true,
              },
              (data) => {
                this.list[i].top = tabHeight;
                tabHeight = tabHeight + data.height;
                this.list[i].bottom = tabHeight;
              }
            )
            .exec();
        }
        this.load = false;
      }
      let scrollTop = e.detail.scrollTop + 10;
      for (let i = 0; i < this.list.length; i++) {
        if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
          this.verticalNavTop = (this.list[i].id - 1) * 50;
          this.tabCur = this.list[i].id;
          return false;
        }
      }
    },
    getRoomList() {
      this.showLoading = true;
      this.request
        .post("/room/getAllRoom", this.queryForm)
        .then((response) => {
          let { data } = response;
          this.list = data;
          let id = 0;
          this.list.forEach((e) => (e.id = id++));
          this.listCur = this.list[0];
          this.showLoading = false;
          // let roomIdList = data.map(e => e.roomList.map(r => r.id)).flat()
          // this.setStorage("roomIdList", roomIdList)
        })
        .catch((err) => {
          console.error(err);
        });
    },
    refer(id) {
      uni.navigateTo({
        url: `/pages/admin/roomInfo/roomInfo?roomId=${id}`,
        events: {
          acceptDataFromOpenedPage: function (data) {
            console.log(data);
          },
        },
      });
    },
    refresh() {
      this.list = [];
      this.getRoomList();
    },
  },
};
</script>

<style>
.fixed {
  position: fixed;
  z-index: 99;
}

.VerticalNav.nav {
  width: 200upx;
  white-space: initial;
}

.VerticalNav.nav .cu-item {
  width: 100%;
  text-align: center;
  background-color: #fff;
  margin: 0;
  border: none;
  height: 50px;
  position: relative;
}

.VerticalNav.nav .cu-item.cur {
  background-color: #f1f1f1;
}

.VerticalNav.nav .cu-item.cur::after {
  content: "";
  width: 8upx;
  height: 30upx;
  border-radius: 10upx 0 0 10upx;
  position: absolute;
  background-color: currentColor;
  top: 0;
  right: 0upx;
  bottom: 0;
  margin: auto;
}

.VerticalBox {
  display: flex;
}

.VerticalMain {
  background-color: #f1f1f1;
  flex: 1;
}

.bg-on-rent {
  background-color: #08ce65;
  color: white;
}

.text-on-rent {
  color: #08ce65;
}
</style>