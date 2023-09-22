<template>
  <view class="page">
    <u-icon size="120rpx" name="/static/icons/icon-transfer-error.svg"></u-icon>
    <text class="page-label">很抱歉，支付失败</text>
    <text class="page-value">{{ model.error }}</text>
    <u-button class="page-btn" text="返回首页" color="#505bde" @click="toHome"></u-button>
  </view>
</template>

<script>
export default {
  data () {
    return {
      model: {
        error: ""
      }
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
    }
  }
}
</script>

<style lang="scss">
::v-deep .u-popup {
  flex: unset !important;
}

.page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 32rpx 40rpx;
  min-height: 100%;
  background-color: #ffffff;

  &-label {
    color: #ef3c3c;
    font-size: 36rpx;
    font-weight: bold;
    margin-top: 30rpx;
  }

  &-value {
    color: #999999;
    font-size: 36rpx;
    margin-top: 30rpx;
  }

  &-btn {
    margin-top: 60rpx;
  }
}
</style>
