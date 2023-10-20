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
        <view class="close" @click="() => $refs.popup.close()"
          ><u-image
            mode="contain"
            src="/static/images/index/close.png"
            width="24rpx"
            height="24rpx"
          ></u-image
        ></view>
      </view>

      <view>
        <view class="sure-item">
          <text>收款账号</text>
          <text class="sure-val"
            >{{ payWayMap[form.payType] }}-{{ form.gatherNo }}</text
          >
        </view>
        <view class="sure-item">
          <text>数量</text>
          <text class="sure-val">{{ form.payAmount }} CFB</text>
        </view>
        <view class="sure-item">
          <text>参考汇率</text>
          <text class="sure-val">1:1</text>
        </view>
        <view class="sure-item">
          <text>预计到账</text>
          <text class="sure-val">￥ {{ form.payAmount }}</text>
        </view>
      </view>
      <view class="submit" @click="next">确认出售</view>
    </view>
  </uni-popup>
</template>

<script>
const payWayMap = {
  1: "支付宝",
  2: "微信",
  3: "银行卡",
};
export default {
  name: "sellDialog",
  props: {
    form: {
      type: Object,
      dafault: () => {},
    },
  },
  data() {
    return {
      payWayMap,
    };
  },
  methods: {
    open() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    next() {
      this.close();
      this.$emit("next");
    },
  },
};
</script>

<style lang="scss" scoped>
.sure-box {
  width: 100%;
  height: 780rpx;
  background-color: #fff;
  box-sizing: border-box;
  padding: 50rpx 60rpx 40rpx 80rpx;
  position: relative;
  bottom: 120rpx;
  .title {
    color: #38363b;
    font-size: 36rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

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
    margin: 60rpx auto 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 26rpx;
  }
}
</style>
