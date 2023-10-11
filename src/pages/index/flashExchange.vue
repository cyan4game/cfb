<!-- 闪兑 -->
<template>
  <view class="page-fe">
    <!-- 右上角功能按钮 -->
    <!-- <u-image
      class="time-icon"
      src="/static/images/home/time.png"
      width="36rpx"
      height="36rpx"
    ></u-image> -->
    <u-navbar :title="'闪兑'" @leftClick="() => $router.back()" />

    <view class="rate">
      <text>汇率：</text>
      <text class="num">{{ form.rate }}</text>
    </view>

    <view class="box">
      <view class="top">
        <view class="select">
          <u-image
            class="img"
            :src="iconMap[form.fromCoin]"
            width="34rpx"
            height="34rpx"
          ></u-image>
          <text>{{ form.fromCoin }}</text>
          <u-image
            class="more"
            src="/static/images/index/more.png"
            width="13rpx"
            height="8rpx"
          ></u-image>
        </view>
        <input
          type="number"
          @input="calcRate('from')"
          v-model="form.from"
          class="num"
          placeholder=""
        />
      </view>
      <view class="bottom">
        <view class="total">
          <text>可用余额：</text>
          <text class="money"
            >{{ form.amount || "--" }} {{ form.fromCoin }}</text
          >
        </view>
        <view class="all" @click="all">全部</view>
      </view>
    </view>

    <view class="trans-icon" @click="changeCoin">
      <u-image
        class="more"
        src="/static/images/home/trans.png"
        width="51rpx"
        height="47rpx"
      ></u-image>
    </view>

    <view class="box box2">
      <view class="top">
        <view class="select">
          <u-image
            class="img"
            :src="iconMap[form.toCoin]"
            width="34rpx"
            height="34rpx"
          ></u-image>
          <text>{{ form.toCoin }}</text>
          <u-image
            class="more"
            src="/static/images/index/more.png"
            width="13rpx"
            height="8rpx"
          ></u-image>
        </view>
        <input
          v-model="form.to"
          @input="calcRate('to')"
          type="number"
          class="num"
          placeholder=""
        />
      </view>
    </view>

    <u-button class="btn" :disabled="disabled" @click="submit">兑换</u-button>

    <coin-select ref="coinSelect" @select="coinSelect"></coin-select>
  </view>
</template>

<script>
import { getCoinPairExchangeInfo, toExchange } from "@/api/api";
import usdtIcon from "@/static/images/index/usdt.png";
import cfbIcon from "@/static/images/index/cfb.png";
import { truncateDecimal } from "@/utils/utils";

const iconMap = {
  USDT: usdtIcon,
  CFB: cfbIcon,
};

export default {
  name: "flashExchange",
  data() {
    return {
      iconMap,
      form: {
        fromCoin: "USDT",
        from: "0.00",
        toCoin: "CFB",
        to: "0.00",
        amount: "--", // 余额
        rate: "--", // 汇率
      },
      loading: false,
    };
  },
  computed: {
    disabled() {
      return this.loading || !Number(this.form.from);
    },
  },
  onShow() {
    this.getInfo();
  },
  methods: {
    // 兑换
    submit() {
      this.loading = true;
      toExchange({
        amount: this.form.from,
        fromCoin: this.form.fromCoin,
        toCoin: this.form.toCoin,
      })
        .then((res) => {
          console.error("res", res);
          if (res.code == 200) {
            uni.showToast({
              title: "兑换成功",
              icon: "none",
              duration: 2000,
            });
            this.form.from = "0.00";
            this.form.to = "0.00";
            this.getInfo(true);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 计算数量
    calcRate(type = "from") {
      // if (type == 'from') { // to-2位截断
      //     let num = Number(this.form.from * this.form.rate).toFixed(3)
      //     num = num.toString().substr(0, num.toString().length - 1)
      //     this.form.to = num
      // } else { // form-2位上取整
      //     let num = Number(this.form.to / this.form.rate).toFixed(3)
      //     num = Math.ceil(num * 100) / 100
      //     this.form.from = num
      // }
      if (type == "from") {
        let num = this.form.from * this.form.rate;
        this.form.to = truncateDecimal(num, 2);
      } else {
        let num = this.form.to / this.form.rate;
        this.form.from = truncateDecimal(num, 2);
      }
    },
    // 全部
    all() {
      this.form.from = this.form.amount;
      this.calcRate("from");
    },
    // 开始选择
    openCoinSelect() {
      this.$refs.coinSelect.open();
    },
    // 币种选择
    coinSelect(item) {
      this.$refs.coinSelect.close();
      console.error(item);
    },
    // 查询余额和汇率
    getInfo(backLoading = false) {
      if (!backLoading) {
        uni.showLoading({
          title: "",
        });
      }
      getCoinPairExchangeInfo({
        fromCoin: this.form.fromCoin,
        toCoin: this.form.toCoin,
      })
        .then((res) => {
          console.error("--结果", res);
          if (res.code == 200) {
            const d = res.data;
            this.form.amount = d.balance;
            this.form.rate = d.exchangeRate;
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    // 交换币对
    changeCoin() {
      const fromCoin = this.form.toCoin;
      const toCoin = this.form.fromCoin;
      this.form.fromCoin = fromCoin;
      this.form.toCoin = toCoin;
      this.form.from = "0.00";
      this.form.to = "0.00";
      this.form.rate = "--";
      this.form.amount = "--";
      this.getInfo();
    },
  },
};
</script>

<style lang="scss" scoped>
.page-fe {
  padding-top: 140rpx;
  .time-icon {
    position: fixed;
    top: 24rpx;
    right: 24rpx;
    z-index: 999;
  }

  .rate {
    text-align: center;
    color: #7a7a7a;
    font-size: 26rpx;
    padding: 50rpx 0 8rpx 0;

    .num {
      color: #e63c3c;
    }
  }

  .box {
    padding: 50rpx 50rpx 80rpx 50rpx;
    box-sizing: border-box;
    border: 1px solid #cdcdcd;
    margin: 17rpx 50rpx;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .select {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        height: 55rpx;
        background-color: #f0f0f0;
        border-radius: 7rpx;
        padding: 0 15rpx;
        color: #454545;
        font-size: 22rpx;

        .img {
          margin-right: 8rpx;
        }

        .more {
          margin-left: 17rpx;
        }
      }

      .num {
        text-align: right;
        color: #fca223;
        font-size: 56rpx;
      }
    }

    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 50rpx;
      color: #252525;
      font-size: 26rpx;

      .money {
        color: #449367;
      }

      .all {
        color: #232323;
      }
    }
  }

  .box2 {
    padding-top: 80rpx;
    position: relative;
    z-index: 1;
  }

  .trans-icon {
    background-color: #f0f0f0;
    width: 92rpx;
    height: 92rpx;
    border-radius: 12rpx;
    margin: -50rpx auto -50rpx auto;
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn {
    width: 451rpx;
    height: 96rpx;
    background-color: #449367;
    color: #fff;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 60rpx;
  }
}
</style>
