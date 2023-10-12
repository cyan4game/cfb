<template>
  <view class="index-content">
    <view class="balance flex-box-between">
      <u-text color="#505bde" text="我的账户余额"></u-text>
      <u-text align="right" :text="balance * 1"></u-text>
    </view>
    <view class="form-view">
      <u-form class="form" :model="form" ref="form" :rules="rules">
        <!-- <u-form-item borderBottom prop="rate">
          <view class="item">
            <u-text
              color="#505bde"
              :text="`${current === '0' ? '购买' : '出售'}单价`"
            ></u-text>
            <u-input
              type="digit"
              @input="rateInput"
              :placeholder="`请输入${current === '0' ? '购买' : '出售'}单价`"
              v-model="form.rate"
            >
              <template slot="suffix">
                <text class="suffix-text"
                  >CNY (参考价：{{ rateData.rate }} CNY)</text
                >
              </template>
            </u-input>
          </view>
        </u-form-item> -->
        <u-form-item prop="amount" borderBottom>
          <view class="item">
            <u-text
              color="#505bde"
              :text="current === '0' ? '购买金额' : '出售金额'"
            ></u-text>
            <u-input
              type="number"
              @focus="focus('amount')"
              @input="changeValue('amount', 'number')"
              :placeholder="`限额 ￥1 ~ ${limit.singleAmount}`"
              v-model="form.amount"
            >
              <template slot="suffix">
                <text class="suffix-text">CNY</text>
              </template>
            </u-input>
          </view>
        </u-form-item>

        <!-- <u-form-item borderBottom prop="number">
          <view class="item">
            <u-text
              color="#505bde"
              :text="`${current === '0' ? '购买' : '出售'}数量`"
            ></u-text>
            <u-input
              type="number"
              @focus="focus('number')"
              @input="changeValue('number', 'amount')"
              :placeholder="
                cryptoRateDTO.isCapped
                  ? `限量${cryptoRateDTO.cryptoMin}-${cryptoRateDTO.cryptoMax}`
                  : ''
              "
              v-model="form.number"
            >
              <template slot="suffix">
                <text class="suffix-text">{{ coinType }}</text>
              </template>
            </u-input>
          </view>
        </u-form-item>
        <u-form-item borderBottom>
          <view class="item">
            <u-text
              color="#505bde"
              :text="`${current === '0' ? '卖方出售' : '买方购买'}限额`"
            ></u-text>
            <view class="flex-box-between">
              <view class="limt-input">
                <u-input
                  type="digit"
                  @focus="focus('number')"
                  v-model="form.minNumber"
                >
                  <template slot="suffix">
                    <text class="suffix-text">{{ coinType }}</text>
                  </template>
                </u-input>
              </view>

              <u-text class="line" align="center" text=" - "></u-text>

              <view class="limt-input">
                <u-input
                  type="digit"
                  @focus="focus('number')"
                  @input="changeValue('number', 'amount')"
                  v-model="form.maxNumber"
                >
                  <template slot="suffix">
                    <text class="suffix-text">{{ coinType }}</text>
                  </template>
                </u-input>
              </view>
            </view>
          </view>
        </u-form-item> -->
      </u-form>
      <!-- <view class="flex-box-between show-fee">
        <text class="bank-label">预计手续费</text>
        <text class="b-label">{{ payFee.num }} {{ coinType }}</text>
      </view> -->
      <!--      整单优惠抢购-->
      <view class="order-promo">
        <view class="flex-box-between">
          <view class="flex-box">
            <text class="bank-label">整单优惠抢购</text>
            <view class="promo-price">单价：￥0.00</view>
          </view>
          <view @click="getTradeList" class="flex-box">
            <text class="order-time">{{ countdown }}s</text>
            <u-image
              width="24px"
              height="24px"
              src="/static/icons/reload.svg"
            ></u-image>
          </view>
        </view>
        <view
          v-for="(item, index) in tradeList"
          :key="index"
          class="flex-box-between show-promo"
        >
          <text class="o-value"
            >{{ item.remainNumber }} {{ item.coinUnit }}</text
          >
          <text class="o-type" @click="toTrade(item)">{{
            current === "0" ? "购买" : "出售"
          }}</text>
        </view>
        <!-- <view class="flex-box-between show-amount">
        <text class="o-value">123456789.00/USDT</text>
        <text class="o-type">{{current==='1'?'购买':'出售'}}</text>
      </view> -->
      </view>
      <!-- <view class="flex-box-between show-fee">
        <text class="bank-label">{{ current==='0'? '预计获得数量' : '预计总支出' }}</text>
        <text class="b-label">{{totalIncome}} {{coinType}}</text>
      </view> -->
    </view>
    <!-- <view v-if="current==='0'" class="fast-modal show-bank">
      <u-text color="#505bde" text="快速交易模式"></u-text>
      <view style="margin: 6px 6px" class="flex-box-between">
        <u-text size="12" color="#333" text="120分钟内无人下单，开启快速交易模式"></u-text>
        <u-switch :size="18" activeValue="1" inactiveValue="0" v-model="form.fastMode" @change="changeFastMode"></u-switch>
      </view>
      <u-text style="margin: 6px 6px" color="red" size="12" :text="`溫馨提醒：快速交易模式，需要额外支付单笔交易金额**%，外加每笔**USDT的手续费`"></u-text>
    </view> -->
    <view class="show-bank flex-box">
      <u-image
        width="24px"
        height="24px"
        src="/static/icons/bank.svg"
      ></u-image>
      <text class="b-text">银行卡</text>
    </view>
    <!--    显示银行卡-->
    <view class="bank-view">
      <!--      未绑定-->
      <view class="un-bind flex-box-between" v-if="!bankList.length">
        <text class="un-label">未绑定银行卡</text>
        <view class="flex-box" @click="router('pages/addBank/index')">
          <text class="b-label">添加银行卡</text>
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
          <view class="bank-label">{{ bankInfo.idName }}</view>
          <view class="flex-box">
            <text class="bank-label">{{ bankInfo.bankName }}</text>
            <text class="bank-value">{{ bankInfo.accountName }}</text>
          </view>
        </view>
        <u-image
          @click="show = true"
          width="24px"
          height="24px"
          src="/static/icons/arrow_down.svg"
        ></u-image>
      </view>
    </view>
    <!-- 
    <view class="select-post flex-box">
      <u-image
        width="24px"
        height="24px"
        src="/static/icons/add_post.svg"
      ></u-image>
      <text class="bank-label add-post">挂单可选项</text>
    </view> -->
    <view class="view-submit">
      <!-- <u-checkbox-group
        v-model="checkboxValue"
        placement="column"
        @change="checkboxChange"
      >
        <u-checkbox
          shape="circle"
          :customStyle="{ marginBottom: '8px' }"
          label="卖方至少完成高级认证"
          name="userAuthVerify"
        >
        </u-checkbox>
        <u-checkbox
          v-if="current !== '0'"
          shape="circle"
          :customStyle="{ marginBottom: '8px' }"
          label="买方被申诉率低于1%"
          name="userAppealVerify"
        >
        </u-checkbox>
      </u-checkbox-group> -->
      <u-button
        :disabled="isDisabled"
        class="login-button"
        @click="submitPost"
        type="primary"
        text="发布"
      ></u-button>
    </view>
    <u-popup :show="show">
      <bank-view
        :index.sync="index"
        :handleAreaCodeClose="handleAreaCodeClose"
        :bankList="bankList"
      ></bank-view>
    </u-popup>
    <custom-modal
      :show.sync="showConfirmModal"
      confirmText="确定发布"
      :message="``"
      :title="`确认发布${current === '0' ? '购买' : '出售'}交易?`"
      :confirm="postOrder"
    >
      <view class="post-info" slot="suffix">
        <view class="post-info-row">
          <text class="post-info-row-label"
            >{{ current === "0" ? "购买" : "出售" }}金额</text
          >
          <text class="post-info-row-value">￥ {{ form.amount }}</text>
        </view>
        <view class="post-info-row">
          <text class="post-info-row-label"
            >{{ current === "0" ? "购买" : "出售" }}数量</text
          >
          <text class="post-info-row-value">{{ form.number + coinType }}</text>
        </view>
        <view class="post-info-row">
          <text class="post-info-row-label">单价</text>
          <text class="post-info-row-value"
            >￥ {{ form.rate }}/{{ coinType }}</text
          >
        </view>
        <view class="post-info-row">
          <text class="post-info-row-label">预计手续费</text>
          <text class="post-info-row-value"
            >￥ {{ payFee.num }}/{{ coinType }}</text
          >
        </view>
      </view>
    </custom-modal>
  </view>
</template>

<script>
import { mapState } from "vuex";
import bankView from "./bank-view";
import check from "./check";
import { beforeBuyCheck, createTrade } from "../../../api/api";
import customModal from "@/components/custom-modal/index.vue";

export default {
  name: "post-form",
  components: { bankView, customModal },
  mixins: [check],
  props: {
    tradeList: {
      type: Array,
    },
    coinType: {
      type: String,
    },
    current: {
      // 0 购买 1 出售
      type: [Number, String],
    },
    rateData: {
      // 汇率的数据
      type: Object,
      required: true,
      default: {},
    },
    limit: {
      // 金额输入的限制
      type: Object,
      required: true,
      default: {},
    },
  },
  data() {
    return {
      countdown: 5,
      checkboxValue: [],
      show: false,
      type: "",
      balance: "",
      cryptoRateDTO: "",
      form: {
        rate: "",
        amount: "",
        number: "",
        userAuthVerify: "0",
        fastMode: "0",
        userAppealVerify: "0",
        minNumber: "",
        maxNumber: "",
      },
      timer: null,
      extra: [],
      checkboxList: [
        // {
        //   name: '卖方账户币不少于挂单数量的1.5倍',
        //   disabled: false
        // },
        {
          name: "卖方至少完成标准认证",
          disabled: false,
        },
      ],
      index: 0,
      loading: false,
      showConfirmModal: false,
    };
  },
  mounted() {
    this.interVal();
  },
  watch: {
    rateData: {
      handler(val) {
        console.log(val);
        this.balance = val.balance;
        this.cryptoRateDTO = val.cryptoRateDTO;
        this.form.rate = val.rate;
        this.form.amount = "";
        this.form.number = "";
      },
      deep: true,
    },
  },
  beforeDestroy() {
    this.closeTimer();
  },
  computed: {
    ...mapState("user", ["bankList"]),

    bankInfo: {
      get() {
        return this.bankList[this.index] || {};
      },
    },
    totalIncome() {
      // console.log(typeof this.current, this.current);
      const current = this.current;
      const { num } = this.payFee;
      let count = 0; //购买 预计购买数量 - 手续费 出售 预计出售+手续费
      // 预计数量
      const transCount = (
        this.form.amount / (this.form.rate || this.rateData.rate || 0)
      ).toFixed(this.returnDigit(this.coinType));
      if (current === "0") {
        count = transCount - num;
      } else {
        count = +transCount + num * 1;
      }
      const number = count.toFixed(this.returnDigit(this.coinType));
      return number >= 0 ? number : "0.00";
    },
    payFee() {
      let rate = 0;
      const amount = this.form.amount || "0";

      const rateData = this.rateData;
      // const num=(rate / rateData.rate).toFixed(this.returnDigit(this.type))
      if (rateData.cryptoRateDTO) {
        const dto = rateData.cryptoRateDTO;
        // 是否是免手续费
        if (dto.isfree) {
          rate = "0.00";
        } else {
          // 币种数量
          const coinNum = (amount / rateData.rate).toFixed(
            this.returnDigit(this.coinType)
          );
          // 是否是封顶 true 不封顶
          if (dto.isCapped) {
            const { cryptoMax, cryptoMin } = dto;
            // const currentCoin=coinNum* (dto.cryptoRate / 100)
            // 封顶
            let coin = coinNum * (dto.cryptoRate / 100);
            if (coin >= +cryptoMax) {
              rate = cryptoMax;
            } else if (coin <= cryptoMin) {
              rate = cryptoMin;
            } else {
              rate = coin;
            }
          } else {
            rate = coinNum * (dto.cryptoRate / 100);
          }
        }
      }
      return {
        fee: (rate * rateData.rate).toFixed(2),
        num: (rate * 1).toFixed(this.returnDigit(this.coinType)),
      };
    },
  },
  methods: {
    changeFastMode() {},
    closeTimer() {
      if (this.timer) clearInterval(this.timer);
    },
    interVal() {
      if (this.timer) {
        clearInterval(this.timer);
      } else {
        this.timer = setInterval(() => {
          this.countdown = this.countdown - 1;
          if (this.countdown === -1) {
            this.countdown = 5;
            this.getTradeList();
          }
        }, 1000);
      }
    },
    getTradeList(type) {
      if (type) {
        this.countdown = 5;
      }
      this.$emit("getTradeList");
    },
    checkboxChange(val) {
      console.log(val);
      (this.form.userAuthVerify = "0"),
        (this.form.userAppealVerify = "0"),
        val.map((e) => {
          this.form[e] = "1";
        });
    },
    handleAreaCodeClose() {
      this.show = false;
    },
    submitPost() {
      this.showConfirmModal = true;
    },
    postOrder() {
      const bankObj = this.bankInfo;
      const rate = this.form.rate || this.rateData.rate;
      const platform = uni.getSystemInfoSync().platform;
      const params = {
        advertiseType: this.current, // 交易类型 出售 1 购买0
        amount: this.form.amount, // 交易金额
        coinUnit: this.coinType, // 币种名称
        entranceType: 0, // 交易提交入口类型（0:未知,1:充值入口,2:购买入口,3:提现入口,4:出售入口）
        feeRate: rate, // 费率
        payModelId: bankObj.id,
        country: "cn",
        number: this.form.number,
        payMode: 0, //交易支付类型 默认0：银行卡支付
        price: rate,
        priceType: 0,
        sellFee: this.payFee.fee,
        source: platform === "android" || platform === "ios" ? "APP" : "H5",
        userAuthVerify: this.form.userAuthVerify,
        fastMode: this.form.fastMode,
        userAppealVerify: this.form.userAppealVerify,
        minNumber: this.form.minNumber,
        maxNumber: this.form.maxNumber,
      };
      this.loading = true;
      createTrade(params).then((res) => {
        if (res.code.toString() === "0") {
          this.router({
            url: "pages/complete/index",
            params: {
              type: "isPost",
            },
          });
        }
        this.loading = false;
      });
      this.showConfirmModal = false;
    },
    //
    focus(type) {
      this.type = type;
      // console.log(type);
    },
    // 根据币种返回小数点
    returnDigit(type) {
      console.log(type);
      const currencyFixed = [
        { name: "USDT", fixed: 2 },
        { name: "ETH", fixed: 6 },
        { name: "TRX", fixed: 6 },
        { name: "BTC", fixed: 8 },
      ];
      let digit = 2;
      try {
        digit = currencyFixed.find((item) => item.name === type).fixed;
      } catch (e) {
        digit = 2;
      }
      return digit;
    },
    changeValue(name, type) {
      if (name === "amount") {
        this.$emit("changeAmount", this.form.amount);
      }
      if (this.type === name) {
        if (!this.form[name]) this.form[type] = "";
        if (name === "number") {
          if (this.form[name]) {
            this.form[type] =
              (this.form[name] * this.form.rate).toFixed(2) || "";
          }
        } else {
          if (this.form[name]) {
            this.form[type] = (this.form[name] / this.form.rate).toFixed(
              this.returnDigit(this.coinType)
            );
          }
        }
      }
    },
    rateInput(value) {
      if (value) {
        if (this.form.number) {
          this.form.amount = (this.form["number"] * value).toFixed(2);
        } else {
          if (this.form.amount) {
            this.form.number = (this.form["amount"] / value).toFixed(
              this.returnDigit(this.coinType) || ""
            );
          }
        }
      }
    },
    // 快捷交易
    toTrade(item) {
      if (this.current === "0") {
        this.buy(item);
      } else {
        this.sell(item);
      }
    },
    // 出售逻辑
    async sell(item) {
      // console.log(item.advertiseNo);
      const { code, data } = await this.checkSell(item);
      item.loading = false;
      if (code === "0") {
        this.router({
          url: "pages/confirmTrade/index",
          params: {
            type: 0,
            advertiseNo: item.advertiseNo,
            advertiseType: item.advertiseType,
          },
        });
      }
    },
    // 购买逻辑
    async buy(item) {
      const { code, data } = await this.check(item);
      item.loading = false;
      if (code === "0") {
        this.router({
          url: "pages/confirmTrade/index",
          params: {
            type: 1,
            advertiseNo: item.advertiseNo,
            advertiseType: item.advertiseType,
          },
        });
      }
    },
    // 购买 跳转之前进行校验
    check(item) {
      const params = {
        advertiseNo: item.advertiseNo,
        number: item.number * 0.3,
        amount: item.number * 0.3 * item.price,
      };
      return new Promise((resolve, reject) => {
        beforeBuyCheck(params)
          .then((res) => {
            resolve(res);
          })
          .catch(() => {
            reject();
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style.scss";

.balance {
  padding: 6px 20px 0 20px;
  background-color: #fff;
}

.line {
  flex: 1;
}

.limt-input {
  flex: 4;
}

.fast-modal {
  background-color: #fff !important;
}

.post-info {
  margin: 10px 10px 20px 10px;

  &-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20rpx 0;

    &-label {
      font-size: 28rpx;
      color: #333333;
      font-weight: bold;
    }

    &-value {
      flex: 1;
      text-align: right;
      font-size: 28rpx;
      color: #333333;
    }
  }
}
</style>
