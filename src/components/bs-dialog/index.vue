<template>
  <view class="confirm-dialog" v-if="show">
    <view class="confirm-dialog-mask"></view>
    <view class="confirm-dialog-body">
      <view class="confirm-dialog-body-title" v-if="title">
        <text class="confirm-dialog-body-title-text">{{ title }}</text>
      </view>
      <view class="confirm-dialog-body-content">
        <rich-text v-if="html" class="confirm-dialog-body-content-text" :nodes="content"></rich-text>
        <text v-else class="confirm-dialog-body-content-text">{{ content }}</text>
      </view>
      <view class="confirm-dialog-body-footer">
        <u-button @click="$emit('cancel')" v-if="showCancel" class="confirm-dialog-body-footer-btn" color="#505bde" :text="cancelText" plain></u-button>
        <u-button @click="$emit('confirm')" v-if="showConfirm" class="confirm-dialog-body-footer-btn" color="#505bde" :text="confirmText"></u-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true
    },
    html: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: "确定"
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm-dialog {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

  &-mask {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #000000B3;
  }

  &-body {
    position: absolute;
    z-index: 2;
    width: 650rpx;
    left: 50rpx;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 0 0 20rpx #0000004D;
    background-color: #ffffff;
    border-radius: 10rpx;
    overflow: hidden;

    &-title {
      width: 100%;
      box-sizing: border-box;
      background-color: #505bde;
      height: 100rpx;
      display: flex;
      justify-content: center;
      align-items: center;

      &-text {
        font-size: 34rpx;
        font-weight: bold;
        line-height: 48rpx;
        color: #ffffff;
      }
    }

    &-content {
      width: 100%;
      padding: 32rpx;
      text-align: center;
      box-sizing: border-box;

      &-text {
        font-size: 30rpx;
        line-height: 42rpx;
        color: #333333;
        text-align: center;
      }
    }

    &-footer {
      width: 100%;
      padding: 32rpx 16rpx;
      text-align: center;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-btn {
        flex: 1;
        margin: 0 16rpx;
      }
    }
  }
}
</style>