<template>
  <view class="page">
    <view class="grid col-1">
      <view class="padding solid flex">
        <view class="font-size-20">
          <text class="cuIcon-home margin-right-xs text-blue"></text>
        </view>
        <view class="font-size-17"> 房屋：{{ roomInfo.houseName }} </view>
      </view>
      <view class="padding solid flex">
        <view>
          <span
            class="iconfont icon-StudyRoom text-red margin-right-xs font-size-20"
          ></span>
        </view>
        <view class="font-size-17"> 房号：{{ roomInfo.roomNumber }} </view>
      </view>
      <view class="padding solid flex">
        <view class="font-size-20">
          <text class="cuIcon-list margin-right-xs text-red"></text>
        </view>
        <view class="font-size-17"> 楼层：{{ roomInfo.floor }}楼 </view>
      </view>
      <view class="padding solid flex justify-between">
        <view class="flex">
          <view class="font-size-20">
            <text class="cuIcon-moneybag margin-right-xs text-yellow"></text>
          </view>
          <view class="font-size-17"> 租金：{{ roomInfo.price }}元 </view>
        </view>
        <view class="font-size-17">
          <button class="bg-blue cu-btn sm" @click="showChangePriceModal()">
            <span class="font-size-17">
              <text class="cuIcon-settingsfill"></text> 设置租金
            </span>
          </button></view
        >
      </view>
      <view class="padding solid flex">
        <view class="font-size-20">
          <text
            :class="
              'cuIcon-' +
              statusIcon[roomInfo.statusCode] +
              ' margin-right-xs text-' +
              statusColor[roomInfo.statusCode]
            "
          ></text>
        </view>
        <view class="font-size-17"> 状态：{{ roomInfo.status }} </view>
      </view>
      <block v-for="(t, index) in tenantList" :key="index">
        <view class="flex solid-bottom" @click="showTenantDetails(index)">
          <view class="basis-xl">
            <view class="padding-sm flex">
              <view class="font-size-20">
                <text class="cuIcon-people margin-right-xs text-olive"></text>
              </view>
              <view class="font-size-17" v-if="tenantList.length > 1">
                <text> 居住人{{ index + 1 }}：{{ t.name }} </text>
              </view>
              <view class="font-size-17" v-else> 居住人：{{ t.name }}</view>
            </view>
          </view>
          <view class="padding-xs" style="font-size: 20px">
            <text class="cuIcon-roundright" v-show="!t.show"></text>
            <text class="cuIcon-rounddown" v-show="t.show"></text>
          </view>
        </view>
        <view v-show="t.show" class="bg-gray" style="font-size: 14px">
          <view class="flex">
            <view class="basis-sm padding-xs"> 姓名： </view>
            <view class="basis-lg padding-xs">
              {{ t.name }}
            </view>
          </view>
          <view class="flex">
            <view class="basis-sm padding-xs"> 性别： </view>
            <view class="basis-lg padding-xs">
              {{ t.gender }}
            </view>
          </view>
          <view class="flex">
            <view class="basis-sm padding-xs"> 联系电话： </view>
            <view class="basis-lg padding-xs">
              {{ t.phone }}
            </view>
          </view>
          <view class="flex">
            <view class="basis-sm padding-xs"> 籍贯： </view>
            <view class="basis-lg padding-xs">
              {{ t.hometown }}
            </view>
          </view>
          <view class="flex">
            <view class="basis-sm padding-xs"> 身份证号码： </view>
            <view class="basis-lg padding-xs">
              {{ t.identificationNumber }}
            </view>
          </view>
          <view class="flex">
            <view class="basis-sm padding-xs"> 出生日期： </view>
            <view class="basis-lg padding-xs">
              {{ t.birthday }}
            </view>
          </view>
          <view class="flex justify-start">
            <view class="padding-xs">
              <button class="cu-btn bg-green shadow-blur round">修改</button>
            </view>
            <view class="padding-xs">
              <button class="cu-btn bg-red shadow-blur round">离开</button>
            </view>
          </view>
        </view>
      </block>
    </view>
    <view class="box">
      <view class="cu-bar btn-group foot">
        <button
          class="cu-btn bg-green shadow-blur round lg"
          @click="showChangeTenantModal()"
        >
          添加房客
        </button>
        <button
          class="cu-btn bg-red shadow-blur round lg"
          v-if="roomInfo.statusCode == 'ON_RENT'"
        >
          全部退租
        </button>
        <button class="cu-btn bg-blue shadow-blur round lg">登记水电</button>
      </view>
    </view>
    <view class="cu-modal" :class="changePriceModal ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">修改房租</view>
          <view class="action" @tap="hideChangePriceModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view>
          <form>
            <view class="cu-form-group">
              <view class="title font-szie-17">房租</view>
              <input type="text" v-model="priceToChange" :focus="inputFocus" />
              元
            </view>
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
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      roomInfo: {},
      tenantList: [],
      statusIcon: {
        ON_RENT: "roundcheckfill",
        VACANT: "roundclosefill",
      },
      statusColor: {
        ON_RENT: "green",
        VACANT: "red",
      },
      changePriceModal: false,
      changeTenantModal: false,
      priceToChange: null,
      inputFocus: false,
      eventChannel: null,
      search: "",
      searchResult: [],
    };
  },
  methods: {
    getRoomInfo() {
      this.request
        .post("/room/getRoomInfo", { id: this.id })
        .then((response) => {
          let { data } = response;
          this.roomInfo = data;
          uni.setNavigationBarTitle({
            title: `${data.houseName}-${data.roomNumber}`,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getTeant() {
      this.request
        .post("/tenant/getTenantByRoom", { roomId: this.id })
        .then((resposne) => {
          let { data } = resposne;
          data.forEach((e) => (e.show = false));
          this.tenantList = data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    showChangePriceModal() {
      console.log(this.roomInfo.price);
      this.priceToChange = this.roomInfo.price;
      this.changePriceModal = true;
      this.inputFocus = true;
    },
    hideChangePriceModal() {
      this.changePriceModal = false;
    },
    changePrice() {
      this.request
        .post("/room/updateRoom", {
          id: this.id,
          price: this.priceToChange,
        })
        .then((response) => {
          this.changePriceModal = false;
          this.getRoomInfo();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    showChangeTenantModal() {
      let roomInfo = this.roomInfo;
      uni.navigateTo({
        url: `/pages/addTenant/addTenant?roomId=${this.id}&roomNumber=${roomInfo.roomNumber}&houseId=${roomInfo.houseId}&houseName=${roomInfo.houseName}`,
      });
      this.changeTenantModal = true;
    },
    hideChangeTenantModal() {
      this.changeTenantModal = false;
    },
    getTenantDropDown() {
      this.request
        .post("/tenant/getTenantDropDown", {
          roomId: this.id,
          name: this.search,
        })
        .then((response) => {
          let { data } = response;
          this.searchResult = data;
          this.searchResult.forEach((e) => (e.selected = false));
        })
        .catch((err) => {
          console.error(err);
        });
    },
    selectTenant(index) {
      console.log(this.searchResult[index]);
      console.log(this.searchResult[index]["selected"]);
      this.searchResult[index].selected = !this.searchResult[index].selected;
    },
    leave(id) {
      console.log(id);
    },
    showTenantDetails(index) {
      this.tenantList[index].show = !this.tenantList[index].show;
    },
  },
  onLoad(params) {
    this.id = params.roomId;
    // this.getRoomInfo();
    // this.getTeant();
  },
  onShow() {
    this.$nextTick(() => {
      this.getRoomInfo();
      this.getTeant();
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

.box {
  margin: 20upx 0;
}

.box view.cu-bar {
  margin-top: 20upx;
}

.cu-form-group .title {
  min-width: calc(4em + 15px);
  font-size: 17px;
}

.cu-form-group {
  font-size: 17px;
}
</style>