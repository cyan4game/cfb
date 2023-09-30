<template>
  <view class="info-page-bg safety-page">
    <view class="info-page-content page-box">

      <view class="safety-item">
        <view class="title">解锁方式</view>
        <view class="item">
          <text>启用生物识别</text>
          <text class="right-text active">已启用</text>
        </view>
        <view class="item">
          <text>图形验证</text>
          <text class="right-text">未启用</text>
        </view>
      </view>

      <view class="safety-item" @click="changePayPass">
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
            <text>{{ userInfo.phoneNumber ? hiddenPhone(userInfo.phoneNumber) : '未绑定' }}</text>
            <u-image class="icon" src="/static/images/mine/right.png" width="10rpx" height="18rpx"></u-image>
          </view>
        </view>
      </view>

      <view class="safety-item" @click="pageTo('/pages/safety/email')">
        <view class="title">邮箱管理</view>
        <view class="item">
          <text>邮箱</text>
          <view class="item-right">
            <text>{{ userInfo.email ? hiddenEmail(userInfo.email) : '未绑定' }}</text>
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
import { hiddenEmail, hiddenPhone } from '@/utils/utils'
import storage from '@/utils/storage'

export default {
  name: "safety",
  data() {
    return {
      userInfo: {},
    }
  },
  onShow() {
    this.userInfo = storage.get('userInfo') || {}
  },
  methods: {
    hiddenEmail,
    hiddenPhone,
    // 跳转
    pageTo(name) {
      uni.navigateTo({
        url: name
      });
    },
    // 设置/修改 支付密码
    changePayPass() {
      if (this.userInfo.payPasswordStatus) { // 修改
        this.pageTo('/pages/safety/paymentPWD')
      } else { // 设置
        this.pageTo('/pages/setPayPassword/index')
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.safety-page {


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
      .right-text {
        color: #757575;
        font-size: 22rpx;
      }

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
