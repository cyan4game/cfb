<template>
  <view class="balance-details">
    <view class="balance-bg">
      <user-balance isDetails></user-balance>
    </view>
    <view class="show-more">
      <table cellspacing="0">
        <thead>
          <tr>
            <th>币种</th>
            <th>可用数量/金额</th>
            <th>冻结数量/金额</th>
            <th>总数量/金额</th>
          </tr>
        </thead>
        <tbody v-if="memberAssets.hasOwnProperty('freezingAssets')">
          <tr
            v-for="(item, index) in amountList.filter(
              (v) => memberAssets[v.value]
            )"
            :key="index"
          >
            <td class="uni-flex">
              <u-image
                v-if="item.icon"
                mode="aspectFit"
                :src="item.icon"
                width="48rpx"
                height="48rpx"
              ></u-image>
              <text class="coin-name uni-flex-item">{{ item.label }}</text>
            </td>
            <td>
              <view>
                <text class="coin-num">
                  {{ checkNumber(memberAssets[item.value].availableQuantity) }}
                </text>
              </view>
              <view>
                <text class="coin-cny">
                  ￥{{ checkNumber(memberAssets[item.value].availableAssets) }}
                </text>
              </view>
            </td>
            <td>
              <view>
                <text class="coin-num">
                  {{ checkNumber(memberAssets[item.value].freezingQuantity) }}
                </text>
              </view>
              <view>
                <text class="coin-cny">
                  ￥{{ checkNumber(memberAssets[item.value].freezingAssets) }}
                </text>
              </view>
            </td>
            <td>
              <view>
                <text class="coin-num">
                  {{ checkNumber(memberAssets[item.value].totalQuantity) }}
                </text>
              </view>
              <view>
                <text class="coin-cny">
                  ￥{{ checkNumber(memberAssets[item.value].totalAssets) }}
                </text>
              </view>
            </td>
          </tr>
        </tbody>
      </table>
    </view>
  </view>
</template>

<script>
import userBalance from "@/pages/index/components/user-balance";
import { mapActions, mapState } from "vuex";
import storage from "../../utils/storage";

export default {
  name: "index",
  components: { userBalance },
  computed: {
    ...mapState("user", ["memberAssets"]),
  },
  data() {
    return {
      amountList: [
        {
          label: "CFB",
          icon: "",
          value: "memberHomeCNFBO",
        },
        // {
        //   label: "USDT",
        //   icon: require("@/static/icons/icon-currency-USDT.svg"),
        //   value: "memberHomeUSDTBO",
        // },
        // {
        //   label: "USDC",
        //   icon: require("@/static/icons/icon-currency-USDC.svg"),
        //   value: "memberHomeUSDCBO",
        // },
        // {
        //   label: "BUSD",
        //   icon: require("@/static/icons/icon-currency-BUSD.svg"),
        //   value: "memberHomeBUSDBO",
        // },
        // {
        //   label: "BTC",
        //   icon: require("@/static/icons/icon-currency-BTC.svg"),
        //   value: "memberHomeBTCBO",
        // },
        // {
        //   label: "ETH",
        //   icon: require("@/static/icons/icon-currency-ETH.svg"),
        //   value: "memberHomeETHBO",
        // },
        // {
        //   label: "TRX",
        //   icon: require("@/static/icons/icon-currency-TRX.svg"),
        //   value: "memberHomeTRXBO",
        // },
        // {
        //   label: "BNB",
        //   icon: require("@/static/icons/icon-currency-BNB.svg"),
        //   value: "memberHomeBNBBO",
        // },
      ],
    };
  },
  async onPullDownRefresh() {
    await this.GET_MEMBER_ASSETS();
    uni.stopPullDownRefresh();
  },
  methods: {
    ...mapActions("user", ["GET_MEMBER_ASSETS"]),
    checkNumber(str) {
      // return str
      return parseFloat(str);
    },
  },
};
</script>

<style lang="scss" scoped>
.uni-flex {
  align-items: center;
  padding-left: 16rpx !important;
}

.balance-details {
  height: 100%;

  .balance-bg {
    height: 52px;
    background: #505bde;
    position: relative;
    padding-top: 10px;
  }

  .show-more {
    padding-top: 50px;

    table {
      width: 100%;
      text-align: center;
      border-collapse: collapse;

      thead {
        th {
          padding: 10px 0;
          font-size: 12px;
          color: #666666;
        }
      }

      tbody {
        tr {
          background: #fff;
          margin-top: 10px;
          border-bottom: 12rpx solid #f8f8f8;

          td {
            padding: 0 10rpx;
            height: 154rpx;
            box-sizing: border-box;
            border: none;
            text-align: center;
            justify-content: center;
            line-height: 1;
          }

          .coin-name {
            font-size: 14px;
            color: #505bde;
            margin-left: 10rpx;
          }

          .coin-num {
            color: #333;
            font-size: 14px;
            word-break: break-all;
          }

          .coin-cny {
            font-size: 12px;
            color: #999999;
            word-break: break-all;
          }
        }
      }
    }
  }
}
</style>
