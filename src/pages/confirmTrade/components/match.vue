<!-- 匹配成功 -->
<template>
  <uni-popup ref="popup">
    <view class="match-dialog">
      <view class="title">
        <text>订单匹配成功</text>
        <view class="close" @click="close"
          ><u-image
            mode="contain"
            src="/static/images/index/close.png"
            width="24rpx"
            height="24rpx"
          ></u-image
        ></view>
      </view>
      <view class="tip"
        >系统为你匹配到以下数量相近的订单，请选择需要购买的数量</view
      >

      <!-- 列表 -->
      <scroll-view scroll-y="true" class="list">
        <view class="item" @click="activeIndex = i" :class="{'active-item': activeIndex == i}" v-for="(item, i) in matchResultItemList" :key="i"
          >{{ item.coinAmount }}</view
        >
      </scroll-view>

      <!-- 按钮 -->
      <view class="btns">
        <view class="btn" @click="close">取消订单</view>
        <view class="btn active-btn" @click="buy">立即购买</view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: "matchDialog",
  props: {
    matchResultItemList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeIndex: 0,
    }
  },
  methods: {
    open() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    buy() {
      this.close()
      this.$emit('buy', this.matchResultItemList[this.activeIndex])
    },
  },
};
</script>

<style lang="scss" scoped>
.match-dialog {
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
  }
  .list {
    flex: 1;
    overflow: hidden;
    padding: 40rpx 0;
    box-sizing: border-box;
    .item {
      height: 72rpx;
      margin-bottom: 41rpx;
      background-color: #f1f1f1;
      border-radius: 6rpx;
      color: #808080;
      font-size: 28rpx;
      padding: 0 30rpx;
      display: flex;
      align-items: center;
      box-sizing: border-box;
    }
    .active-item {
      border: 1px solid #449367;
        color: #449367;
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
}
</style>
