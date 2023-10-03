<!-- 发布委托 -->
<template>
  <view class="info-page-bg entrust-post">
    <view class="info-page-content content-box">
      <view class="types">
        <text class="name">广告类型</text>
        <view class="type">
          <view class="check checked"><view class="in"></view></view>
          <text>购买</text>
        </view>
        <view class="line"></view>
        <view class="type">
          <view class="check"><view class="in"></view></view>
          <text>出售</text>
        </view>
      </view>

      <view class="subtitle">货币类型</view>
      <view class="ipt">
        <text class="input">人民币</text>
        <u-image
          class="icon"
          src="/static/images/index/more.png"
          width="15rpx"
          height="9rpx"
        ></u-image>
      </view>
      <view class="subtitle">数量</view>
      <view class="ipt">
        <input class="input" type="number" placeholder="数量" />
        <text>CFB</text>
      </view>
      <view class="subtitle">场外账户可用余额0.000000 CFB</view>
      <view class="price">
        <view class="price-item">
            <view class="price-info">
                <text>市场参考价格</text>
                <u-image
                class="icon"
                src="/static/images/index/help.png"
                width="30rpx"
                height="30rpx"
              ></u-image>
            </view>
            <view>23.4 CNY</view>
        </view>
      </view>
      <view class="subtitle">定价方式</view>
      <view class="ipt">
        <text class="input">市场价（溢价）</text>
        <u-image
          class="icon"
          src="/static/images/index/more.png"
          width="15rpx"
          height="9rpx"
        ></u-image>
      </view>
      <view class="subtitle">溢价方向</view>
      <view class="ipt">
        <text class="input">高于参考价</text>
        <u-image
          class="icon"
          src="/static/images/index/more.png"
          width="15rpx"
          height="9rpx"
        ></u-image>
      </view>
      <view class="subtitle">溢价百分比</view>
      <view class="ipt">
        <input class="input" type="number" placeholder="溢价百分比" />
        <text>%</text>
      </view>

      <view class="price">
        <view class="price-item">
            <view>单价</view>
            <view>23.4 CNY</view>
        </view>
        <view class="price-item">
            <view>总金额</view>
            <view>23.4 CNY</view>
        </view>
      </view>

      <view class="subtitle">最小金额</view>
      <view class="ipt">
        <input class="input" type="number" placeholder="请输入最小金额" />
        <text>CNY</text>
      </view>
      <view class="subtitle">最大金额</view>
      <view class="ipt">
        <input class="input" type="number" placeholder="请输入最大金额" />
        <text>CNY</text>
      </view>
      <view class="subtitle">付款时限</view>
      <view class="ipt">
        <input class="input" type="number" placeholder="付款时限" />
        <text>分钟</text>
      </view>
      <view class="subtitle">对方最少交易次数</view>
      <view class="ipt">
        <input class="input" type="number" placeholder="对方最少交易次数" />
        <text>次</text>
      </view>
      <view class="subtitle">失效时间</view>
      <view class="ipt">
        <text class="input">30天</text>
        <u-image
          class="icon"
          src="/static/images/index/more.png"
          width="15rpx"
          height="9rpx"
        ></u-image>
      </view>

      <view class="title2">收款方式(最多可选择3种收款方式)</view>
      <view class="pays">
        <view class="pay">
          <view class="check checked"><view class="in"></view></view>
          <u-image
            class="icon"
            src="/static/images/mine/icon-wechat.png"
            width="32rpx"
            height="32rpx"
          ></u-image>
          <text>微信</text>
        </view>
        <view class="pay">
          <view class="check"><view class="in"></view></view>
          <u-image
            class="icon"
            src="/static/images/mine/icon-alipay.png"
            width="32rpx"
            height="32rpx"
          ></u-image>
          <text>支付宝</text>
        </view>
        <view class="pay">
          <view class="check"><view class="in"></view></view>
          <u-image
            class="icon"
            src="/static/images/mine/icon-bank.png"
            width="32rpx"
            height="32rpx"
          ></u-image>
          <text>银行卡</text>
        </view>
      </view>

      <view class="subtitle">自动回复（非必填）</view>
      <view class="ipt">
        <input class="input" type="text" placeholder="请输入" />
      </view>
      <view class="subtitle">广告留言（非必填）</view>
      <view class="ipt">
        <input class="input" type="text" placeholder="请输入" />
      </view>

      <view class="submit">发布广告</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "entrustPost",
};
</script>

<style lang="scss" scoped>
.entrust-post {
  .content-box {
    overflow: auto;
  }
  .types {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #7a7a7a;
    font-size: 26rpx;
    padding-bottom: 30rpx;
    border-bottom: 1px solid #cecece;
    .name {
      flex: 1;
    }
    .type {
      display: flex;
      align-items: center;
      color: #454545;
    }
    .line {
      width: 1px;
      height: 38rpx;
      background-color: #bebebe;
      margin: 0 50rpx;
    }
  }
  .subtitle {
    color: #7a7a7a;
    font-size: 26rpx;
    margin: 35rpx 0;
  }
  .title2 {
    color: #433F48;
    font-size: 26rpx;
    margin-top: 50rpx;
    margin-bottom: 30rpx;
  }
  .pays {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .pay {
        display: flex;
        color: #433F48;
        font-size: 26rpx;
        align-items: center;
        .icon {
            margin-right: 10rpx;
        }
    }
  }
  .ipt {
    box-sizing: border-box;
    height: 72rpx;
    border-radius: 6rpx;
    background-color: #f1f1f1;
    padding: 0 40rpx 0 29rpx;
    display: flex;
    align-items: center;
    color: #433f48;
    font-size: 28rpx;
    .input {
      flex: 1;
      margin-right: 20rpx;
    }
  }
  .submit {
    width: 451rpx;
    height: 96rpx;
    background-color: #449367;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;
    margin: 96rpx auto;
  }

  .price {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 30rpx 0;
    line-height: 50rpx;
    .price-item {
        width: 40%;
        color: #433F48;
        font-size: 26rpx;
        .price-info {
            display: flex;
            align-items: center;
            .icon {
                margin-left: 10rpx;
            }
        }
    }
  }
}
</style>
