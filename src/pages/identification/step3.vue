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

    <!-- 认证成功弹窗 -->
    <confirm-dialog :showClose="false" ref="successDialog" :title="'认证成功'" :btn="'确定'" :content="'人脸认证成功！'" :btnHandle="reGo" />
    <!-- 认证失败弹窗 -->
    <confirm-dialog  ref="failDialog" :title="'认证失败'" :btn="'确定'" :content="errorReason"/>
  </view>
</template>

<script>
import { initFaceVerify, describeFaceVerify } from "@/api/api";
import storage from '@/utils/storage'

export default {
  name: "iden3",
  data() {
    return {
      loading: false,
      userInfo: {},
      verifyPlugin: {},
      errorReason: '', // 失败原因
    };
  },
  onShow() {
    this.userInfo = storage.get("userInfo") || {};
  },
  onLoad() {
    // #ifdef APP-PLUS
    this.verifyPlugin = uni.requireNativePlugin("AP-FaceDetectModule");
    // #endif

    // #ifdef H5
    // 初始化url对象
    const url = new URL(window.location.href);
    // 解析response
    const response = JSON.parse(url.searchParams.get("response"));
    if (response) {
      this.checkResult();
    }
    // #endif
  },
  methods: {
    reGo() {
      uni.redirectTo({
        url: `/pages/identification/index`,
      });
    },
    // 解析结果
    checkResult() {
      // 去后端查询认证结果
      // #ifdef H5
      const verifySource = 1;
      // #endif
      // #ifdef APP-PLUS
      const verifySource = 2;
      // #endif
      describeFaceVerify(verifySource).then(res => {
        console.error('认证结果', res)
        if (res.code == 200) { // 认证成功
          this.$refs.successDialog.open()
        } else { // 认证失败
          this.errorReason = res.message ? '失败原因：'+res.message: '认证失败，请重试'
          this.$refs.failDialog.open()
        }
      })
    },
    // 开始认证
    start() {
      if (this.loading) return;
      this.loading = true;

      // #ifdef H5
      const verifySource = 1;
      const metaInfo = window.getMetaInfo();
      // #endif
      // #ifdef APP-PLUS
      const verifySource = 2;
      const metaInfo = this.verifyPlugin.getMetaInfo();
      // #endif
      initFaceVerify({
        metaInfo: JSON.stringify(metaInfo),
        returnUrl: location.href,
        verifySource: verifySource,
      })
        .then((res) => {
          if (res.code == 200) {
            setTimeout(() => {
              // #ifdef APP-PLUS
              this.verifyPlugin.verify(
                {
                  certifyId: res.data.certifyId,
                },
                (response) => {
                  console.error("认证结果", response);
                  setTimeout(() => {
                    this.checkResult()
                  }, 1000)
                }
              );
              // #endif
              // #ifdef H5
              window.location.href = res.data.certifyUrl
              // #endif
            }, 500);
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        });
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
