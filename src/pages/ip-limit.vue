<template>
  <view class="page">
    <u-icon size="120rpx" name="/static/icons/icon-ip-lock.svg"></u-icon>
    <text class="page-title">访问受限制</text>
    <view class="page-box">
      <text class="page-box-address">您的IP来自于：{{ address }}</text>
      <text class="page-box-ip">{{ ip }}</text>
      <text class="page-box-tip">尊敬的用户您好：</text>
      <text class="page-box-tip">目前您所在的地区无法使用 BiShen Pay</text>
      <text class="page-box-tip">对您造成不便，我们深表歉意。</text>
      <text class="page-box-tip">感谢您的支持与理解，谢谢。</text>
      <u-button
        class="page-box-btn"
        color="#505bde"
        text="离开"
        @click="exit"
      ></u-button>
    </view>
    <u-image
      class="page-logo"
      width="320rpx"
      height="128rpx"
      src="/static/icons/logo.svg"
    ></u-image>
  </view>
</template>

<script>
export default {
  data() {
    return {
      ip: "",
      address: "",
    };
  },
  onLoad(query) {
    this.ip = query.ip;
    this.address = query.address;
  },
  methods: {
    exit() {
      // #ifdef H5
      this.onClickClose();
      // #endif
      // #ifdef APP-PLUS
      plus.runtime.quit();
      // #endif
    },
    // #ifdef H5
    /**
     * 关闭当前页面
     */
    onClickClose() {
      const userAgent = navigator.userAgent;
      if (
        userAgent.indexOf("Firefox") !== -1 ||
        userAgent.indexOf("Chrome") !== -1
      ) {
        window.location.href = "about:blank";
      } else {
        window.opener = null;
        window.open("about:blank", "_self");
        window.close();
      }
    },
    // #endif
  },
};
</script>

<style lang="scss">
.page {
  height: 100%;
  background-color: #505bde;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 200rpx;

  &-logo {
    position: absolute;
    bottom: 60rpx;
  }

  &-title {
    margin-top: 60rpx;
    line-height: 84rpx;
    color: #ffffff;
    font-size: 60rpx;
    font-weight: bold;
  }

  &-box {
    margin-top: 60rpx;
    width: 650rpx;
    height: 480rpx;
    box-sizing: border-box;
    border-radius: 10rpx;
    padding: 32rpx;
    background-color: #ffffff;
    box-shadow: 0 0 10px #0000004d;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;

    &-address {
      font-size: 30rpx;
      line-height: 40rpx;
      color: #505bde;
      margin-bottom: 10rpx;
    }

    &-ip {
      font-size: 30rpx;
      line-height: 40rpx;
      color: #505bde;
      margin-bottom: 20rpx;
    }

    &-tip {
      font-size: 30rpx;
      line-height: 40rpx;
      color: #333333;
    }

    &-btn {
      margin-top: 60rpx;
    }
  }
}
</style>
