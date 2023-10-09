<!-- 购买 -->
<template>
  <view class="info-page-bg page-trade">

    <!-- 菜单按钮 -->
    <u-image
      class="menu-icon"
      src="/static/images/index/menu.png"
      width="35rpx"
      height="35rpx"
    ></u-image>

    <view class="info-page-content content-box">
      <view class="box type-box">
        <view
          class="type"
          @click="type = 1"
          :class="{ 'active-type': type == 1 }"
          >购买</view
        >
        <view
          class="type"
          @click="type = 2"
          :class="{ 'active-type': type == 2 }"
          >出售</view
        >
      </view>

      <!-- <view class="box tab-box" v-if="type == 1">
        <view class="tab active-tab">USDT</view>
        <view class="tab">CFB</view>
      </view> -->

      <!-- 表单 -->
      <view class="form">
        <view class="title" v-show="type == 2">
          <text>收款账号</text>
        </view>
        <view class="ipt" v-show="type == 2">
          <text>请选择收款方式</text>
          <u-image
            class="more"
            src="/static/images/index/more.png"
            width="16rpx"
            height="9rpx"
          ></u-image>
        </view>
        <view class="title">
          <text>{{ type == 2 ? '出售' : '请选择购买金额' }}</text>
          <text class="amount" v-show="type == 2">可用余额3000CFB</text>
          <view class="refresh">
            <text>刷新</text>
            <u-image
            class="refresh-icon"
            src="/static/images/index/refresh.png"
            width="20rpx"
            height="20rpx"
          ></u-image>
          </view>
        </view>
        <view class="ipt" v-show="type == 2">
          <input class="input" type="number" placeholder="限额  100-200.000" />
        </view>
        <view class="fasters">
          <view class="faster" v-for="item in fasters" :key="item">{{
            item
          }}</view>
          <view class="faster" v-show="type == 1">
            <input class="input" type="number" placeholder="其他金额" />
          </view>
        </view>
      </view>

      <view class="box tip-box">
        <view class="tip">
          参考汇率
          <u-image
            class="question"
            src="/static/images/index/question.png"
            width="32rpx"
            height="32rpx"
          ></u-image>
        </view>
        <view>1:1</view>
      </view>

      <view class="box bottom-box">
        <view>预计{{ type == 1 ? "支付" : "到账" }}</view>
        <view>￥12000.00</view>
      </view>
      <view class="bottom">
        <view>交易提醒：</view>
        <br />
        <view>1. 请严格按照页面指引操作；</view>
        <view>2. 订单一旦提交，请勿随意取消；</view>
      </view>
    </view>

    <u-button class="info-page-btn submit" @click="submit"
      >立即{{ type == 1 ? "购买" : "出售" }}</u-button
    >

    <!-- 匹配弹窗 -->
    <MatchDialog ref="matchBox" />
    <!-- 出售确认 -->
    <sellDialog ref="sellBox" />
  </view>
</template>

<script>
import MatchDialog from "./components/match";
import sellDialog from "./components/sellDialog";

export default {
  name: "pageTrade",
  components: {
    MatchDialog,
    sellDialog,
  },
  data() {
    return {
      type: 1, // 1-购买 2-出售
      fasters: [100, 300, 500, 1100, 1800, 2100],
    };
  },
  onLoad(data) {
    this.type = data.type || 1;
  },
  methods: {
    // 购买
    submit() {
      if (this.type == 1) {
        this.$refs.matchBox.open();
      } else {
        this.$refs.sellBox.open();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-trade {
  font-weight: 400;
  .menu-icon {
    position: fixed;
    z-index: 9999;
    right: 40rpx;
    top: 28rpx;
  }
  .content-box {
    color: #7a7a7a;
    font-size: 26rpx;
    padding-bottom: 160rpx;
    .box {
      height: 100rpx;
      border-bottom: 1px solid #cecece;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .type-box {
      .type {
        line-height: 38rpx;
        font-size: 32rpx;
        color: #868686;
        padding: 0 31rpx;
        border-right: 1px solid #bebebe;
        font-weight: 400;
      }
      .active-type {
        color: #454545;
        font-size: 34rpx;
        font-weight: 500;
      }
    }
    .tab-box {
      align-items: stretch;
      .tab {
        margin-right: 40rpx;
        padding: 0 20rpx;
        box-sizing: border-box;
        line-height: 100rpx;
      }
      .active-tab {
        border-bottom: 8rpx solid #449367;
      }
    }
    .tip-box {
      .tip {
        display: flex;
        align-items: center;
        flex: 1;
        .question {
          margin-left: 16rpx;
        }
      }
    }
    .bottom-box {
      border-bottom: none;
      justify-content: space-between;
    }
    .bottom {
      color: #3c3c3c;
      margin-top: 10rpx;
      font-weight: 500;
    }
  }
  .form {
    .title {
      margin: 36rpx 0;
      position: relative;
      .amount {
        margin-left: 30rpx;
        color: #FB2B2B;
      }
      .refresh {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        top: 0;
        .refresh-icon {
          margin-left: 10rpx;
        }
      }
    }
    .ipt {
      height: 72rpx;
      background-color: #f1f1f1;
      border-radius: 6rpx;
      margin-bottom: 42rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30rpx;
      .input {
        font-size: 28rpx;
        color: #333;
      }
    }
    .fasters {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .faster {
        width: 213rpx;
        height: 72rpx;
        border-radius: 6px;
        margin-bottom: 28rpx;
        background-color: #f1f1f1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #433f48;
        font-size: 28rpx;
        padding: 0 20rpx;
        box-sizing: border-box;
        .input {
          color: #433f48;
          font-size: 28rpx;
          text-align: center;
        }
      }
    }
  }
  .submit {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 60rpx;
  }
}
</style>
