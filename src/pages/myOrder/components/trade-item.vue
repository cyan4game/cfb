<!-- 订单元素 -->
<template>
  <view class="trade-item" @click="goDetail">
    <!-- 头部信息 -->
    <view class="top">
      <view class="title">
        <text class="status">出售</text>
        <text>CFB</text>
      </view>
      <view class="time">
        <text class="timedown">{{ timeStr }} 待付款</text>
        &gt;
      </view>
    </view>

    <!-- 金额详情 -->
    <view class="amount-box">
      <view class="left">
        <view>时间</view>
        <view>2020/08/13 03:08</view>
      </view>
      <view class="left">
        <view>数量</view>
        <view>10.0000</view>
      </view>
      <view class="left">
        <view>交易金额(CNY)</view>
        <view>￥2000.00</view>
      </view>
      <!-- <view class="total">CNY 10062</view> -->
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

export default {
  name: "tradeItem",
  data() {
    return {
      interval: null,
      time: 300,
      timeStr: "",
    };
  },
  mounted() {
    if (this.time) {
      this.timeStr = secondsToMinutesAndSeconds(this.time);
      this.interval = setInterval(() => {
        this.time--;
        if (this.time) {
          this.timeStr = secondsToMinutesAndSeconds(this.time);
        } else {
          // todo 状态已结束
          clearInterval(this.interval);
        }
      }, 1000);
    }
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
  },
  methods: {
    // 跳转到详情
    goDetail() {
        uni.navigateTo({
             url: '/pages/myOrder/info'
        })
    }
  }
};
</script>

<style lang="scss" scoped>
.trade-item {
  height: 300rpx;
  border-radius: 9rpx;
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 43rpx;
  font-weight: 400;
  .top {
    height: 103rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26rpx;
    .title {
      display: flex;
      align-items: center;
      font-weight: 500;
      color: #343635;
      .status {
        color: #da3030;
        margin-right: 10rpx;
      }
    }
    .time {
      color: #f09831;
      .timedown {
        margin-right: 10rpx;
      }
    }
  }
  .amount-box {
    height: 158rpx;
    .left {
      color: #696969;
      font-size: 28rpx;
      line-height: 55rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .total {
      flex: 1;
      font-weight: 500;
      color: #343635;
      font-size: 46rpx;
      display: flex;
      align-items: center;
      justify-content: flex-end;
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
