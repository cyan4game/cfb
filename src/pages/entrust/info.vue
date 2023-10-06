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
        <text>委托人</text>
        <text class="val">Justin</text>
      </view>
      <view class="item">
        <text>委托类型</text>
        <text class="val">出售</text>
      </view>
      <view class="item">
        <text>数量</text>
        <text class="val">3000.00</text>
      </view>
      <view class="item">
        <text>币种</text>
        <text class="val">CFB</text>
      </view>
      <view class="item">
        <text>参考汇率</text>
        <text class="val">￥1.00</text>
      </view>
      <view class="item">
        <text>预估成交金额</text>
        <text class="val">￥3000.00</text>
      </view>
      <view class="item">
        <text>结束时间</text>
        <text class="val">30天</text>
      </view>
      <view class="item">
        <text>收款账号</text>
        <text class="val">75675588686</text>
      </view>
      <view class="item">
        <text>收款方式</text>
        <text class="val">银行卡</text>
      </view>
      <view class="item">
        <text>收款银行</text>
        <text class="val">工商银行</text>
      </view>
      <view class="item">
        <text>收款银行分行</text>
        <text class="val">工商银行福州分行</text>
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
        <!-- 交易中 -->
        <!-- <template>
          <view class="btn">查看收款信息</view>
          <view class="submit">确认付款</view>
        </template> -->
        <!-- 已关闭-配对成功 -->
        <!-- <template>
          <view class="btn">查看订单</view>
          <view class="submit">再次下单</view>
        </template> -->
        <!-- 已关闭-未配对成功 -->
        <!-- <template>
          <view class="submit">重新发布</view>
        </template> -->
        
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
    display: flex;
    color: #7A7A7A;
    font-size: 26rpx;
    align-items: center;
    justify-content: space-between;
    height: 120rpx;
    border-bottom: 1px solid #eee;
    .val {
      color: #3C3C3C;
      display: flex;
      align-items: center;
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
    flex: 1;
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
