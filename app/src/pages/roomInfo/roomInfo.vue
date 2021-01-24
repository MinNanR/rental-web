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
      <template v-for="(t, index) in tenantList">
        <view class="" :key="index">
          <view class="padding-sm flex">
            <view class="font-size-20">
              <text class="cuIcon-people margin-right-xs text-olive"></text>
            </view>
            <view class="font-size-17" v-if="tenantList.length > 1">
              <text> 居住人{{ index + 1 }}：{{ t.name }} </text>
            </view>
            <view class="font-size-17" v-else> 居住人：{{ t.name }}</view>
          </view>
          <view class="padding-sm flex">
            <view class="font-size-20">
              <text class="cuIcon-phone margin-right-xs text-yellow"></text>
            </view>
            <view class="font-size-17"> 联系电话：{{ t.phone }} </view>
          </view>
          <view class="padding-sm solid-bottom flex">
            <view class="font-size-20">
              <text class="cuIcon-homefill margin-right-xs text-brown"></text>
            </view>
            <view class="font-size-17"> 籍贯：{{ t.hometown }} </view>
          </view>
        </view>
      </template>
    </view>
    <view class="box">
      <view class="cu-bar btn-group foot">
        <button
          class="cu-btn bg-green shadow-blur round lg"
          @click="showChangeTenantModal()"
        >
          修改房客
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
    <view class="cu-modal" :class="changeTenantModal ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">修改房客</view>
          <view class="action" @tap="hideChangeTenantModal()">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="cu-bar search bg-white">
          <view class="search-form round">
            <text class="cuIcon-search"></text>
            <input
              :adjust-position="false"
              type="text"
              placeholder="搜索房客"
              confirm-type="search"
              @confirm="getTenantDropDown"
              v-model="search"
            />
          </view>
          <view class="action">
            <button
              class="cu-btn bg-green shadow-blur round"
              @click="getTenantDropDown"
            >
              搜索
            </button>
          </view>
        </view>
        <view>
          <view class="grid col-3">
            <template v-for="(tenant, index) in searchResult">
              <view class="padding solid" :key="index">
                {{ tenant.name }}
              </view>
              <view class="padding solid" :key="tenant.name">
                {{ tenant.roomNumber }}
              </view>
              <view class="padding solid" :key="tenant.id">
                <button
                  class="cu-btn sm bg-blue round"
                  @click="selectTenant(index)"
                  v-show="!tenant.selected"
                >
                  添加
                </button>
                <button
                  class="cu-btn sm line-green"
                  v-show="tenant.selected"
                  @click="selectedTenant(index)"
                >
                  <text class="cuIcon-check"></text> 已选择
                </button>
              </view>
            </template>
          </view>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button
              class="cu-btn line-green text-green"
              @tap="hideChangeTenantModal()"
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
  },
  onLoad(params) {
    this.id = params.roomId;
    this.getRoomInfo();
    this.getTeant();
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