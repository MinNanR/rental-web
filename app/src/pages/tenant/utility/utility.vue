<template>
  <view class="">
    <view class="qiun-columns">
      <view class="qiun-bg-white qiun-title-bar qiun-common-mt">
        <view class="qiun-title-dot-light">近6个月用水量</view>
      </view>
      <view class="qiun-charts">
        <!--#ifndef MP-ALIPAY -->
        <canvas
          canvas-id="canvasColumn-water"
          id="canvasColumn-water"
          class="charts"
        ></canvas>
        <!--#endif-->
      </view>
    </view>
    <view class="qiun-columns">
      <view class="qiun-bg-white qiun-title-bar qiun-common-mt">
        <view class="qiun-title-dot-light">近6个月用电量</view>
      </view>
      <view class="qiun-charts">
        <!--#ifndef MP-ALIPAY -->
        <canvas
          canvas-id="canvasColumn-electricty"
          id="canvasColumn-electricty"
          class="charts"
        ></canvas>
        <!--#endif-->
      </view>
    </view>
    <view class="font-size-17 text-center margin-top padding bg-white">
      <view class="flex bg-cyan" style="">
        <view class="flex-twice padding solid"> 时间 </view>
        <view class="flex-sub padding solid"> 水表行度 </view>
        <view class="flex-sub padding solid"> 电表行度 </view>
      </view>
      <view
        v-for="(item, index) in utilityList"
        :key="index"
        class="flex bg-white"
      >
        <view class="flex-twice padding solid" style="font-size: 15px">
          <view
            class="cu-tag badge"
            v-if="item.statusCode === 'RECORDING'"
            style="top: 0"
            >当前行度</view
          >
          {{ item.updateTime }}
        </view>
        <view class="flex-sub padding solid"> {{ item.water }}度 </view>
        <view class="flex-sub padding solid"> {{ item.electricity }}度 </view>
      </view>
    </view>
    <view
      class="cu-load bg-gray fade"
      v-show="showLoading"
      :class="haveMore ? 'loading' : 'over'"
    ></view>
  </view>
</template>

<script>
import uCharts from "../../../components/u-charts/u-charts.js";

export default {
  component: { uCharts },
  data() {
    return {
      roomId: "",
      utilityList: [],
      queryForm: {
        pageIndex: 1,
        pageSize: 10,
      },
      showLoading: false,
      haveMore: true,
      cWidth: "",
      cHeight: "",
      pixelRatio: 1,
      serverData: "",
      canvasColumn: null,
    };
  },
  methods: {
    getUtilityList() {
      this.showLoading = true;
      this.request
        .post("/utility/getUtilityListByTenant", this.queryForm)
        .then((response) => {
          let { data } = response;
          if (this.queryForm.pageIndex === 1) {
            this.utilityList = data.list;
          } else {
            this.utilityList = this.utilityList.concat(data.list);
          }
          this.haveMore = this.utilityList.length >= data.totalCount;
          this.showLoading = false;
        });
    },
    showColumn(canvasId, chartData) {
      this.canvasColumn = new uCharts({
        $this: this,
        canvasId: canvasId,
        type: "mix",
        legend: true,
        fontSize: 11,
        background: "#FFFFFF",
        pixelRatio: this.pixelRatio,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disableGrid: true,
        },
        yAxis: { max: chartData.max + 10, min: 0 },
        dataLabel: true,
        width: this.cWidth * this.pixelRatio,
        height: this.cHeight * this.pixelRatio,
        extra: {
          column: {
            width:
              (this.cWidth * this.pixelRatio * 0.45) /
              chartData.categories.length,
          },
        },
      });
    },
    getChartData() {
      this.request.post("/bill/getChartData", {}).then((response) => {
        let { data } = response;
        let chartDataWater = {
          categories: [],
          series: [
            { name: "用水量", type: "column", data: [] },
            {
              name: "用水量变化曲线",
              type: "line",
              data: [],
              color: "#243052",
            },
          ],
          max: 0,
        };
        let chartDataElectricity = {
          categories: [],
          series: [
            { name: "用水量", type: "column", data: [] },
            {
              name: "用水量变化曲线",
              type: "line",
              data: [],
              color: "#243052",
            },
          ],
          max: 0,
        };
        let waterMax = 0;
        let electricityMax = 0;
        data.forEach((item) => {
          chartDataWater.categories.push(item.time);
          chartDataElectricity.categories.push(item.time);
          chartDataWater.series[0].data.push(item.water);
          chartDataWater.series[1].data.push(item.water);
          chartDataElectricity.series[0].data.push(item.electricity);
          chartDataElectricity.series[1].data.push(item.electricity);
          chartDataWater.max =
            item.water > chartDataWater.max ? item.water : chartDataWater.max;
          chartDataElectricity.max =
            item.electricity > chartDataElectricity.max
              ? item.electricity
              : chartDataElectricity.max;
        });
        this.showColumn("canvasColumn-water", chartDataWater);
        this.showColumn("canvasColumn-electricty", chartDataElectricity);
      });
    },
  },
  onLoad(params) {
    this.cWidth = uni.upx2px(750);
    this.cHeight = uni.upx2px(500);
  },
  onShow() {
    this.getUtilityList()
    this.getChartData();
  },
};
</script>

<style>
.font-size-17 {
  font-size: 17px;
}

page {
  background: #f2f2f2;
  width: 750upx;
  overflow-x: hidden;
}
.qiun-padding {
  padding: 2%;
  width: 96%;
}
.qiun-wrap {
  display: flex;
  flex-wrap: wrap;
}
.qiun-rows {
  display: flex;
  flex-direction: row !important;
}
.qiun-columns {
  display: flex;
  flex-direction: column !important;
}
.qiun-common-mt {
  margin-top: 10upx;
}
.qiun-bg-white {
  background: #ffffff;
}
.qiun-title-bar {
  width: 96%;
  padding: 10upx 2%;
  flex-wrap: nowrap;
}
.qiun-title-dot-light {
  border-left: 10upx solid #0ea391;
  padding-left: 10upx;
  font-size: 32upx;
  color: #000000;
}
/* 通用样式 */
.qiun-charts {
  width: 750upx;
  height: 500upx;
  background-color: #ffffff;
}
.charts {
  width: 750upx;
  height: 500upx;
  background-color: #ffffff;
}
</style>