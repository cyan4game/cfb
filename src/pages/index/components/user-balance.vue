<!-- 用户资产 -->
<template>
  <view class="user-banlance">
    <!-- 弹出详情 -->
    <view class="dialog-box-bg" v-show="showInfo" @click="showInfo = false">
      <view class="dialog-box">
        <view class="close">
          <u-image
            mode="contain"
            src="/static/images/index/close.png"
            width="24rpx"
            height="24rpx"
          ></u-image>
        </view>
        <view class="item">
          <text>CFB余额</text>
          <text class="val">{{ assets.cfbBalance || "0.00" }}</text>
        </view>
        <view class="item">
          <text>USDT余额</text>
          <text class="val">{{ assets.usdtBalance || "0.00" }}</text>
        </view>
        <view class="item">
          <text>委托中USDT</text>
          <text class="val">{{ assets.usdtEntrust || "0.00" }}</text>
        </view>
        <view class="item">
          <text>委托中CFB</text>
          <text class="val">{{ assets.cfbEntrust || "0.00" }}</text>
        </view>
      </view>
    </view>

    <!-- 顶部 -->
    <view class="title">
      <text>CFB资产</text>
      <u-image
        class="eye"
        v-show="showMoney"
        @click="showMoney = false"
        src="/static/images/index/eye-open.png"
        width="33rpx"
        height="23rpx"
      ></u-image>
      <u-image
        class="eye"
        v-show="!showMoney"
        @click="showMoney = true"
        src="/static/images/index/eye-close.png"
        width="33rpx"
        height="23rpx"
      ></u-image>

      <u-image
        @click="() => (showInfo = !showInfo)"
        class="time"
        src="/static/images/index/total.png"
        width="33rpx"
        height="32rpx"
      ></u-image>
    </view>

    <!-- 余额 -->
    <view class="amount">
      <view>≈</view>
      <view class="num">{{ showMoney ? _fixed(total) : "****" }}</view>
      <view class="select" @click="showSelect = !showSelect">
        <u-image
          class="icon"
          :src="iconMap[currCoin]"
          width="34rpx"
          height="34rpx"
        ></u-image>
        <view>{{ currCoin }}</view>
        <u-image
          class="more"
          src="/static/images/index/more.png"
          width="13rpx"
          height="8rpx"
          :style="{ transform: showSelect ? 'rotate(180deg)' : 'rotate(0deg)' }"
        ></u-image>

        <!-- 选择弹窗 -->
        <view class="select-dialog" v-show="showSelect">
          <view
            class="select-item"
            v-for="(item, i) in coins"
            :key="i"
            @click.stop="selectCoin(item)"
          >
            <u-image
              class="icon"
              :src="iconMap[item.coin]"
              width="30rpx"
              height="30rpx"
            ></u-image>
            <text>{{ item.name }}</text>
          </view>
        </view>

        <view class="select-dialog-bg" v-show="showSelect"></view>
      </view>
    </view>

    <!-- 收益 -->
    <view class="income">
      <view class="item">
        <u-image
          class="ball"
          src="/static/images/index/total-1.png"
          width="35rpx"
          height="36rpx"
        ></u-image>
        <view>
          <view class="num">${{ showMoney ? "0.00" : "****" }}</view>
          <text>今日收益</text>
        </view>
      </view>
      <view class="line"></view>
      <view class="item item2">
        <u-image
          class="ball"
          src="/static/images/index/total-2.png"
          width="42rpx"
          height="32rpx"
        ></u-image>
        <view>
          <view class="num">${{ showMoney ? "0.00" : "****" }}</view>
          <text>累计收益</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import total from "./total";
import { memberAsset } from "@/api/api";
import usdtIcon from "@/static/images/index/usdt.png";
import cfbIcon from "@/static/images/index/cfb.png";
import { _fixed } from "@/utils/utils";
const iconMap = {
  USDT: usdtIcon,
  CFB: cfbIcon,
};

export default {
  name: "user-banlance",
  data() {
    return {
      assets: {},
      iconMap,
      showInfo: false, // 是否展示详情
      showMoney: true, // 是否展示数字
      showSelect: false, // 是否展示币种选择
      currCoin: "USDT",
      coins: [
        {
          coin: "USDT",
          name: "USDT",
          chain: "TRC20",
        },
        {
          coin: "CFB",
          name: "CFB",
          chain: "CFB",
        },
      ],
    };
  },
  computed: {
    total() {
      let t = "0.00";
      if (this.currCoin == "USDT") t = this.assets.usdtTotalBalance;
      if (this.currCoin == "CFB") t = this.assets.cfbTotalBalance;
      return t || "0.00";
    },
  },
  methods: {
    _fixed,
    // 获取资产
    getAssets() {
      memberAsset().then((res) => {
        if (res.code == 200) {
          this.assets = res.data;
        }
      });
    },
    // 选择币种
    selectCoin(item) {
      this.currCoin = item.coin;
      setTimeout(() => {
        this.showSelect = false;
      }, 0);
    },
    closeSelectCoin() {
      this.showSelect = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.user-banlance {
  width: 100%;
  margin-top: 20rpx;
  border-radius: 6rpx;
  border: 1px solid #d7d7d7;
  padding: 40rpx 40rpx 32rpx 40rpx;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #606060;
    font-size: 28rpx;
    .eye {
      margin-left: 20rpx;
    }
    .time {
      margin-left: auto;
    }
  }
  .amount {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #343635;
    font-weight: bold;
    font-weight: 66rpx;
    margin: 32rpx 0;
    .num {
      font-size: 62rpx;
      margin: 0 20rpx 0 20rpx;
      word-break: break-all;
      flex: 1;
    }
    .select {
      display: flex;
      align-items: center;
      height: 55rpx;
      background-color: #f0f0f0;
      border-radius: 6rpx;
      font-size: 22rpx;
      font-weight: 400;
      padding: 0 12rpx;
      position: relative;
      .icon {
        margin-right: 10rpx;
      }
      .more {
        margin-left: 10rpx;
      }
      .select-dialog {
        width: 100%;
        position: absolute;
        height: 140rpx;
        left: 0;
        bottom: -140rpx;
        background-color: #fff;
        z-index: 9;
        box-sizing: border-box;
        padding: 10rpx;
        border: 1px solid #e2e2e2;
        border-top: none;
        .select-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 60rpx;
          padding-left: 10rpx;
        }
      }
      .select-dialog-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0);
      }
    }
  }
  .detail {
    color: #8c8c8c;
    font-size: 22rpx;
    display: flex;
    align-items: center;
    padding: 20rpx 0 35rpx 0;
    justify-content: space-between;
    border-bottom: 1px solid #cecece;
    .item {
      text-align: center;
      .num {
        color: #262626;
        font-size: 33rpx;
        margin-top: 10rpx;
      }
    }
    .line {
      width: 1px;
      height: 40rpx;
      background-color: #cecece;
    }
  }
  .income {
    margin-top: 40rpx;
    display: flex;
    align-items: center;
    .item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8c8c8c;
      font-size: 22rpx;
      .ball {
        margin-right: 30rpx;
      }
      .num {
        color: #404040;
        font-size: 33rpx;
      }
    }
    .line {
      margin: 0 40rpx;
      height: 52rpx;
      background-color: #38363b;
      width: 1px;
    }
  }
  .dialog-box-bg {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .dialog-box {
    border: 1px solid #d7d7d7;
    border-top: none;
    width: 630rpx;
    position: absolute;
    top: calc(450rpx + var(--status-bar-height)) !important;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    z-index: 9;
    border-radius: 6rpx;
    padding: 20rpx 40rpx;
    box-sizing: border-box;
    .close {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #eee;
      border-radius: 50%;
      box-sizing: border-box;
      margin: 10rpx 0 10rpx auto;
    }
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #8c8c8c;
      font-size: 28rpx;
      box-sizing: border-box;
      height: 91rpx;
      border-bottom: 1px solid #dfdfdf;
      &:last-child {
        border-bottom: none;
      }
      .val {
        color: #262626;
      }
    }
  }
}
</style>
