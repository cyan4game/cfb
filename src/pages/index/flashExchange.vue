<!-- 闪兑 -->
<template>
  <view class="page-fe">
    <u-navbar
      :safeAreaInsetTop="false"
      :title="'闪兑'"
      @leftClick="() => $routers.back()"
    />

   

    <view class="main-box">
      <view class="box">
        <view class="top">
          <view class="select">
            <u-image
              class="img"
              :src="iconMap[form.fromCoin]"
              width="34rpx"
              height="34rpx"
            ></u-image>
            <view>
              <view style="margin-bottom: 4rpx">{{ form.fromCoin }}</view>
              <text class="tip" style="font-size: 15rpx">转出数量</text>
            </view>
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
        <view class="tip">请输入数量</view>
        <!-- <view class="bottom">
          <view class="total">
            <text>可用余额：</text>
            <text class="money"
              >{{ form.amount || "0.00" }} {{ form.fromCoin }}</text
            >
          </view>
          <view class="all" @click="all">全部</view>
        </view> -->
      </view>

      <view class="trans-icon" @click="changeCoin">
        <u-image
          class="more"
          src="/static/images/home/trans.png"
          width="43rpx"
          height="39rpx"
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
            <view>
              <view style="margin-bottom: 4rpx">{{ form.toCoin }}</view>
              <text class="tip" style="font-size: 15rpx">接受数量</text>
            </view>
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
          <view class="tip">请输入数量</view>
        </view>
      </view>
    </view>

    <view class="rate">
      <text>1{{ form.fromCoin }} = {{ form.rate }}{{ form.toCoin }}</text>
      <!-- <text class="num">{{ form.rate }}</text> -->
    </view>

    <u-button type="primary" class="btn" :disabled="disabled" @click="submit"
      >闪兑</u-button
    >

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
        from: "0",
        toCoin: "CFB",
        to: "0",
        amount: "0.00", // 余额
        rate: "--", // 汇率
      },
      loading: false,
    };
  },
  computed: {
    disabled() {
      return (
        this.loading ||
        !Number(this.form.from) ||
        !(
          Number(this.form.from) > 0 &&
          Number(this.form.from) <= Number(this.form.amount)
        )
      );
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
          if (res.code == 200) {
            uni.showToast({
              title: "兑换成功",
              icon: "none",
              duration: 2000,
            });
            this.form.from = "0";
            this.form.to = "0";
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
      this.form.from = "0";
      this.form.to = "0";
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
    color: #808080;
    font-size: 26rpx;
    padding: 109rpx 0 8rpx 0;

    .num {
      color: #e63c3c;
    }
  }
  .main-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #cdcdcd;
    width: 647rpx;
    height: 300rpx;
    margin: 0 auto;
    border-radius: 15rpx;
  }

  .box {
    box-sizing: border-box;
    flex: 1;
    .top {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .select {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        background-color: #f0f0f0;
        border-radius: 7rpx;
        padding: 16rpx 15rpx 6rpx 12rpx;
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
        text-align: center;
        color: #fca223;
        font-size: 56rpx;
        margin: 10rpx 0 16rpx 0;
      }
    }
    .tip {
      color: #808080;
      font-size: 18rpx;
      text-align: center;
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
    position: relative;
    z-index: 1;
  }

  .trans-icon {
    background-color: #f0f0f0;
    width: 70rpx;
    height: 70rpx;
    border-radius: 12rpx;
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
    margin: 50rpx auto 0 auto;
  }
}
</style>
