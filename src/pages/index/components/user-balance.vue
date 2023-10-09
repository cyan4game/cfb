<!-- 用户资产 -->
<template>
  <view class="user-banlance">
    <!-- 弹出详情 -->
    <view class="dialog-box" v-show="showInfo">
      <view class="item">
        <text>CFB余额</text>
        <text class="val">3000.00</text>
      </view>
      <view class="item">
        <text>USDT余额</text>
        <text class="val">3000.00</text>
      </view>
      <view class="item">
        <text>委托中USDT</text>
        <text class="val">3000.00</text>
      </view>
      <view class="item">
        <text>委托中CFB</text>
        <text class="val">3000.00</text>
      </view>
    </view>

    <!-- 顶部 -->
    <view class="title">
      <text>CFB资产</text>
      <u-image
        class="eye"
        v-show="showMoney"
        @click="showMoney = false"
        src="/static/images/index/eye-open.png"
        width="33rpx"
        height="23rpx"
      ></u-image>
      <u-image
        class="eye"
        v-show="!showMoney"
        @click="showMoney = true"
        src="/static/images/index/eye-close.png"
        width="33rpx"
        height="23rpx"
      ></u-image>

      <u-image
        @click="() => (showInfo = !showInfo)"
        class="time"
        src="/static/images/index/total.png"
        width="34rpx"
        height="34rpx"
      ></u-image>
    </view>

    <!-- 余额 -->
    <view class="amount">
      <view>≈</view>
      <view class="num">234.32</view>
      <view class="select">
        <u-image
          class="icon"
          src="/static/images/index/usdt.png"
          width="34rpx"
          height="34rpx"
        ></u-image>
        <view>USDT</view>
        <u-image
          class="more"
          src="/static/images/index/more.png"
          width="13rpx"
          height="8rpx"
        ></u-image>
      </view>
    </view>

    <!-- 详情 -->
    <!-- <view class="detail">
      <view class="item">
        <view>可售(CFB)</view>
        <view class="num">400.00</view>
      </view>
      <view class="line"></view>
      <view class="item">
        <view>不可售(CFB)</view>
        <view class="num">400.00</view>
      </view>
      <view class="line"></view>
      <view class="item">
        <view>已上架(CFB)</view>
        <view class="num">400.00</view>
      </view>
    </view> -->

    <!-- 收益 -->
    <view class="income">
      <view class="item">
        <u-image
          class="ball"
          src="/static/images/index/total-1.png"
          width="42rpx"
          height="43rpx"
        ></u-image>
        <view>
          <view class="num">$1.88</view>
          <text>今日收益</text>
        </view>
      </view>
      <view class="line"></view>
      <view class="item item2">
        <u-image
          class="ball"
          src="/static/images/index/total-2.png"
          width="55rpx"
          height="41rpx"
        ></u-image>
        <view>
          <view class="num">$8.88</view>
          <text>累计收益</text>
        </view>
      </view>
    </view>

    <!-- 统计弹窗 -->
    <!-- <total ref="totalDialog" /> -->
  </view>
</template>

<script>
// import total from "./total";

export default {
  name: "user-banlance",
  data() {
    return {
      showInfo: false, // 是否展示详情
      showMoney: true, // 是否展示数字
    };
  },
  components: {
    // total,
  },
  methods: {
    // 打开饼状图
    openCanvas() {
      // this.$refs.totalDialog.open();
    },
  },
};
</script>

<style lang="scss" scoped>
.user-banlance {
  width: 100%;
  margin-top: 20rpx;
  border-radius: 6rpx;
  border: 1px solid #d7d7d7;
  padding: 40rpx 40rpx 32rpx 40rpx;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #606060;
    font-size: 28rpx;
    .eye {
      margin-left: 20rpx;
    }
    .time {
      margin-left: auto;
    }
  }
  .amount {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #343635;
    font-weight: bold;
    font-weight: 66rpx;
    margin: 32rpx 0;
    .num {
      font-size: 72rpx;
      margin: 0 50rpx 0 10rpx;
    }
    .select {
      display: flex;
      align-items: center;
      height: 55rpx;
      background-color: #f0f0f0;
      border-radius: 6rpx;
      font-size: 22rpx;
      font-weight: 400;
      padding: 0 20rpx;
      .icon {
        margin-right: 10rpx;
      }
      .more {
        margin-left: 10rpx;
      }
    }
  }
  .detail {
    color: #8c8c8c;
    font-size: 22rpx;
    display: flex;
    align-items: center;
    padding: 20rpx 0 35rpx 0;
    justify-content: space-between;
    border-bottom: 1px solid #cecece;
    .item {
      text-align: center;
      .num {
        color: #262626;
        font-size: 33rpx;
        margin-top: 10rpx;
      }
    }
    .line {
      width: 1px;
      height: 40rpx;
      background-color: #cecece;
    }
  }
  .income {
    margin-top: 40rpx;
    display: flex;
    align-items: center;
    .item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8C8C8C;
      font-size: 22rpx;
      .ball {
        margin-right: 30rpx;
      }
      .num {
        color: #404040;
        font-size: 33rpx;
      }
    }
    .line {
      margin: 0 40rpx;
      height: 52rpx;
      background-color: #38363B;
      width: 1px;
    }
  }
  .dialog-box {
    border: 1px solid #d7d7d7;
    border-top: none;
    width: 100%;
    height: 384rpx;
    position: absolute;
    top: 130rpx;
    left: 0;
    background-color: #fff;
    z-index: 9;
    border-radius: 6rpx;
    padding-top: 20rpx;
    box-sizing: border-box;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #8c8c8c;
      font-size: 28rpx;
      box-sizing: border-box;
      padding: 0 42rpx;
      margin-bottom: 50rpx;
      .val {
        color: #262626;
      }
    }
  }
}
</style>
