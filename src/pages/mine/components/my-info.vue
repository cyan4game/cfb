<!-- 我的-基本信息 -->
<template>
  <view class="my-info">
    <view class="avatar" @click="goInfo">
      <u-image
        v-if="!userInfo.avatar"
        class="icon"
        src="/static/images/mine/avatar.png"
        width="100rpx"
        height="100rpx"
      ></u-image>
      <u-image
        v-if="userInfo.avatar"
        class="icon"
        :src="userInfo.avatar"
        width="100rpx"
        height="100rpx"
      ></u-image>
    </view>
    <view class="info" @click="goInfo">
      <view class="name">{{ userInfo.nickName || "未设置昵称" }}</view>
      <view>{{
        userInfo.phoneNumber ? hiddenStr(userInfo.phoneNumber) : "未绑定手机号"
      }}</view>
    </view>
    <view class="btn" @click="goIden">{{ idenText }}</view>
  </view>
</template>

<script>
import { hiddenPhone } from "@/utils/utils";

export default {
  props: {
    userInfo: {
      // 用户信息
      type: Object,
      default: () => {},
    },
    idenInfo: {
      // 认证信息
      type: Object,
      default: () => {},
    },
  },
  computed: {
    idenText() {
      // 认证状态
      // certificationType: 1, 认证类型 认证类型 1-标准认证，2-高级认证
      //  certificationStatus: 1, 认证状态 1 未认证 2 认证成功 3 认证失败
      const iden = this.idenInfo;
      let status = "未认证";
      if (iden) {
        if (iden.certificationType > 1 || (iden.certificationType == 1 && iden.certificationStatus == 2)) status = "基础认证";
        if (iden.certificationType == 3 && iden.certificationStatus == 2)
          status = "高级认证";
      }
      return status;
    },
  },
  methods: {
    // 去个人中心
    goInfo() {
      uni.navigateTo({
        url: "/pages/mine/info",
      });
    },
    // 去认证
    goIden() {
      uni.navigateTo({
        url: "/pages/identification/index",
      });
    },
    // 隐藏
    hiddenStr(str) {
      return hiddenPhone(str);
    },
  },
};
</script>

<style lang="scss">
.my-info {
  padding-top: 15rpx;
  padding-left: 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    overflow: hidden;
  }
  .info {
    flex: 1;
    padding-left: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: 24rpx;
    color: #fffffd;
    .name {
      font-size: 28rpx;
      margin-bottom: 10rpx;
    }
  }
  .btn {
    background-color: #f0f0f0;
    height: 47rpx;
    border-top-left-radius: 24rpx;
    border-bottom-left-radius: 24rpx;
    padding: 0 16rpx 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0c1114;
    font-size: 26rpx;
    position: relative;
    top: -18rpx;
    left: -4rpx;
  }
}
</style>
