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
        <view class="font-size-17"> 楼层：{{ roomInfo.floor }} </view>
      </view>
      <view class="padding solid flex">
        <view class="font-size-20">
          <text class="cuIcon-moneybag margin-right-xs text-yellow"></text>
        </view>
        <view class="font-size-17"> 房价：{{ roomInfo.price }} </view>
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
</style>