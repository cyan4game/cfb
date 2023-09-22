<template>
  <view class="view-order">
    <view class="full-content">
      <u-list height="100%" @scrolltolower="scrolltolower">
        <u-list-item v-for="(item, index) in tradeList" :key="index">
          <view class="order-item">
            <view class="order-name flex-box">
              <view class="user-name flex-box">
                {{ item.userName.charAt(0) }}
              </view>
              <view class="all-name">{{ item.userName }}</view>
              <view class="user-status flex-box">离线</view>
            </view>
            <view class="order-info flex-box-between">
              <view class="order-amount">
                <view class="flex-box">
                  <text class="o-label">金额</text>
                  <text class="o-value">￥{{ item.amount }}</text>
                </view>
                <view class="show-quality">
                  {{
                    item.otcStatisticsVo
                      ? item.otcStatisticsVo.finishOtcAdvertiseNum
                      : 0
                  }}
                  单｜ 完成
                  {{
                    item.otcStatisticsVo
                      ? (item.otcStatisticsVo.finishRate * 100).toFixed(2)
                      : 0
                  }}%
                </view>
              </view>
              <view>
                <view class="user-auth flex-box">
                  <u-image
                    width="20px"
                    height="20px"
                    src="/static/icons/diamond.svg"
                  ></u-image>
                  <text>已认证</text>
                </view>
                <view
                  :class="{ 'is-disabled': item.loading }"
                  class="to-submit"
                  @click="handleTrade(item)"
                >
                  {{
                    Number(item.advertiseType) === 1 ? "立即购买" : "立即出售"
                  }}
                </view>
              </view>
            </view>
          </view>
        </u-list-item>
        <u-loadmore v-show="tradeList.length > 10" :status="status" />
      </u-list>
    </view>

    <custom-modal
      :show.sync="tipsShow"
      :title="info.title"
      :message="info.message"
      :confirmText="info.confirmText"
      :showCancelButton="info.showCancelButton"
      :confirm="info.confirm"
    />
    <custom-modal
      :show.sync="realShow"
      title="您尚未完成身份认证。"
      message="请先去完成身份认证，再发布挂单"
      confirmText="前往身份认证"
      :showCancelButton="false"
      :confirm="realConfirm"
    />
    <custom-modal
      :show.sync="matchShow"
      title="匹配失败"
      message="抱歉，您手速慢了点，此订单已匹配给其他用户，建议您选择其他订单。"
      confirmText="确认"
      :showCancelButton="false"
      :confirm="matchConfirm"
    />
  </view>
</template>

<script>
import customModal from "@/components/custom-modal/index.vue";
import { mapState } from "vuex";
import {
  beforeBuyCheck,
  queryAdvertiseList,
  beforeSellCheck,
} from "../../../api/api";

export default {
  name: "order-list",
  components: { customModal },
  props: {
    current: {
      type: String,
    },
    tradeList: {
      type: Array,
    },
    getTrade: {
      type: Function,
    },
    page: {
      type: Number,
    },
    pages: {
      type: Number,
    },
    loadMore: {
      type: Boolean,
    },
  },
  data() {
    return {
      realShow: false,
      matchShow: false,
      status: "loadmore",
      show: false,
      info: {
        title: "当前未绑定银行卡",
        showCancelButton: false,
        message: "当前未绑定银行卡无法完成交易,请前往绑定银行卡",
        confirmText: "前往绑定",
        confirm: this.tipsConfirm,
      },
      tipsShow: false,
      tradeInfo: {},
    };
  },
  computed: {
    ...mapState("order", ["orderInfo"]),
    ...mapState("user", ["bankList", "userInfo"]),
  },
  methods: {
    async scrolltolower() {
      if (this.page > this.pages) {
        this.status = "nomore";
      } else {
        this.$emit("update:loadMore", true);
        const addPage = this.page + 1;
        this.$emit("update:page", this.page + 1);
        this.status = "loading";
        await this.getTrade();
        if (this.page > this.pages) {
          this.status = "nomore";
        } else {
          this.status = "loadmore";
        }
      }
    },
    handleConfirm() {
      this.router({
        url: "pages/tradeDetails/index",
        params: {
          id: this.tradeInfo.tradeId,
        },
      });
      this.show = false;
      // this.tipsShow = true;
    },
    // 购买 或者交易
    handleTrade(item) {
      if (!item.id) {
        queryAdvertiseList({
          advertiseType: this.current,
          amount: item.amount,
          coinUnit: item.coinUnit,
        }).then((res) => {
          if (res.code == 0) {
            if (res.data) {
            } else {
              this.matchShow = true;
            }
          }
        });
      } else {
        this.tradeInfo = item;
        if (this.userInfo.userInfo.realNameStatus !== "1") {
          this.realShow = true;
        }
        if (!this.bankList.length) {
          this.tipsShow = true;
        } else {
          item.loading = true;
          if (this.current === "1") {
            this.buy(item);
          } else {
            this.sell(item);
          }
          // this.show = true;
        }
      }
    },
    realConfirm() {
      this.realShow = false;
      this.router("pages/authentication/index");
    },
    matchConfirm() {
      this.matchShow = false;
    },
    tipsConfirm() {
      this.tipsShow = false;
      this.router("pages/addBank/index");
      // console.log(99999);
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
          .catch((_) => {
            reject(_);
          });
      });
    },
    // 出售 跳转之前的校验
    checkSell(item) {
      const params = {
        advertiseNo: item.advertiseNo,
        number: item.number * 0.3,
        amount: item.number * 0.3 * item.price,
      };
      return new Promise((resolve, reject) => {
        beforeSellCheck(params)
          .then((res) => {
            resolve(res);
          })
          .catch((_) => {
            reject(_);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.view-order {
  flex: 1;
  position: relative;

  .full-content {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: scroll;
  }

  .order-item {
    padding: 10px;
    background: #fff;
    position: relative;
    margin-bottom: 5px;
    border-radius: 5px;

    .user-name {
      width: 30px;
      height: 30px;
      line-height: 30px;
      border-radius: 50%;
      color: #fff;
      font-size: 16px;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      background: #0277ff;
    }

    .all-name {
      font-size: 14px;
      color: #333333;
      margin-right: 6px;
    }

    .user-status {
      width: 36px;
      height: 20px;
      justify-content: center;
      font-size: 12px;
      color: #333333;
      background: #dddddd;
      border-radius: 5px;
    }

    .order-info {
      margin-top: 6px;

      .user-auth {
        padding: 0 3px;
        border: 1px solid #63b72e;
        border-radius: 5px;
        color: #63b72e;
        font-size: 12px;
        margin-bottom: 8px;
        position: absolute;
        right: 10px;
        top: 12px;
      }

      .to-submit {
        padding: 10px 22px;
        background: #0277ff 0% 0% no-repeat padding-box;
        border-radius: 5px;
        color: #fff;
        font-size: 14px;
        text-align: center;
      }

      .is-disabled {
        background: #cccccc 0% 0% no-repeat padding-box;
        border: none;
        opacity: 1;
        cursor: not-allowed;
      }

      .order-amount {
        padding-left: 40px;

        .o-label {
          color: #333333;
          font-size: 16px;
          font-weight: 600;
          margin-right: 10px;
        }

        .o-value {
          color: #333333;
          font-weight: 600;
          font-size: 16px;
        }

        .show-quality {
          color: #666666;
          font-size: 14px;
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
