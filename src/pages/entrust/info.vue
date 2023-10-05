<!-- 委托详情 -->
<template>
  <view class="info-page-bg page-entrust-info">
    <view class="info-page-content content-box">
      <view class="title">发布中</view>
      <view class="info">
        <text>创建时间</text>
        <text class="time">2022/07/01 15:22:14</text>
      </view>

      <view class="item">
        <view class="row">
          <view class="name">委托类型</view>
          <view class="val">出售</view>
        </view>
        <view class="row row2">
          <view class="name">委托人</view>
          <view class="val">Justin</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">数量</view>
          <view class="val">76</view>
        </view>
        <view class="row row2">
          <view class="name">币种</view>
          <view class="val">CFB</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">参考汇率</view>
          <view class="val">1.00</view>
        </view>
        <view class="row row2">
          <view class="name">预估成交金额</view>
          <view class="val">￥1212.00</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">结束时间</view>
          <view class="val">30天</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">收款方式</view>
          <view class="val">银行卡</view>
        </view>
        <view class="row row2">
          <view class="name">收款账号</view>
          <view class="val">12367123512</view>
        </view>
      </view>
      <view class="item">
        <view class="row">
          <view class="name">收款银行</view>
          <view class="val">工商银行</view>
        </view>
        <view class="row row2">
          <view class="name">收款银行分行</view>
          <view class="val">工商银行福州分行</view>
        </view>
      </view>
      
      <!-- <view class="item">
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
      </view> -->

      <view class="btns">
        <!-- 发布中 -->
        <template>
          <view class="btn">取消委托</view>
          <view class="submit">编辑</view>
        </template>
        
      </view>
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
    justify-content: space-between;
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
  .btns {
    margin: 80rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn {
    box-sizing: border-box;
    height: 96rpx;
    flex: 1;
    margin-right: 30rpx;
    border: 1px solid #38363B;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #38363B;
    font-size: 32rpx;
    border-radius: 6rpx;
  }
  .submit {
    box-sizing: border-box;
    border-radius: 6rpx;
    flex: 2;
    height: 96rpx;
    background-color: #449367;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;
  }
}
</style>
