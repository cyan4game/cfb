<template>
  <view
    class="order-edit flex-box-between"
    v-if="
      (Number(order.advertiseType) === 1 && Number(order.status) === 2) ||
      (Number(order.advertiseType) === 0 && Number(order.status) === 1)
    "
  >
    <!--    Number(order.advertiseType) === 0 && Number(order.status) === 2-->
    <u-button
      @click="showCancel = true"
      class="edit-button fle-box cancel-button"
      v-if="Number(order.advertiseType) === 0 && Number(order.status) === 1"
    >
      取消订单
    </u-button>
    <u-button
      class="edit-button fle-box appeal-button"
      @click="toAppeal"
      v-if="Number(order.advertiseType) === 1 && Number(order.status) === 2"
    >
      我要申诉
    </u-button>
    <u-button
      class="edit-button fle-box confirm-button"
      @click="showTip = true"
      v-if="Number(order.advertiseType) === 0 && Number(order.status) === 1"
      >确认付款
    </u-button>
    <u-button
      v-if="Number(order.advertiseType) === 1 && Number(order.status) === 2"
      @click="showTip = true"
      class="edit-button fle-box confirm-button"
    >
      确认放币
    </u-button>
    <custom-modal
      :confirm="handleConfirm"
      :title="
        Number(order.advertiseType) === 0
          ? '您是否确认已经付款？'
          : '您是否确认已收到买方付款？'
      "
      :confirmText="
        Number(order.advertiseType) === 0 ? '确认已付款' : '已收到付款'
      "
      message=""
      :show.sync="showTip"
    >
      <template slot="suffix">
        <view class="mb-20">
          <view
            class="warning-tips label"
            v-show="Number(order.advertiseType) === 0"
          >
            您若未付款, 产生纠纷, 信用将会受到影响！
          </view>
          <view class="flex-box-between">
            <text class="label">交易金额</text>
            <text class="value">￥{{ order.amount }}</text>
          </view>
          <view class="flex-box-between">
            <text class="label"
              >{{ Number(order.advertiseType) === 0 ? "收" : "付" }}款人</text
            >
            <text class="value">{{
              Number(order.advertiseType) === 0
                ? order.sellBankUserName
                : order.buyBankUserName
            }}</text>
          </view>
          <view class="flex-box-between">
            <text class="label"
              >{{ Number(order.advertiseType) === 0 ? "收" : "付" }}款银行</text
            >
            <text class="value">{{
              Number(order.advertiseType) === 0
                ? order.sellBankName
                : order.buyBankName
            }}</text>
          </view>
          <view class="flex-box-between">
            <text class="label"
              >{{
                Number(order.advertiseType) === 0 ? "收" : "付"
              }}款银行卡号</text
            >
            <text class="value">{{
              Number(order.advertiseType) === 0
                ? order.sellBankNo
                : order.buyBankCardNo
            }}</text>
          </view>
        </view>
      </template>
    </custom-modal>
    <!--    放币前的支付密码-->
    <custom-modal
      title="支付密码"
      :show.sync="showPassword"
      :isDisabled="isDisabled"
      :confirm="checkPassword"
      message=""
      confirmText="确认"
    >
      <template slot="suffix">
        <u-form :model="form" ref="form" :rules="rules">
          <u-form-item prop="txPwd">
            <view class="item">
              <password-input
                v-model="form.txPwd"
                border="border"
                placeholder="请输入支付密码"
              ></password-input>
            </view>
          </u-form-item>
        </u-form>
      </template>
    </custom-modal>
    <custom-modal
      :confirm="confirmCancel"
      title="取消订单"
      :show.sync="showCancel"
      :message="`是否确定要取消订单？若取消订单单日累计满${orderInfo.cancelOrderCount}次, 将禁止交易${orderInfo.disabledHour}时！`"
    ></custom-modal>

    <!--    上传组件-->
    <!--    <uploadSubmit :showUpload.sync="showUpload" :order="order"/>-->
    <u-notify ref="uNotify" message="Hi uView"></u-notify>
  </view>
</template>

<script>
import customModal from "@/components/custom-modal/index.vue";
import PasswordInput from "../../../components/password-input/password-input";
import {
  payConfirm,
  checkTxPassword,
  releaseCoins,
  orderCancel,
} from "../../../api/api";
import { mapActions, mapState } from "vuex";
// import uploadSubmit from "./upload-submit"
export default {
  name: "order-edit",
  components: { customModal, PasswordInput },
  props: {
    order: {
      type: Object,
      required: true,
    },
    getDetail: {
      type: Function,
    },
  },
  data() {
    return {
      showTip: false,
      showPassword: false,
      showCancel: false,
      showUpload: true,
      form: {
        txPwd: "",
      },
      loading: false,
      rules: {
        txPwd: [
          {
            required: true,
            pattern: /^[0-9]{6}$/g,
            transform(value) {
              return String(value);
            },
            message: "资金密码是6位数字",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    ...mapState("order", ["orderInfo"]),
    isDisabled() {
      const reg = /^[0-9]{6}$/g;
      return !reg.test(this.form.txPwd) || this.loading;
    },
  },
  created() {
    if (!this.orderInfo.otcQuota) this.GET_AUTO_ORDER_INFO(false);
  },
  methods: {
    ...mapActions("order", ["GET_AUTO_ORDER_INFO"]),
    handleConfirm() {
      if (!this.order) return;
      if (Number(this.order.advertiseType) === 0) {
        this.handlePay();
      } else {
        this.showTip = false;
        this.showPassword = true;
      }
    },
    handlePay() {
      console.log(this.order.needVoucher);

      payConfirm({ orderSn: this.order.orderSn })
        .then((res) => {
          if (res.code.toString() === "0") {
            const { needVoucher } = this.order;
            if (needVoucher === "1") {
              this.router({
                url: "pages/tradeDetails/upload",
                params: {
                  orderSn: this.order.orderSn,
                  coinUnit: this.order.coinUnit,
                },
              });
            } else {
              this.router({
                url: "pages/complete/index",
                params: {
                  type: "isBuy",
                  orderSn: this.order.orderSn,
                  coinUnit: this.order.coinUnit,
                },
              });
            }
          }
          this.showTip = false;
        })
        .catch(() => {
          this.showTip = false;
        });
    },
    // 校验交易密码
    async checkPassword() {
      const code = await this.check();
      this.showPassword = false;
      if (code === "0") this.release();
    },
    check() {
      this.loading = true;
      return new Promise((resolve) => {
        checkTxPassword({ txPwd: this.form.txPwd }).then((res) => {
          this.loading = false;
          resolve(res.code);
        });
      });
    },
    // 放币
    release() {
      releaseCoins({ orderSn: this.order.orderSn }).then((res) => {
        if (res.code.toString() === "0") {
          this.form.txPwd = "";
          this.router({
            url: "pages/complete/index",
            params: {
              type: "isSell",
              orderSn: this.order.orderSn,
            },
          });
        }
      });
    },
    // 确认取消
    confirmCancel() {
      const params = {
        orderSn: this.order.orderSn,
        // memberId: this.userInfo.userInfo.id,
      };
      orderCancel(params).then((res) => {
        if (res.code.toString() === "0") {
          // if (show) {
          this.$refs.uNotify.show({
            type: "success",
            message: "订单已取消",
          });
          // }
          this.getDetail();
        }
      });
      this.showCancel = false;
    },
    toAppeal() {
      this.router({
        url: "pages/appeal/index",
        params: {
          id: this.order.orderSn,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.order-edit {
  padding: 45px 20px 36px;
  background: #fff;

  .edit-button {
    width: 45%;
    height: 40px;
    font-size: 14px;
    justify-content: center;
    color: #666666;
    box-sizing: border-box;
  }

  .cancel-button {
    background: #dddddd;
  }

  .confirm-button {
    color: #fff;
    background: #505bde;
  }

  .appeal-button {
    border: 1px solid #505fd6;
    color: #505fd6;
  }

  .warning-tips {
    color: #ef3c3c;
    margin-bottom: 20px;
    font-size: 15px;
  }

  .item {
    width: 100%;
    border: 1px solid #dddddd;
    border-radius: 5px;
  }
}
</style>
