<template>
  <view class="safety-page">
    <view class="page-box">

      <view class="safety-item">
        <view class="title">解锁方式</view>
        <view class="item">
          <text>启用生物识别</text>
          <text class="active">已启用</text>
        </view>
        <view class="item">
          <text>图形验证</text>
          <text>未启用</text>
        </view>
      </view>

      <!-- /pages/safety/paymentPWD -->
      <view class="safety-item" @click="pageTo('/pages/setPayPassword/index')">
        <view class="title">密码修改</view>
        <view class="item">
          <text>支付密码</text>
          <view class="item-right">
            <u-image class="icon" src="/static/images/mine/right.png" width="10rpx" height="18rpx"></u-image>
          </view>
        </view>
      </view>

      <view class="safety-item" @click="pageTo('/pages/safety/mobile')">
        <view class="title">手机号管理</view>
        <view class="item">
          <text>手机号</text>
          <view class="item-right">
            <text>184****8888</text>
            <u-image class="icon" src="/static/images/mine/right.png" width="10rpx" height="18rpx"></u-image>
          </view>
        </view>
      </view>

      <view class="safety-item" @click="pageTo('/pages/safety/email')">
        <view class="title">邮箱管理</view>
        <view class="item">
          <text>邮箱</text>
          <view class="item-right">
            <text>1*****Dooker.com</text>
            <u-image class="icon" src="/static/images/mine/right.png" width="10rpx" height="18rpx"></u-image>
          </view>
        </view>
      </view>

      <view class="safety-item">
        <view class="title">登录设备</view>
        <view class="item">
          <text>登陆设备</text>
          <view class="item-right">
            <text>查看登录设备</text>
            <u-image class="icon" src="/static/images/mine/right.png" width="10rpx" height="18rpx"></u-image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: "safety",
  methods: {
    pageTo(name) {
      uni.navigateTo({
         url: name
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.safety-page {
  background: rgb(14, 18, 22);
  padding-top: 20rpx;
  height: 100%;

  .page-box {
    background: #F1F1F1;
    border-top-left-radius: 22rpx;
    border-top-right-radius: 22rpx;
    padding: 52rpx 28rpx;
    height: 100%;
  }

  .safety-item {
    background-color: #fff;
    box-sizing: border-box;
    padding: 38rpx 50rpx;
    border-radius: 9rpx;
    margin-bottom: 27rpx;
    font-size: 26rpx;
    color: #484848;

    .title {
      font-size: 30rpx;
      margin-bottom: 7rpx;
    }

    .item {
      margin-top: 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .item-right {
        display: flex;
        align-items: center;
        color: #757575;
        font-size: 22rpx;
        .icon {
          margin-left: 12rpx;
          position: relative;
          top: 2rpx;
        }
      }
    }
  }
}
</style>
