<!-- h5 扫码页 -->
<template>
  <view class="h5-scan">
    <view class="xc" @click="chooseFile">相册</view>

    <view class="scan-box">
      <view
        style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        "
        id="reader"
      ></view>

      <view class="border border-1"></view>
      <view class="border border-2"></view>
      <view class="border border-3"></view>
      <view class="border border-4"></view>
    </view>
  </view>
</template>

<script>
import { isValidTRONAddress } from "@/utils/utils";
export default {
  name: "h5scan",
  data() {
    return {
      html5QrcodeScanner: {},
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCode
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (e) => {
            this.success(e);
          }
        )
        .catch((err) => {
          this.errHandle(err);
        });
    },
    // 选择文件
    chooseFile() {
      uni.chooseImage({
        count: 1,
        sourceType: ["camera", "album"],
        success: (res) => {
          console.error(res.tempFiles[0]);
          qrcode.decode(res.tempFiles[0].path);
          qrcode.callback = (rs) => {
            if (rs.includes("error")) {
              // 异常
              this.errHandle();
            } else {
              this.success(rs);
            }
          };
        },
      });
    },
    // 用相机拍照来扫码
    caremaScan() {
      uni.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success: (res) => {
          console.error(res.tempFiles[0]);
          qrcode.decode(res.tempFiles[0].path);
          qrcode.callback = (rs) => {
            if (rs.includes("error")) {
              // 异常
              this.errHandle();
            } else {
              this.success(rs);
            }
          };
        },
      });
    },
    // 扫码异常
    errHandle(err) {
      if (err) {
        if (err.includes("streaming")) {
          // 浏览器不支持摄像流
          uni.showToast({
            title: "当前浏览器暂不支持扫码，请上传图片进行识别",
            icon: "none",
            duration: 5000,
          });
        }
      }
      // console.error('异常', err)
    },
    // 扫码成功
    success(rs) {
      if (isValidTRONAddress(rs)) {
        // 解析成功
        // 根据不同页面 跳转不同结果
        uni.navigateTo({
          url: `/pages/withdraw/index?address=${rs}`,
        });
      } else {
        // 解析失败
        uni.showToast({
          title: `无效地址：${rs}`,
          icon: "none",
          duration: 4000,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.h5-scan {
  width: 100%;
  height: 100%;
  background-color: #0c1114;
  .xc {
    position: fixed;
    top: 20rpx;
    right: 40rpx;
    color: #fff;
    z-index: 9999;
    font-size: 32rpx;
  }

  .scan-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80vw;
    height: 80vw;
    transform: translateX(-50%) translateY(-65%);

    .border {
      position: absolute;
      width: 50rpx;
      height: 50rpx;
      border: 5px solid #449367;
      border-radius: 6rpx;
      z-index: 9999;
    }
    .border-1 {
      top: -4rpx;
      left: -4rpx;
      border-right: none;
      border-bottom: none;
    }
    .border-2 {
      right: -4rpx;
      top: -4rpx;
      border-left: none;
      border-bottom: none;
    }
    .border-3 {
      left: -4rpx;
      bottom: -4rpx;
      border-top: none;
      border-right: none;
    }
    .border-4 {
      right: -4rpx;
      bottom: -4rpx;
      border-left: none;
      border-top: none;
    }

    ::v-deep video {
      width: 100% !important;
      height: 100% !important;
    }

    ::v-deep #qr-shaded-region {
      border-width: 0 !important;
    }
  }
}
</style>
