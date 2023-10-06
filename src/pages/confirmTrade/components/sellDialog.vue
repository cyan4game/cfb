<!-- 出售确认 -->
<template>
  <!-- 交易确认 -->
  <uni-popup
    ref="popup"
    type="bottom"
    :mask-click="false"
    :is-mask-click="false"
  >
    <view class="sure-box">
      <view class="title">
        <text>确认出售</text>
        <view class="close" @click="() => $refs.popup.close()">×</view>
      </view>

      <view style="padding: 0 50rpx; box-sizing: border-box">
        <view class="sure-item">
          <text>收款账号</text>
          <text class="sure-val">86575588</text>
        </view>
        <view class="sure-item">
          <text>数量</text>
          <text class="sure-val">5 CFB</text>
        </view>
        <view class="sure-item">
          <text>参考汇率</text>
          <text class="sure-val">1:1</text>
        </view>
        <view class="sure-item">
          <text>预计到账</text>
          <text class="sure-val">￥ 5</text>
        </view>
      </view>
      <view class="submit" @click="next">确认出售</view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: "sellDialog",
  data() {
    return {
      form: {},
    };
  },
  methods: {
    open() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.sure-box {
  width: 100%;
  height: 780rpx;
  background-color: #fff;

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
  .sure-item {
    height: 110rpx;
    border-bottom: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26rpx;
    .sure-val {
      margin-left: 20rpx;
    }
  }

  .submit {
    background: #449367;
    border-color: #449367;
    width: 451rpx;
    height: 96rpx;
    margin: 40rpx auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 26rpx;
  }
}
</style>
