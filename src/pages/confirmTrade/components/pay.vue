<!-- 付款凭证 -->
<template>
  <uni-popup ref="popup">
    <view class="pay-dialog">
      <view class="title">
        <text>付款凭证</text>
        <view class="close" @click="clsoe"
          ><u-image
            mode="contain"
            src="/static/images/index/close.png"
            width="24rpx"
            height="24rpx"
          ></u-image
        ></view>
      </view>
      <view class="tip">您若未付款，产生纠纷，信用将会受到影响 </view>

      <view class="dialog-item">
        <text>交易金额</text>
        <text class="num">￥7578.00</text>
      </view>
      <view class="dialog-item">
        <text>收款人</text>
        <text class="val">王保长</text>
      </view>
      <view class="dialog-item">
        <text>收款方式</text>
        <text class="val">支付宝</text>
      </view>
      <view class="dialog-item">
        <text>收款账号</text>
        <text class="val">176575@qq.com</text>
      </view>
      <view class="dialog-item">
        <text>上传凭证</text>
        <view class="upload">
          <view class="border border1"></view>
          <view class="border border2"></view>
          <view class="border border3"></view>
          <view class="border border4"></view>
          <view class="upload-bg">
            <u-image
              class="icon"
              src="/static/images/home/img.png"
              width="32rpx"
              height="32rpx"
            ></u-image>
          </view>
          <text class="up-img">上传图片</text>
        </view>
      </view>

      <view class="tip-box">
        <u-image
          class="icon"
          src="/static/images/mine/warnning.png"
          width="32rpx"
          height="32rpx"
        ></u-image>
        <text
          >付款完成后，点击“确认已付款”，卖家确认付款到账后，系统会将对应的数字资产自动划转到您的账户中</text
        >
      </view>
      <!-- 按钮 -->
      <view class="btns">
        <view class="btn" @click="close">关闭</view>
        <view class="btn active-btn" @click="buy">确认已付款</view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: "matchDialog",
  methods: {
    open() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    buy() {
      uni.navigateTo({
        url: "/pages/confirmTrade/wait",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pay-dialog {
  height: 1070rpx;
  display: flex;
  flex-direction: column;
  width: 630rpx;
  border-radius: 6rpx;
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 30rpx;
  overflow: hidden;
  .title {
    color: #323232;
    font-size: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100rpx;
    position: relative;
    .close {
      width: 40rpx;
      height: 40rpx;
      background-color: #eeeeee;
      border-radius: 50%;
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      padding-bottom: 4rpx;
      color: #888;
    }
  }
  .tip {
    color: #ed3030;
    font-size: 18rpx;
    margin-bottom: 30rpx;
  }
  .tip-box {
    margin-top: 80rpx;
    background-color: #f1f1f1;
    padding: 27rpx 20rpx 20rpx 80rpx;
    border-radius: 4rpx;
    color: #272636;
    font-size: 19rpx;
    line-height: 40rpx;
    position: relative;
    .icon {
      position: absolute;
      left: 30rpx;
      top: 30rpx;
    }
  }
  .btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn {
      width: 276rpx;
      height: 100rpx;
      margin: 50rpx 0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border: 1px solid #38363b;
      color: #38363b;
      font-size: 34rpx;
      border-radius: 6rpx;
    }
    .active-btn {
      background-color: #449367;
      border: none;
      color: #fff;
    }
  }
  .dialog-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #7a7a7a;
    font-size: 26rpx;
    min-height: 60rpx;
    .val {
      color: #3c3c3c;
    }
    .num {
      color: #449367;
    }
    .upload {
      width: 150rpx;
      height: 100rpx;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20rpx;
      position: relative;
      .up-img {
        position: absolute;
        bottom: -40rpx;
      }
      .upload-bg {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 94rpx;
        height: 64rpx;
        background-color: #f1f1f1;
      }
      .border {
        width: 20rpx;
        height: 20rpx;
        border: 1px solid #3c3c3c;
        border-radius: 4rpx;
        position: absolute;
      }
      .border1 {
        border-right: none;
        border-bottom: none;
        top: 0;
        left: 0;
      }
      .border2 {
        top: 0;
        right: 0;
        border-left: none;
        border-bottom: none;
      }
      .border3 {
        bottom: 0;
        left: 0;
        border-top: none;
        border-right: none;
      }
      .border4 {
        bottom: 0;
        right: 0;
        border-top: none;
        border-left: none;
      }
    }
  }
}
</style>
