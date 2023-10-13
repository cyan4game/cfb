<!-- 币种选择弹窗 -->
<template>
  <uni-popup
    ref="popup"
    type="bottom"
    :mask-click="false"
    :is-mask-click="false"
  >
    <view class="select-doalog">
      <view class="title">
        <text>选择网络</text>
        <view class="close" @click="close"
          ><u-image
            mode="contain"
            src="/static/images/index/close.png"
            width="24rpx"
            height="24rpx"
          ></u-image
        ></view>
      </view>
      <scroll-view scroll-y="true" class="scroll-Y">
        <view class="tip">
          <u-image
            class="icon"
            src="/static/images/mine/warning.png"
            width="32rpx"
            height="32rpx"
          ></u-image>
          <view
            >确保充币平台与提币平台选择的网络一致， 否则可能造成资产损失</view
          >
        </view>

        <view
          class="select-item"
          v-for="(item, i) in list"
          :key="i"
          @click="handleClick(item)"
        >
          <u-image
            class="icon"
            src="/static/images/index/usdt.png"
            width="50rpx"
            height="50rpx"
          ></u-image>
          <view>TRC20</view>
        </view>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: "coinSelect",
  data() {
    return {
      list: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    };
  },
  methods: {
    // 打开
    open() {
      this.$refs.popup.open();
    },
    // 关闭
    close() {
      this.$refs.popup.close();
    },
    // 点击
    handleClick(item) {
      this.$emit("select", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.select-doalog {
  width: 100%;
  height: 900rpx;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .title {
    height: 120rpx;
    padding: 0 37rpx 0 63rpx;
    color: #38363b;
    font-size: 36rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dfdfdf;

    .close {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      background-color: #eeeeee;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      color: #888;
    }
  }

  .scroll-Y {
    flex: 1;
    box-sizing: border-box;
    padding: 24rpx 54rpx;
    overflow: hidden;

    .select-item {
      margin-bottom: 28rpx;
      border-radius: 6rpx;
      border: 1px solid #959299;
      padding: 40rpx;
      display: flex;
      align-items: center;

      .icon {
        margin-right: 28rpx;
      }
    }
  }

  .tip {
    background-color: #f0f0f0;
    border-radius: 6rpx;
    padding: 30rpx 80rpx 30rpx 30rpx;
    display: flex;
    align-items: flex-start;
    font-size: 26rpx;
    color: #3b3b3b;
    margin-bottom: 40rpx;

    .icon {
      margin-right: 30rpx;
      position: relative;
      top: 1px;
    }
  }
}
</style>
