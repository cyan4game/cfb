<!-- 统计 -->
<template>
  <uni-popup ref="popup">
    <view class="home-total">
      <view class="title">
        <text>资产分布详情</text>
        <view class="close" @click="close">×</view>
      </view>

      <view class="draw-box">
        <qiun-data-charts
          style="width: 100%; height: 100%"
          type="ring"
          :opts="opts"
          :chartData="chartData"
        />
      </view>

      <view class="bottom">
        <view class="item" v-for="(item, i) in datas" :key="i">
          <view
            class="border"
            :style="{ backgroundColor: opts.color[i] }"
          ></view>
          <text>{{ item.name }}：{{ item.value }}</text>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import qiunDataCharts from "../../../components/ucharts/components/qiun-data-charts/qiun-data-charts";

export default {
  name: "homeTotal",
  data() {
    return {
      datas: [
        { name: "CFB", value: 100 },
        { name: "USDT", value: 100 },
        { name: "BTC", value: 100 },
        { name: "ETH", value: 90 },
      ],
      chartData: {
        series: [
          {
            data: [
              { name: "CFB", value: 100 },
              { name: "USDT", value: 100 },
              { name: "BTC", value: 100 },
              { name: "ETH", value: 90 },
            ],
          },
        ],
      },
      opts: {
        color: [
          "#6894FD",
          "#3EBFA3",
          "#FD9C63",
          "#DD547A",
          "#73C0DE",
          "#3CA272",
          "#9A60B4",
          "#ea7ccc",
        ],
        padding: [10, 10, 10, 10],
        dataLabel: false,
        enableScroll: false,
        disablePieStroke: true, // 隐藏提示线
        disablePieText: true, // 隐藏文字提示
        legend: {
          show: false,
        },
        title: {
          name: "总资产",
          fontSize: 15,
          color: "#3a3a3a",
        },
        subtitle: {
          name: "≈ ￥32588",
          fontSize: 15,
          color: "#3a3a3a",
        },
        extra: {
          ring: {
            showBox: false,
            ringWidth: 30,
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: false,
            borderWidth: 3,
            borderColor: "#FFFFFF",
          },
        },
      },
    };
  },
  components: {
    qiunDataCharts,
  },
  methods: {
    // 打开
    open() {
      this.$refs.popup.open();
    },
    // 关闭
    close() {
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.home-total {
  width: 629rpx;
  height: 824rpx;
  background-color: #fff;
  border-radius: 6rpx;
  box-sizing: border-box;
  padding: 60rpx 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  font-weight: 400;
  .draw-box {
    width: 397rpx;
    height: 397rpx;
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #323232;
    font-size: 36rpx;
    font-weight: 500;
    position: relative;
    width: 100%;
    .close {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      background-color: #eeeeee;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #888888;
      font-size: 26rpx;
      line-height: 20rpx;
      position: absolute;
      right: 20rpx;
    }
  }
  .bottom {
    height: 144rpx;
    background-color: #f6f6f6;
    border-radius: 6rpx;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    box-sizing: border-box;
    padding: 40rpx;
    .item {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: #1d1d1d;
      font-size: 26rpx;
      .border {
        width: 19rpx;
        height: 19rpx;
        border-radius: 50%;
        margin-right: 20rpx;
        background-color: #eee;
      }
    }
  }
}
</style>
