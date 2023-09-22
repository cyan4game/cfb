<template>
  <view class="post-content flex-box">
    <order-header
      @changeMenu="changeMenu"
      @changeCurrency="changeCurrency"
      :current.sync="current"
      :topMenuList="topMenuList"
    ></order-header>
    <view class="view-content">
      <view class="post-content">
        <post-form
          :coinType="coinType"
          :limit="limit"
          :rateData="rateData"
          :current="current"
          :tradeList="tradeList"
          @changeAmount="changeAmount"
          @getTradeList="getTradeList"
        ></post-form>
      </view>
    </view>
  </view>
</template>

<script>
import orderHeader from "../trade/components/order-header";
import postForm from "./component/post-form";
import { getRate, getMemberLimitAmount } from "../../api/api";
import { mapActions } from "vuex";
import { getTradeList } from "../../api/api";

export default {
  name: "index",
  components: { orderHeader, postForm },
  data() {
    return {
      current: "0",
      topMenuList: [
        { label: "购买", key: "0", value: "buy", isRequest: true },
        { label: "出售", key: "1", value: "sell", isRequest: true },
      ],
      rateData: {},
      coinType: "USDT",
      limit: {},
      tradeList: [],
      amount: null,
    };
  },
  async onPullDownRefresh() {
    await this.getRate();
    uni.stopPullDownRefresh();
  },
  onShow() {
    this.getMemberLimitAmount();
    this.getRate();
    this.GET_BANK_LIST();
  },
  methods: {
    ...mapActions("user", ["GET_BANK_LIST"]),
    changeAmount(amount) {
      this.amount = amount;
      this.getTrade(amount);
    },
    getTradeList() {
      this.getTrade(this.amount);
    },
    getTrade(amount) {
      const params = {
        currentPage: 1,
        pageSize: 2,
        advertiseType: this.current,
        coinUnit: this.coinType,
        minAmount: amount / 2,
      };
      getTradeList(params).then((res) => {
        if (res.code.toString() === "0") {
          if (res.data) {
            this.tradeList = res.data.rows;
          }
        }
      });
    },
    changeMenu(val) {
      if (this.current !== val) {
        this.current = val;
        this.getRate();

        this.getTrade(100);
      }
    },
    changeCurrency(val) {
      if (this.coinType !== val.name) {
        this.coinType = val.name;
        this.getRate();
        this.getTrade(100);
      }
    },
    getRate() {
      return new Promise((resolve) => {
        const params = {
          coinType: this.coinType,
          currency: "CNY",
          advertiseType: this.current,
        };
        getRate(params)
          .then((res) => {
            if (res.code.toString() === "0") {
              this.rateData = res.data;
            }
            resolve();
          })
          .catch(() => {
            resolve();
          });
      });
    },
    // 获取限制额度
    getMemberLimitAmount() {
      getMemberLimitAmount().then((res) => {
        if (res.code.toString() === "0") {
          this.limit = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.post-content {
  height: 100%;
  flex-direction: column;
  background: #fff;
  .view-content {
    flex: 1;
    position: relative;
    width: 100%;
    margin-top: 6px;
    .post-content {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      overflow-y: scroll;
    }
  }
}
</style>
