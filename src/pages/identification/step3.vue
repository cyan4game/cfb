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
  data() {
    return {
      verifyPlugin: {}
    }
  },
  onLoad() {
    this.getMetaInfo();

    // #ifdef H5
    // 初始化url对象
    const url = new URL(window.location.href);
    // 解析response
    const response = JSON.parse(url.searchParams.get("response"));
    console.error("认证结果", response);
    // {"code":1003,"subCode":"Z5052","reason":"system error","extInfo":{"certifyId":"sha02ba3a2ffad9f5c4780e42eaba933"}}
    if (response) {
      this.checkResult();
    }
    // #endif
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
      this.verifyPlugin = uni.requireNativePlugin("AP-FaceDetectModule");
      const metaInfo = this.verifyPlugin.getMetaInfo();
      console.error("app metainfo");
      console.error(JSON.stringify(metaInfo))
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
        this.verifyPlugin.verify(
          {
            certifyId: "sha02e6b76bb7244833905a42cdb3d53", //填写从服务端获取的certifyId。
          },
          (response) => {
            console.error("认证结果", response);

            // "deviceToken": "5vuu2vdAllaqoNkHVNZNjjo0OBGD6j9HAGLD/kPwCedQFSM4iwEAAA==",
            // "retCode": 2006,
            // "lastBitmap": {},
            // "faceDectectAttr": "##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.19166666, 0.4046875, 0.5916667, 0.6296875), quality=86.25999, yaw=-0.0090809, pitch=-0.03309794, gaussian=0.16101992, motion=0.16101992, brightness=0.5149012, integrity=1.0, leftEyeBlinkRatio=0.52644056, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.5434339, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.99957377, roll=0.009343046, iodRatio=0.16445355, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.19999999, 0.3984375, 0.6, 0.6234375), quality=88.70471, yaw=-0.0033124906, pitch=-0.054134622, gaussian=0.0, motion=0.0, brightness=0.5154306, integrity=1.0, leftEyeBlinkRatio=0.5618551, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.49020824, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.9999298, roll=0.011540871, iodRatio=0.16400282, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.21111113, 0.3984375, 0.6111111, 0.6234375), quality=84.91171, yaw=-0.024190895, pitch=-0.04370183, gaussian=0.0, motion=0.0, brightness=0.51476234, integrity=1.0, leftEyeBlinkRatio=0.54792106, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.5143651, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.99535096, roll=0.015701722, iodRatio=0.16526195, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.22222221, 0.3984375, 0.6222222, 0.6234375), quality=87.28348, yaw=-0.0097870715, pitch=-0.045126148, gaussian=0.0, motion=0.0, brightness=0.5139419, integrity=1.0, leftEyeBlinkRatio=0.529257, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.50223714, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.99967515, roll=0.016599357, iodRatio=0.16183017, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.22222221, 0.3984375, 0.6222222, 0.6234375), quality=81.02369, yaw=-0.022717383, pitch=-0.04015358, gaussian=0.0, motion=0.0, brightness=0.51449907, integrity=1.0, leftEyeBlinkRatio=0.53331786, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.49173653, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.99584454, roll=0.017434394, iodRatio=0.1616845, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.23055553, 0.4046875, 0.6222222, 0.6234375), quality=83.283134, yaw=-0.031911597, pitch=-0.041937526, gaussian=0.0, motion=0.0, brightness=0.5084942, integrity=1.0, leftEyeBlinkRatio=0.52835107, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.4861214, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.9989906, roll=0.018454911, iodRatio=0.16085163, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.22222221, 0.4046875, 0.6111111, 0.6296875), quality=86.540695, yaw=-0.06255822, pitch=-0.03348119, gaussian=0.0, motion=0.0, brightness=0.50217426, integrity=1.0, leftEyeBlinkRatio=0.55973434, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.49856985, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.9964798, roll=0.018561447, iodRatio=0.16283567, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.19166666, 0.409375, 0.63055557, 0.6578125), quality=57.25464, yaw=-0.048416175, pitch=-0.08006938, gaussian=0.0, motion=0.0, brightness=0.5027411, integrity=1.0, leftEyeBlinkRatio=0.5680154, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.4685144, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.9998754, roll=0.01194316, iodRatio=0.18647523, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.21111113, 0.409375, 0.6, 0.634375), quality=87.78213, yaw=-0.04279326, pitch=-0.056394305, gaussian=0.0, motion=0.0, brightness=0.4937299, integrity=1.0, leftEyeBlinkRatio=0.5215465, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.44357917, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.9986481, roll=0.020405028, iodRatio=0.16200991, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.19999999, 0.415625, 0.5916667, 0.640625), quality=93.181206, yaw=-0.05116933, pitch=-0.028668774, gaussian=0.0, motion=0.0, brightness=0.48902038, integrity=1.0, leftEyeBlinkRatio=0.5641049, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.5151147, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.99768984, roll=0.011773978, iodRatio=0.16231485, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.19166666, 0.415625, 0.58055556, 0.640625), quality=91.68208, yaw=-0.032839026, pitch=-0.021495296, gaussian=0.0, motion=0.0, brightness=0.48636356, integrity=1.0, leftEyeBlinkRatio=0.5651833, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.49783775, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.99714065, roll=0.01659655, iodRatio=0.16250458, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.19166666, 0.415625, 0.58055556, 0.640625), quality=93.19806, yaw=-0.06620999, pitch=-0.015159509, gaussian=0.0, motion=0.0, brightness=0.48724532, integrity=1.0, leftEyeBlinkRatio=0.56018347, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.49335065, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.9989718, roll=0.014608282, iodRatio=0.16205318, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.18055558, 0.421875, 0.57222223, 0.646875), quality=95.04462, yaw=-0.041108377, pitch=-0.0072654947, gaussian=0.0, motion=0.0, brightness=0.4848451, integrity=1.0, leftEyeBlinkRatio=0.5685243, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.5801279, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.99818265, roll=0.014205138, iodRatio=0.16205557, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=true, faceRegion=RectF(0.18055558, 0.421875, 0.57222223, 0.640625), quality=92.12398, yaw=-0.049675364, pitch=-0.016533688, gaussian=0.0, motion=0.0, brightness=0.48213083, integrity=1.0, leftEyeBlinkRatio=0.5884033, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.5016927, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.9960717, roll=0.0133534875, iodRatio=0.1607399, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=false, eyeOpen=false, faceRegion=RectF(0.19166666, 0.4265625, 0.57222223, 0.640625), quality=81.845215, yaw=-0.06127292, pitch=-0.013018688, gaussian=0.0, motion=0.0, brightness=0.47837105, integrity=1.0, leftEyeBlinkRatio=0.29154605, leftEyeBlinkRatioMin=0.021527583, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.1775327, rightEyeBlinkRatioMin=0.08308103, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.9988238, roll=0.017001515, iodRatio=0.15369846, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}##TGFaceAttr{hasFace=true, faceId=91, eyeBlink=true, eyeOpen=false, faceRegion=RectF(0.19999999, 0.4265625, 0.58055556, 0.640625), quality=61.96449, yaw=-0.052947782, pitch=-0.036345214, gaussian=0.0, motion=0.0, brightness=0.4786152, integrity=1.0, leftEyeBlinkRatio=0.010587024, leftEyeBlinkRatioMin=0.010587024, leftEyeBlinkRatioMax=0.71208745, rightEyeBlinkRatio=0.0095735, rightEyeBlinkRatioMin=0.0095735, rightEyeBlinkRatioMax=0.7280627, distance=1, keypts10=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], confidence=0.9991844, roll=0.022660224, iodRatio=0.1554591, deepLiveness=0.0, depthQuality=1.68E-43, faceCount=1, otherFacePos =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], otherFaceCount =0, lipMovement =false}",
            // "msg": "sha02e6b76bb7244833905a42cdb3d53",
            // "retMessageSub": "sha02e6b76bb7244833905a42cdb3d53",
            // "reason": "Z5128",
            // "code": 2006
            if (response.code == 1000) {

            } else {
              const errorCode = {
                1001: '系统错误',
                1003: '验证中断',
                2002: '网络错误',
                2003: '客户端设备时间错误',
                2006: '刷脸失败',
              }
              setTimeout(() => {
                uni.showToast({
                  title: errorCode[response.code] || '认证失败，请重试',
                  icon: 'none',
                  duration: 2000
                })
              }, 500)
            }
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
