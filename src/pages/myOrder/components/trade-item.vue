<!-- 订单元素 -->
<template>
  <view class="trade-item" @click="goDetail">
    <!-- 头部信息 -->
    <view class="top">
      <view class="title">
        <coin-icon
          :coin="item.buyCoin || item.payCoin || 'CFB'"
          style="width: 55rpx; height: 54rpx; margin-right: 10rpx"
        />
        <text class="status">{{ orderTypeMap[item.orderType] || '--' }}</text>
        <text>{{ item.buyCoin || item.payCoin || 'CFB' }}</text>
      </view>
      <view class="time">
        <text class="timedown" :style="{'color':orderStatusColorMap[item.orderStatus]}">{{
          getOrderStatusMap(item.orderType)[item.orderStatus] || '--'
        }}</text>
      </view>
    </view>

    <!-- 金额详情 -->
    <view class="amount-box">
      <view class="left">
        <view>数量</view>
        <view class="val">{{ item.buyAmount }}</view>
      </view>
      <view class="left">
        <view>交易金额(CNY)</view>
        <view class="val">￥{{ item.payAmount }}</view>
      </view>
      <view class="left">
        <view>时间</view>
        <view class="val time">{{ getTimestr(item.dealTime) }}</view>
      </view>
    </view>

    <!-- 底部信息 -->
    <!-- <view class="bottom">
      <view class="seller">
        <view class="avatar">诚</view>
        <view>诚信商行</view>
      </view>
      <view class="date">2023/06/17 13:00</view>
    </view> -->
  </view>
</template>

<script>
import { secondsToMinutesAndSeconds } from "@/utils/utils";
import { getOrderStatusMap, orderTypeMap, orderStatusColorMap } from "../map.js";
import { getTimestr } from "@/utils/time";
import storage from "@/utils/storage";

export default {
  name: "tradeItem",
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      orderStatusColorMap,
      orderTypeMap,
      interval: null,
      time: 300,
      timeStr: "",
    };
  },
  mounted() {
    // if (this.time) {
    //   this.timeStr = secondsToMinutesAndSeconds(this.time);
    //   this.interval = setInterval(() => {
    //     this.time--;
    //     if (this.time) {
    //       this.timeStr = secondsToMinutesAndSeconds(this.time);
    //     } else {
    //       // todo 状态已结束
    //       clearInterval(this.interval);
    //     }
    //   }, 1000);
    // }
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
  },
  methods: {
    getOrderStatusMap,
    getTimestr,
    // 跳转到详情
    goDetail() {
      storage.set("curr-order", this.item);
      setTimeout(() => {
        uni.navigateTo({
          url: "/pages/myOrder/info",
        });
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.trade-item {
  border-radius: 9rpx;
  background-color: #fff;
  box-sizing: border-box;
  padding: 27rpx 43rpx 0 56rpx;
  font-weight: 400;
  height: 267rpx;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30rpx;
    margin-bottom: 20rpx;
    .title {
      display: flex;
      align-items: center;
      font-weight: 500;
      color: #343635;
      .status {
        color: #c81829;
        margin-right: 10rpx;
      }
    }
    .time {
      color: #449367;
      .timedown {
        // margin-right: 10rpx;
      }
    }
  }
  .amount-box {
    box-sizing: border-box;
    .left {
      color: #686868;
      font-size: 28rpx;
      line-height: 50rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      display: flex;
      justify-content: space-between;
      .val {
        color: #8c8c8c;
      }
    }
    .time {
      color: #686868;
      font-size: 26rpx;
    }
  }
  .bottom {
    height: 103rpx;
    border-top: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #686868;
    font-size: 26rpx;
    .seller {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      color: #484848;
      .avatar {
        background-color: #449367;
        color: #fff;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        margin-right: 15rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
      }
    }
  }
}
</style>
