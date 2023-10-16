<!-- 人脸认证 -->
<template>
  <view class="info-page-bg self-body page-iden-3">
    <u-navbar
      :safeAreaInsetTop="false"
      :title="'人脸认证'"
      @leftClick="() => $routers.back()"
    />
    <view class="info-page-content content-box">
      <view class="bottom-box">
        <u-image
          class="img"
          src="/static/images/mine/auth.png"
          width="477rpx"
          height="404rpx"
        ></u-image>
        <view class="tip" style="margin-top: 113rpx"
          >请确保光线充足，本人正对手机摄像头</view
        >
      </view>
      <view class="bottom-box">
        <view class="tip" style="margin-bottom: 30rpx"
          >本次人脸识别仅用于身份验证</view
        >
        <u-button type="primary" class="info-page-btn" @click="start"
          >开始认证</u-button
        >
      </view>
    </view>
  </view>
</template>

<script>
// import { advancedCertification } from '@/api/api'

export default {
  name: "iden3",
  onLoad() {
    this.getMetaInfo();

    // 初始化url对象
    const url = new URL(window.location.href);
    // 解析response
    const response = JSON.parse(url.searchParams.get("response"));
    console.error("认证结果", response);
    // {"code":1003,"subCode":"Z5052","reason":"system error","extInfo":{"certifyId":"sha02ba3a2ffad9f5c4780e42eaba933"}}
    if (response) {
      this.checkResult();
    }
  },
  methods: {
    // 解析结果
    checkResult() {
      // 去后端查询认证结果
      console.error("去后端查询认证结果");
    },
    // 获取metaInfo
    getMetaInfo() {
      // #ifdef APP-PLUS
      const verifyPlugin = uni.requireNativePlugin("IdentityPlatformUniPlugin");
      // const verifyPlugin = uni.requireNativePlugin("APFaceDetectPlugin");
      console.error('....', verifyPlugin)
      const metaInfo = verifyPlugin.getMetaInfo();
      console.error("app metainfo", metaInfo, JSON.stringify(metaInfo));
      // todo 调用后端地址，获取到certifyId后调用认证

      // #endif

      // #ifdef H5
      const MetaInfo = window.getMetaInfo();
      console.error("MetaInfo", MetaInfo, JSON.stringify(MetaInfo));
      // todo 调用后端地址，并打开返回的地址进行认证
      // #endif
    },
    // 开始认证
    start() {
      setTimeout(() => {
        // #ifdef APP-PLUS
        verifyPlugin.idCardVerify(
          {
            certifyId: "xxx", //填写从服务端获取的certifyId。
          },
          (response) => {
            consol.error("认证结果");
          }
        );
        // #endif

        // #ifdef H5
        window.location.href = "http://m.alyms.cn/F4.bgGBX3";
        // #endif
      }, 500);
    },
  },
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
      color: #0c1014;
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
