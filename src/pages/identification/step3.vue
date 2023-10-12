<!-- 人脸认证 -->
<template>
  <view class="info-page-bg self-body page-iden-3">
    <u-navbar :safeAreaInsetTop="false" :title="'人脸认证'" @leftClick="() => $routers.back()" />
    <view class="info-page-content content-box">
        <view class="bottom-box">
            <u-image class="img" src="/static/images/mine/auth.png" width="477rpx" height="404rpx"></u-image>
            <view class="tip" style="margin-top:113rpx">请确保光线充足，本人正对手机摄像头</view>
        </view>
        <view class="bottom-box">
            <view class="tip" style="margin-bottom:30rpx">本次人脸识别仅用于身份验证</view>
        <u-button type="primary" class="info-page-btn">开始认证</u-button>
        </view>
    </view>
  </view>
</template>

<script>

export default {
  name: "iden3",
  onLoad() {
    this.getMetaInfo()
  },
  methods: {
    // 获取metaInfo
    getMetaInfo() {
      // #ifdef APP-PLUS
      const verifyPlugin = uni.requireNativePlugin('IdentityPlatformUniPlugin');
      const metaInfo = verifyPlugin.getMetaInfo();
      console.error('app metainfo', metaInfo)
      // todo 调用后端地址，获取到certifyId后调用认证
      // verifyPlugin.idCardVerify({
      //   "certifyId":"xxx"    //填写从服务端获取的certifyId。
      // }, (response) =>{
      //   consol.error('认证结果')
      // });
      // #endif

      // #ifdef H5
      const MetaInfo = window.getMetaInfo();
      console.error('MetaInfo', MetaInfo)
      // todo 调用后端地址，并打开返回的地址进行认证
      // #endif
    }
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
