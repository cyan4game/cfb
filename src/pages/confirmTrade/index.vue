<template>
  <view class="confirm-page">
    <view class="trade-info">
      <view class="flex-box-between mb-10">
        <text class="label">
          <!-- {{ type === "1" ? "挂单可购买数量" : "挂单可出售数量" }} -->
          {{ type === "1" ? "购买金额" : "出售金额" }}
        </text>
        <text class="value">
          {{ orderDetails.remainNumber }}/{{ orderDetails.coinUnit }}
        </text>
      </view>
      <!-- <view class="flex-box-between mb-10">
        <text class="label">单价</text>
        <text class="value">
          {{ orderDetails.price }}/{{ orderDetails.coinUnit }}
        </text>
      </view> -->
      <view class="flex-box-between mb-10">
        <text class="label">{{ type === "1" ? "购买限额" : "出售限额" }}</text>
        <text
          v-if="orderDetails.minNumber * 1 || orderDetails.maxNumber * 1"
          class="value"
        >
          {{ orderDetails.minNumber }} -
          {{ orderDetails.maxNumber }}
          {{ orderDetails.coinUnit }}
        </text>
        <text v-else class="value"> {{ orderDetails.remainAmount }} RMB</text>
      </view>
      <view class="flex-box-between mb-10">
        <text class="label">输入金额</text>
        <view class="number">
          <u-input
            :customStyle="{
              border: '1px solid #ccc',
              borderRadius: '6px',
              margin: '0 10px',
            }"
            type="digit"
            placeholder=""
            border="bottom"
            :disabled="type !== '1'"
            v-model="amount"
            @change="changeNumber"
          >
            <text
              slot="suffix"
              class="input-all"
              @click="
                amount =
                  Number(orderDetails.maxNumber) ||
                  Number(orderDetails.remainAmount) ||
                  ''
              "
              >全部</text
            >
          </u-input>
          <!--          <text class="value">{{ orderDetails.coinUnit }}</text>-->
          <text class="value">RMB</text>
        </view>
      </view>
      <!--      <view class="tips" v-show="+orderDetails.remainAmount < +amount">-->
      <!--        限购金额 {{ orderDetails.remainAmount }} RMB-->
      <!--      </view>-->
      <view
        v-if="+orderDetails.remainAmount < +amount && amount"
        style="text-align: right"
      >
        <text class="tips">{{
          type === "1" ? "请勿超出购买限额!" : "请勿超出出售限额!"
        }}</text>
      </view>
      <view
        class="tips"
        v-show="
          +orderDetails.minNumber > 0 &&
          orderDetails.minNumber * orderDetails.price > +amount
        "
      >
        最低金额 {{ Number(orderDetails.minNumber * orderDetails.price) }}
      </view>
      <view
        class="tips"
        v-show="
          +orderDetails.maxNumber > 0 &&
          orderDetails.maxNumber * orderDetails.price < +amount
        "
      >
        最高金额 {{ Number(orderDetails.maxNumber * orderDetails.price) }}
      </view>
      <!-- <view class="flex-box-between mb-10">
        <text class="label">{{ type === "1" ? "预计支付金额" : "预计收到金额" }}</text>
        <text class="value">￥{{ amount || "0.00" }}</text>
      </view> -->
      <!-- <view class="flex-box-between mb-10">
        <text class="label">数量</text>
        <text class="value">
          {{ orderDetails.number }}/{{ orderDetails.coinUnit }}
        </text>
      </view> -->
      <!-- <view class="flex-box-between">
        <text class="label">手续费</text>
        <text class="value"> ￥ {{ orderDetails.feeAmount }} </text>
      </view> -->
    </view>
    <view class="show-bank flex-box">
      <u-image
        width="24px"
        height="24px"
        src="/static/icons/bank.svg"
      ></u-image>
      <text class="b-text">选择{{ type === "1" ? "付款" : "收款" }}银行卡</text>
    </view>
    <!--    显示银行卡-->
    <view class="bank-view">
      <!--      未绑定-->
      <view v-if="!bankList.length" class="un-bind flex-box-between">
        <text class="label">未绑定银行卡</text>
        <view class="flex-box" @click="router('pages/addBank/index')">
          <text class="label">添加银行卡</text>
          <u-image
            width="24px"
            height="24px"
            src="/static/icons/right.svg"
          ></u-image>
        </view>
      </view>
      <!--      已绑定-->
      <view v-else class="flex-box-between bind-bank">
        <view>
          <view class="label">{{ bankInfo.realName }}</view>
          <view class="flex-box">
            <text class="label mr-5">{{ bankInfo.bankName }}</text>
            <text class="value">{{ bankInfo.accountName }}</text>
          </view>
        </view>
        <u-image
          v-if="bankList.length > 1"
          @click="show = true"
          width="24px"
          height="24px"
          src="/static/icons/arrow_down.svg"
        ></u-image>
      </view>
      <view class="show-confirm">
        <u-button
          @click="showTip = true"
          :disabled="isDisabled"
          class="login-button"
        >
          {{ type === "1" ? "购买" : "出售" }}
        </u-button>
      </view>
    </view>
    <u-popup :show="show">
      <bank-view
        :index.sync="index"
        :handleAreaCodeClose="handleAreaCodeClose"
        :bankList="bankList"
      ></bank-view>
    </u-popup>
    <custom-modal
      :confirm="handleConfirm"
      :title="type === '1' ? '购买' : '出售'"
      :message="`下单后请于15分钟内进行${
        type === '1' ? '付款' : '放币'
      }，否则订单将自动取消，单日累计${
        orderInfo.cancelOrderCount
      }笔取消将禁止交易${orderInfo.disabledHour}小时！`"
      :show.sync="showTip"
    >
      <template slot="append">
        <view class="total-cancel"
          >目前当日累计取消订单：{{ orderInfo.cancelCount }}</view
        >
      </template>
      <template slot="suffix">
        <view class="warning-tips">请务必使用实名认证的银行卡进行交易！</view>
      </template>
    </custom-modal>
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import bankView from "../post/component/bank-view";
import { getTradeDetails, sellNow, buyNow } from "../../api/api";
import customModal from "@/components/custom-modal/index.vue";

export default {
  name: "index",
  components: { bankView, customModal },
  data() {
    return {
      number: "",
      index: 0,
      show: false,
      advertiseNo: "",
      orderDetails: {},
      showTip: false,
      advertiseType: "",
      amount: "",
    };
  },
  onLoad(option) {
    const { advertiseNo, type, advertiseType } = option;
    uni.setNavigationBarTitle({
      title: type === "1" ? "购买" : "出售",
    });
    this.type = type;
    this.advertiseNo = advertiseNo;
    this.advertiseType = advertiseType;
    this.getDetails();
  },
  onPullDownRefresh() {
    this.getDetails();
    this.GET_BANK_LIST();
    this.GET_AUTO_ORDER_INFO();
  },
  onShow() {
    this.GET_AUTO_ORDER_INFO();
    if (!this.bankList.list) this.GET_BANK_LIST();
  },
  computed: {
    ...mapState("user", ["bankList"]),
    ...mapState("order", ["orderInfo"]),
    ...mapGetters("user", ["userInfo"]),
    bankInfo: {
      get() {
        return this.bankList[this.index] || {};
      },
    },
    isDisabled() {
      const { minNumber, maxNumber, remainAmount, price } = this.orderDetails;
      const { amount } = this;
      const min = (price * minNumber).toFixed(2);
      const max = (price * maxNumber).toFixed(2);
      const visible = !(
        this.bankInfo.hasOwnProperty("id") &&
        !!amount &&
        +amount <= +remainAmount &&
        +remainAmount >= min
      );
      if (max > 0) {
        return visible && max < +amount;
      } else {
        return visible;
      }
    },
  },
  methods: {
    ...mapActions("order", ["GET_AUTO_ORDER_INFO"]),
    ...mapActions("user", ["GET_BANK_LIST"]),
    handleAreaCodeClose() {
      this.show = false;
    },
    changeNumber() {},
    // 获取订单详情
    getDetails(advertiseNo) {
      getTradeDetails({
        advertiseNo: this.advertiseNo,
        advertiseType: this.advertiseType,
      })
        .then((res) => {
          if (res.code.toString() === "0") {
            this.orderDetails = res.data;

            this.amount =
              Number(this.orderDetails.maxNumber) ||
              Number(this.orderDetails.remainAmount) ||
              "";
            // this.number = +res.data.remainNumber - 0.01;
          }
          uni.stopPullDownRefresh();
        })
        .catch(() => {
          uni.stopPullDownRefresh();
          this.orderDetails = {};
        });
    },
    handleConfirm() {
      const platform = uni.getSystemInfoSync().platform;
      const orderDetails = this.orderDetails;
      const bankObj = this.bankInfo;
      const params = {
        advertiseNo: orderDetails.advertiseNo,
        amount: this.amount,
        memberId: this.userInfo.userInfo.id,
        payModelId: bankObj.id,
        number: this.amount / orderDetails.price,
        price: orderDetails.price,
        source: platform === "android" || platform === "ios" ? "APP" : "H5",
        entranceType: 0, // 交易提交入口类型（0:未知,1:充值入口,2:购买入口,3:提现入口,4:出售入口）
        orderType: "0",
      };
      this.type === "1" ? this.buy(params) : this.sell(params);
      this.showTip = false;
    },
    buy(params) {
      buyNow(params).then((res) => {
        if (res.code.toString() === "0") {
          this.router({
            url: "pages/tradeDetails/index",
            params: {
              id: res.data.orderNo,
            },
          });
        }
      });
    },
    sell(params) {
      sellNow(params).then((res) => {
        if (res.code.toString() === "0") {
          this.router({
            url: "pages/tradeDetails/index",
            params: {
              id: res.data.orderNo,
            },
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm-page {
  height: 100%;

  .tips {
    font-size: 10px;
    color: red;
    text-align: right;
  }

  .number {
    display: flex;
    align-items: center;
  }

  .trade-info {
    padding: 15px 20px;
    background: #fff;
  }

  .show-bank {
    padding: 10px 16px;
    background: #f8f8f8;

    .b-text {
      margin-left: 5px;
      color: #333333;
      font-size: 14px;
    }
  }

  .bank-view {
    background: #fff;

    .un-bind {
      padding: 20px;

      .un-label {
        font-size: 14px;
        color: #999999;
      }
    }

    .bind-bank {
      padding: 10px 20px;

      .bank-value {
        color: #999999;
        font-size: 14px;
        margin-left: 10px;
      }
    }
  }

  .show-confirm {
    padding: 30px 20px;
  }

  .login-button {
    background: #505bde;
    border-color: #505bde;
    margin: 0;
    box-sizing: border-box;
    color: #fff;
  }

  .u-button--disabled {
    background: #cccccc 0% 0% no-repeat padding-box;
    border: none;
    opacity: 1;
  }

  .total-cancel {
    margin-bottom: 16px;
    color: #505bde;
    font-size: 15px;
  }

  .warning-tips {
    font-size: 13px;
    color: #ef3c3c;
    margin: 16px 0 30px;
  }

  .input-all {
    font-size: 28rpx;
    color: #505bde;
  }
}
</style>
