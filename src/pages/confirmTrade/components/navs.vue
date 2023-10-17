<!-- 导航功能弹窗 -->
<template>
  <view class="cover-box" @click="close">
    <div class="triangle"></div>
    <view class="cover-content">
      <view class="item" @click="jump('/pages/collection/index')">
        <u-image
          class="item-icon"
          src="/static/images/trade/nav-1.png"
          width="34rpx"
          height="32rpx"
        ></u-image>
        <text>收款方式</text>
      </view>
      <view class="item">
        <u-image
          class="item-icon"
          src="/static/images/trade/nav-2.png"
          width="34rpx"
          height="34rpx"
        ></u-image>
        <text>交易指南</text>
      </view>
      <view class="item" @click="jump('/pages/customer/index')">
        <u-image
          class="item-icon"
          src="/static/images/trade/nav-3.png"
          width="30rpx"
          height="28rpx"
        ></u-image>
        <text>客服</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "tradeNav",
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("close");
    },
    jump(name) {
      uni.navigateTo({
         url: name
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.cover-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0);
  .cover-content {
    position: absolute;
    background-color: #fff;
    width: 244rpx;
    height: 248rpx;
    border-radius: 8px;
    right: 40rpx;
    top: 100rpx;
    border-top-right-radius: 0;
    padding-left: 35rpx;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    .item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #070707;
        font-size: 28rpx;
        margin: 18rpx 0;
        .item-icon {
            margin-right: 23rpx;
        }
    }
  }
  .triangle {
    width: 0;
    height: 0;
    position: absolute;
    right: 46rpx;
    top: 88rpx;
    transform: scaleX(2);
    border-left: 6rpx solid transparent; /* 左边透明 */
    border-right: 6rpx solid transparent; /* 右边透明 */
    border-bottom: 15rpx solid #fff; /* 底部实心，可以改成你想要的颜色 */
  }
}
</style>
