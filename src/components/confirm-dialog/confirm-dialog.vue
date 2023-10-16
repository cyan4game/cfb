<!-- 确认弹窗 -->
<template>
  <uni-popup
    ref="popup"
    type="center"
    :is-mask-click="false"
    :mask-click="false"
  >
    <view class="tip-dialog-content">
      <view class="close" @click="close"
        ><u-image
          mode="contain"
          src="/static/images/index/close.png"
          width="24rpx"
          height="24rpx"
        ></u-image
      ></view>
      <view class="title">{{ title || "提示" }}</view>
      <view class="content" v-html="content"></view>
      <view class="btns">
        <view
          class="btn border-btn"
          v-if="borderBtn"
          @click="borderBtnHandleClick"
          >{{ borderBtn }}</view
        >
        <view class="btn" v-if="btn" @click="btnHandleClick">{{ btn }}</view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: "TipDialog",
  props: {
    title: {
      // 弹窗标题
      type: String,
      default: "",
    },
    btn: {
      // 主按钮的名字，如果有就显示按钮
      type: String,
      default: "",
    },
    content: {
      // 内容
      type: String,
      default: "",
    },
    btnHandle: {
      // 主按钮回调
      type: Function,
    },
    borderBtn: {
      // 边框按钮的名字，有则展示
      type: String,
      default: "",
    },
    borderBtnHandle: {
      // 边框按钮回调
      type: Function,
    },
  },
  methods: {
    open() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    btnHandleClick() {
      if (!this.btnHandle) return this.close();
      this.btnHandle();
    },
    borderBtnHandleClick() {
      if (!this.borderBtnHandle) return this.close();
      this.borderBtnHandle();
    },
  },
};
</script>

<style lang="scss">
.tip-dialog-content {
  width: 630rpx;
  border-radius: 6rpx;
  background-color: #fff;
  box-sizing: border-box;
  padding: 60rpx 56rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    font-size: 36rpx;
    color: #323232;
    font-weight: 500;
    text-align: center;
  }
  .content {
    font-size: 34rpx;
    color: #323232;
    font-weight: 400;
    text-align: left;
    width: 100%;
    margin: 60rpx 0 40rpx 0;
    text-align: center;
  }
  .btns {
    display: flex;
    align-items: center;
    width: 100%;
    .btn:nth-child(2) {
      margin-left: 20rpx;
    }
  }
  .btn {
    flex: 1;
    height: 100rpx;
    background-color: #449367;
    color: #fff;
    font-weight: 400;
    font-size: 34rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6rpx;
    margin-top: 23rpx;
    box-sizing: border-box;
  }
  .border-btn {
    border: 1px solid #38363b;
    background-color: #fff;
    color: #38363b;
  }
  .close {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    background-color: #eee;
    border-radius: 50%;
    overflow: hidden;
    top: 60rpx;
    right: 40rpx;
    color: #888888;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }
}
</style>
