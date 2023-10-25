<!-- 闪兑 -->
<template>
  <view class="page-fe">
    <u-navbar
      :safeAreaInsetTop="true"
      :title="'闪兑'"
      @leftClick="() => $routers.back()"
    />
    <view class="self-status-bar"></view>

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
              <!-- <text class="tip" style="font-size: 15rpx">转出数量</text> -->
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
            @focus="fromIptFocus = true"
            @blur="fromIptFocus = false"
            :placeholder="fromIptFocus ? '' : '0'"
            placeholder-style="color:#fca223"
          />
        </view>
        <!-- <view class="tip">请输入数量</view> -->
        <view class="bottom">
          <view class="total">
            <text>可用余额：</text>
            <text class="money"
              >{{ form.amount || "0.00" }} {{ form.fromCoin }}</text
            >
          </view>
          <view class="all" @click="all">全部</view>
        </view>
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
              <!-- <text class="tip" style="font-size: 15rpx">接受数量</text> -->
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
            @focus="toIptFocus = true"
            @blur="toIptFocus = false"
            type="number"
            class="num"
            :placeholder="toIptFocus ? '' : '0'"
            placeholder-style="color:#fca223"
          />
          <!-- <view class="tip">请输入数量</view> -->
        </view>
        <view class="bottom">
          <view class="total">
            <text>汇率：</text>
            <text class="money" style="color: #e63c3c">{{
              form.rate || "--"
            }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="rate">
      <text>1{{ form.fromCoin }} ~ {{ form.rate }}{{ form.toCoin }}</text>
      <!-- <text class="num">{{ form.rate }}</text> -->
    </view>

    <u-button
      v-show="state == 1"
      type="primary"
      class="btn"
      :disabled="disabled"
      @click="submit"
      >闪兑</u-button
    >
    <u-button v-show="state == 2" type="primary" class="btn" :disabled="true"
      >暂未开启</u-button
    >
  </view>
</template>

<script>
import { getCoinPairExchangeInfo, toExchange } from "@/api/api";
import usdtIcon from "@/static/images/index/usdt.png";
import cfbIcon from "@/static/images/index/cfb.png";
import { _fixed } from "@/utils/utils";

const iconMap = {
  USDT: usdtIcon,
  CFB: cfbIcon,
};

export default {
  name: "flashExchange",
  data() {
    return {
      fromIptFocus: false,
      toIptFocus: false,
      iconMap,
      form: {
        fromCoin: "USDT",
        from: "",
        toCoin: "CFB",
        to: "",
        amount: "0.00", // 余额
        rate: "--", // 汇率
      },
      loading: false,
      state: 2, // 1-启用 2-禁用
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
            this.form.from = "";
            this.form.to = "";
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
      setTimeout(() => {
        if (type == "from") {
          if (!this.form.from) return (this.form.to = "");
          this.form.from = _fixed(this.form.from, 4);
          let num = this.form.from * this.form.rate;
          this.form.to = _fixed(num, 4);
        } else {
          if (!this.form.to) return (this.form.from = "");
          this.form.to = _fixed(this.form.to, 4);
          let num = this.form.to / this.form.rate;
          this.form.from = _fixed(num, 4);
        }
      }, 0);
    },
    // 全部
    all() {
      this.form.from = this.form.amount;
      this.calcRate("from");
    },
    // 查询余额和汇率
    getInfo(backLoading = false) {
      if (!backLoading) {
        uni.showLoading({
          title: "",
          mask: true,
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
            this.state = d.state;
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
      this.form.from = "";
      this.form.to = "";
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
    width: 647rpx;
    margin: 0 auto;
    border-radius: 15rpx;
    position: relative;
  }

  .box {
    box-sizing: border-box;
    flex: 1;
    border: 1px solid #cdcdcd;
    height: 236rpx;
    padding: 34rpx 44rpx 50rpx 50rpx;
    border-radius: 15rpx;
    .top {
      display: flex;
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
        height: 72rpx;
        min-width: 178rpx;
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
      color: #252525;
      font-size: 26rpx;
      margin-top: 16rpx;

      .money {
        color: #449367;
      }

      .all {
        color: #232323;
      }
    }
  }

  .box2 {
    margin-top: 14rpx;
  }

  .trans-icon {
    background-color: #f0f0f0;
    width: 92rpx;
    height: 92rpx;
    border-radius: 12rpx;
    position: absolute;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateX(-50%) translateY(calc(-50% + 7rpx));
    left: 50%;
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
