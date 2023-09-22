<template>
  <view class="page">
    <u-navbar
        style="width: 100%"
        title="完成"
        bgColor="#505bde"
        leftIcon=""
        titleStyle="color:#ffffff;"
        :fixed="false"
        rightIcon=""
    ></u-navbar>
    <u-icon class="page-icon" size="120rpx" name="/static/icons/icon-transfer-success.svg"></u-icon>
    <text class="page-label">恭喜!</text>
    <text class="page-content">您已完成设置</text>
  </view>
</template>

<script>
export default {
  onShow(options) {
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }, 3000)
  }
}
</script>

<style lang="scss">
.page {
  min-height: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  &-icon {
    margin-top: 32rpx;
  }

  &-label {
    margin-top: 40rpx;
    font-size: 34rpx;
    color: #63b72e;
    font-weight: bold;
  }

  &-content {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #999999;
  }

  &-btn {
    margin-top: 60rpx;
    width: 670rpx;
  }
}
</style>
