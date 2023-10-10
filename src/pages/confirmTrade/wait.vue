<!-- 待付款 -->
<template>
  <view class="info-page-bg wait-to-pay">
    <view class="info-page-content content-box">
      <view class="title">
        <view>剩余付款时间</view>
        <view>￥8968</view>
      </view>
      <view class="time">14:58</view>
      <view class="tip"
        >请使用您本人(王宝强)的支付宝向以下账号自行转账，如
        使用其他姓名转账会导致购买失败！</view
      >

      <!-- 详情 -->
      <view class="info-item">
        <view>收款方式</view>
        <view class="item">
          <u-image
            class="icon"
            src="/static/images/mine/icon-alipay.png"
            width="31rpx"
            height="31rpx"
          ></u-image>
          <text>支付宝</text>
        </view>
      </view>
      <view class="info-item">
        <view>收款人</view>
        <view class="item">
          <text>王保长</text>
          <u-image
            class="copy"
            src="/static/images/funds/copy.png"
            width="26rpx"
            height="31rpx"
          ></u-image>
        </view>
      </view>
      <view class="info-item">
        <view>收款账号</view>
        <view class="item">
          <text>557575@qq.com单价(CNY)</text>
          <u-image
            class="copy"
            src="/static/images/funds/copy.png"
            width="26rpx"
            height="31rpx"
          ></u-image>
        </view>
      </view>
      <view class="info-item">
        <view>汇率</view>
        <view class="item">
          <text>1:1</text>
        </view>
      </view>
      <view class="info-item">
        <view>数量</view>
        <view class="item">
          <text>176575CFB</text>
        </view>
      </view>
      <view class="info-item">
        <view>订单号</view>
        <view class="item">
          <text>677556475755858</text>
        </view>
      </view>
      <view class="info-item">
        <view>创建时间</view>
        <view class="item">
          <text>2323-08-08 08:08:08</text>
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
          >转账完成后，请点击下方【我已付款】按钮，如果
          未点击该按钮，15分钟后订单会自动失败，您的资 金也会有损失的风险</text
        >
      </view>
      <view class="btns">
        <view class="btn">取消订单</view>
        <view class="btn active-btn" @click="payed">我已付款</view>
      </view>
    </view>

    <!-- 付款凭证 -->
    <PayDialog ref="payBox" />
  </view>
</template>

<script>
import PayDialog from './components/pay'

export default {
  name: "waitToPay",
  components: {
    PayDialog,
  },
  methods: {
    // 已付款
    payed() {
        this.$refs.payBox.open()
    }
  }
};
</script>

<style lang="scss" scoped>
.wait-to-pay {
  .content-box {
    height: 100%;
    overflow-y: auto;
    .title {
      color: #38363b;
      font-size: 40rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .time {
      color: #38363b;
      font-size: 28rpx;
      padding-bottom: 41rpx;
      margin-top: 6rpx;
      border-bottom: 1px solid #dfdfdf;
    }
    .tip {
      color: #ff4040;
      font-size: 26rpx;
      padding: 38rpx 0;
    }
    .info-item {
      color: #7a7a7a;
      font-size: 26rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80rpx;
      .item {
        display: flex;
        align-items: center;
        .icon {
            margin-right: 20rpx;
        }
        .copy {
            margin-left: 20rpx;
        }
      }
    }
  }
  .tip-box {
    margin-top: 80rpx;
    background-color: #f1f1f1;
    padding: 27rpx 20rpx 20rpx 80rpx;
    border-radius: 4rpx;
    color: #444242;
    font-size: 26rpx;
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
      width: 314rpx;
      height: 100rpx;
      margin: 50rpx 0;
      border-radius: 6rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border: 1px solid #38363b;
      color: #38363b;
      font-size: 34rpx;
    }
    .active-btn {
      background-color: #449367;
      border: none;
      color: #fff;
    }
  }
}
</style>
