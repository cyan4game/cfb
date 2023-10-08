<!-- 人脸认证 -->
<template>
  <view class="info-page-bg page-iden-3">
    <view class="info-page-content content-box">
        <view class="bottom-box">
            <u-image class="img" src="/static/images/mine/auth.png" width="477rpx" height="404rpx"></u-image>
            <view class="tip" style="margin-top:113rpx">请确保光线充足，本人正对手机摄像头</view>
        </view>
        <view class="bottom-box">
            <view class="tip" style="margin-bottom:30rpx">本次人脸识别仅用于身份验证</view>
        <u-button class="info-page-btn">开始认证</u-button>
        </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "iden3",
  onLoad() {
    const MetaInfo = window.getMetaInfo();
    console.error('MetaInfo', MetaInfo)
  }
};
</script>

<style lang="scss" scoped>
.page-iden-3 {
    .content-box {
        padding-top: 148rpx;
        padding-bottom: 60rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .tip {
            color: #0C1014;
            font-size: 32rpx;
        }
        .bottom-box {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
}
</style>
