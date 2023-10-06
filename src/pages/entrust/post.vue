<!-- 发布委托 -->
<template>
  <view class="info-page-bg entrust-post">
    <view class="info-page-content content-box">
      <view class="types">
        <text class="name">广告类型</text>
        <view class="type">
          <view class="check" @click="type='buy'" :class="{'checked':type=='buy'}"><view class="in"></view></view>
          <text>购买</text>
        </view>
        <view class="line"></view>
        <view class="type">
          <view class="check" @click="type='sell'" :class="{'checked':type=='sell'}"><view class="in"></view></view>
          <text>出售</text>
        </view>
      </view>

      
      <view class="subtitle">数量</view>
      <view class="ipt">
        <input class="input" type="number" placeholder="数量" />
        <text>CFB</text>
      </view>
      <view style="display: flex;">
        <view style="flex:1">
          <view class="subtitle">参考汇率</view>
          <view class="ipt">
            <text class="input">1.00</text>
          </view>
        </view>
        <view style="flex:2;margin-left: 20rpx;">
          <view class="subtitle">预估成交金额</view>
          <view class="ipt">
            <text class="input">100.00</text>
          </view>
        </view>
      </view>
      <view class="subtitle">结束时间</view>
      <view class="ipt">
        <text class="input">3天</text>
        <u-image
          class="icon"
          src="/static/images/index/more.png"
          width="15rpx"
          height="9rpx"
        ></u-image>
      </view>
      <view class="subtitle" v-show="type=='sell'">收款账号</view>
      <view class="ipt" v-show="type=='sell'">
        <text class="input">34576538483688</text>
        <u-image
          class="icon"
          src="/static/images/index/more.png"
          width="15rpx"
          height="9rpx"
        ></u-image>
      </view>


      <view class="submit">发布委托</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "entrustPost",
  data() {
    return {
      type: 'buy', // 出售-sell  购买-buy
    }
  }
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
      font-size: 28rpx;
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
