<template>
  <view class="page">
    <view class="page-top">
      <u-icon size="120rpx" name="/static/icons/icon-transfer-success.svg"></u-icon>
      <text class="page-top-info">支付成功</text>
      <view class="page-top-value">
        <text class="page-top-amount">-{{ Number(model.payNumber) }}</text>
        <text class="page-top-currency">{{ model.coinName }}</text>
      </view>
    </view>
    <view class="page-order">
      <view class="page-order-row">
        <text class="page-order-label">收款方</text>
        <text class="page-order-value">{{ model.receiveName }}</text>
      </view>
      <view class="page-order-row">
        <text class="page-order-label">下单时间</text>
        <text class="page-order-value">{{ model.payTime }}</text>
      </view>
      <view class="page-order-row">
        <text class="page-order-label">订单号</text>
        <text class="page-order-value uni-flex-item">{{ model.scanCodeOrderNo }}</text>
        <u-icon size="40rpx" name="/static/icons/copy.svg" @click="$uni.setClipboardData({data: model.scanCodeOrderNo, showToast: true})"></u-icon>
      </view>
      <u-button class="page-order-btn" text="返回首页" color="#505bde" @click="toHome"></u-button>
      <!--      <view class="btn-to-record" @click="toRecord">-->
      <!--        <text class="btn-to-record-text">查看转账记录</text>-->
      <!--      </view>-->
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      model: {}
    }
  },
  onLaunch (options) {
    if (options) this.model = options
  },
  onLoad (query) {
    if (query) this.model = query
  },
  onShow (options) {
    if (options) this.model = options
  },
  methods: {
    toHome () {
      uni.reLaunch({
        url: "/pages/index/index"
      })
    },
    toRecord () {
      uni.reLaunch({
        url: "/pages/transfer/record"
      })
    }
  }
}
</script>

<style lang="scss">
::v-deep .u-popup {
  flex: unset !important;
}

.page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  &-top {
    background-color: #ffffff;
    height: 360rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding-top: 32rpx;
    box-sizing: border-box;

    &-info {
      color: #63B72E;
      font-size: 34rpx;
      font-weight: 700;
      margin: 30rpx 0;
    }

    &-value {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10rpx;
    }

    &-amount {
      color: #EF3C3C;
      font-size: 48rpx;
      font-weight: 700;
    }

    &-currency {
      color: #333333;
      font-size: 34rpx;
    }
  }

  &-order {
    margin-top: 12rpx;
    padding: 32rpx 40rpx;
    background-color: #ffffff;
    flex: 1;

    &-btn {
      margin-top: 60rpx;
    }

    &-row {
      margin-bottom: 20rpx;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-label {
      font-weight: bold;
      color: #333333;
      font-size: 28rpx;
    }

    &-value {
      color: #666666;
      font-size: 28rpx;
      text-align: right;
    }

    .btn-to-record {
      text-align: center;
      width: 100%;
      margin-top: 20rpx;

      &-text {
        color: #0277ff;
        font-size: 28rpx;
        font-weight: bold;
      }
    }
  }
}
</style>
