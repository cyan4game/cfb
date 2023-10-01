<!-- 收款码 -->
<template>
  <view class="page-collection">
    <view class="qr-box">
      <view class="content-box">
        <view class="title">扫一扫向我付款</view>

        <view class="qr-content" @click="showBig = true">
          <tki-qrcode ref="qrcode" :size="353" @result="qrResult" :val="'https://www.baidu.com'" />
          <view class="content-border content-border-1"></view>
          <view class="content-border content-border-2"></view>
          <view class="content-border content-border-3"></view>
          <view class="content-border content-border-4"></view>
        </view>

        <view class="tip" @click="showBig = true">点击可查看大图</view>

        <view class="btn primary">设置金额</view>

        <view class="btn" @click="savePic">保存图片</view>
      </view>
    </view>

    <!-- 大图 -->
    <view class="big-pic" v-if="showBig" @click="showBig = false">
      <u-image mode="cover" class="icon" v-if="qrPic" :src="qrPic" width="90vw" height="90vw"></u-image>
    </view>
  </view>
</template>

<script>
export default {
  name: "collection",
  data() {
    return {
      qrPic: "",
      showBig: false, // 是否展示大图
    };
  },
  mounted() {
    this.$refs.qrcode._makeCode();
  },
  methods: {
    // 二维码地址
    qrResult(val) {
      this.qrPic = val;
    },
    // 保存二维码
    savePic() {
      const a = document.createElement("a");
      a.href = this.qrPic;
      a.download = "qrcode.png";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-collection {
  background-color: #0c1114;
  height: 100%;
  padding-top: 80rpx;
  box-sizing: border-box;

  .qr-box {
    width: 696rpx;
    height: 1039rpx;
    border-radius: 6rpx;
    box-sizing: border-box;
    margin: 0 auto;
    background-color: #449367;
    padding: 33rpx 21rpx;

    .content-box {
      background-color: #fff;
      border-radius: 6rpx;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      color: #38363b;
      font-size: 36rpx;
      padding: 55rpx 0 70rpx 0;
      box-sizing: border-box;

      .title {
        margin-bottom: 70rpx;
      }

      .qr-content {
        width: 393rpx;
        height: 393rpx;
        position: relative;
        box-sizing: border-box;
        padding: 20rpx;

        .content-border {
          position: absolute;
          width: 50rpx;
          height: 50rpx;
          border-radius: 6rpx;
          border: 1px solid #449367;
        }

        .content-border-1 {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
        }

        .content-border-2 {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
        }

        .content-border-3 {
          bottom: 0;
          left: 0;
          border-top: none;
          border-right: none;
        }

        .content-border-4 {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
        }
      }
    }

    .tip {
      color: #38363b;
      font-size: 28rpx;
      margin: 40rpx 0 20rpx 0;
    }

    .btn {
      width: 450rpx;
      height: 113rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #38363b;
      font-size: 34rpx;
      border: 1px solid #38363b;
      border-radius: 6rpx;
      margin-top: 25rpx;
      box-sizing: border-box;
    }

    .primary {
      background-color: #449367;
      color: #fff;
      border: none;
    }
  }
}

.big-pic {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    width: 90vw;
    height: 90vw;
  }
}
</style>
