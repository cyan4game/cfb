<!-- 委托详情 -->
<template>
  <view class="info-page-bg page-entrust-info">
    <view class="info-page-content content-box">
      <view class="title">委托详情</view>
      <view class="info">
        <text>创建时间</text>
        <text class="time">2022/07/01 15:22:14</text>
      </view>

      <view class="item">
        <view class="row">
          <view class="name">委托</view>
          <view class="val">76</view>
        </view>
        <view class="row row2">
          <view class="name">币种</view>
          <view class="val">USDT</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">委托类型</view>
          <view class="val">出售</view>
        </view>
        <view class="row row2">
          <view class="name">货币类型</view>
          <view class="val">CNY</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">剩余总量/总数量</view>
          <view class="val">100/100</view>
        </view>
        <view class="row row2">
          <view class="name"></view>
          <view class="val right">USDT</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">市场参考价格</view>
          <view class="val">7.88CNY</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">定价方式</view>
          <view class="val">市场价（溢价）</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">溢价方向</view>
          <view class="val">高于参考价</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">溢价百分比</view>
          <view class="val">0</view>
        </view>
        <view class="row row2">
          <view class="name"></view>
          <view class="val right">%</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">单价</view>
          <view class="val">6.69</view>
        </view>
        <view class="row row2">
          <view class="name">总金额</view>
          <view class="val">669.00CNY</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">最小金额</view>
          <view class="val">2.00</view>
        </view>
        <view class="row row2">
          <view class="name"></view>
          <view class="val right">CNY</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">最大金额</view>
          <view class="val">2.00</view>
        </view>
        <view class="row row2">
          <view class="name"></view>
          <view class="val right">CNY</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">付款时限</view>
          <view class="val">2</view>
        </view>
        <view class="row row2">
          <view class="name"></view>
          <view class="val right">分钟</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">对方最少交易次数</view>
          <view class="val">5</view>
        </view>
        <view class="row row2">
          <view class="name"></view>
          <view class="val right">次</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">失效时间</view>
          <view class="val">30</view>
        </view>
        <view class="row row2">
          <view class="name"></view>
          <view class="val right">天</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">自动回复（非必填）</view>
          <view class="val flex-box">
            <view class="pay">
              <u-image
                class="icon"
                src="/static/images/mine/icon-wechat.png"
                width="32rpx"
                height="32rpx"
              ></u-image>
              <text>微信</text>
            </view>
            <view class="pay">
              <u-image
                class="icon"
                src="/static/images/mine/icon-alipay.png"
                width="32rpx"
                height="32rpx"
              ></u-image>
              <text>支付宝</text>
            </view>
            <view class="pay">
              <u-image
                class="icon"
                src="/static/images/mine/icon-bank.png"
                width="32rpx"
                height="32rpx"
              ></u-image>
              <text>银行卡</text>
            </view>
          </view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">自动回复（非必填）</view>
          <view class="val">您好，请问有什么可以帮您？</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">广告留言（非必填）</view>
          <view class="val"
            >请放心购买此商户的币，平台可为您保驾护航。请放心购买此商户的币</view
          >
        </view>
      </view>

      <view class="submit">关闭广告</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-entrust-info {
  .content-box {
    overflow: auto;
    font-weight: 400;
  }
  .title {
    color: #38363b;
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 44rpx;
    padding-left: 20rpx;
  }
  .info {
    height: 120rpx;
    border-radius: 10rpx;
    background-color: #f0f0f0;
    color: #343635;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 42rpx 0 36rpx;
    margin-bottom: 17rpx;
    .time {
      font-size: 24rpx;
    }
  }
  .item {
    // height: 137rpx;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    border-bottom: 1px solid #cecece;
    font-size: 26rpx;
    color: #7a7a7a;
    padding-bottom: 35rpx;
    padding-top: 33rpx;
    .row {
      flex: 1;
      padding-left: 20rpx;
      .name {
        min-height: 26rpx;
      }
      .val {
        margin-top: 32rpx;
        color: #3c3c3c;
        font-size: 26rpx;
        font-weight: 500;
      }
      .right {
        text-align: right;
      }
      .flex-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .pay {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 20rpx;
          }
        }
      }
    }
  }
  .submit {
    width: 451rpx;
    height: 96rpx;
    background-color: #449367;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;
    margin: 80rpx auto;
  }
}
</style>
