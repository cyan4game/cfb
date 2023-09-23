<template>
  <view class="user-balance" :class="[isDetails ? 'user-balance-details' : '']">
    <view class="view-top flex-box-between">
      <view class="flex-box" v-if="isDetails">
        <u-image
          :showLoading="true"
          src="/static/icons/wallet.svg"
          width="24px"
          height="24px"
        ></u-image>
        <text class="b-text">钱包资产</text>
      </view>
      <view class="flex-box" v-else>
        <text class="b-text-green">余额(CFB)</text>
      </view>

      <view
        class="flex-box"
        v-if="!isDetails"
        @click="router('pages/balanceDetails/index')"
      >
        <text class="b-text-blue">资产详情</text>
        <u-image
          :showLoading="true"
          src="/static/icons/right.svg"
          width="20px"
          height="20px"
        ></u-image>
      </view>
    </view>
    <view class="flex-box-between" v-if="isDetails">
      <view class="b-list" v-for="(item, index) in balanceList" :key="index">
        <view class="b-list-balance"
          >￥{{ (+memberAssets[item.key]).toFixed(2) || "0.00" }}
        </view>
        <view class="b-list-text">{{ item.label }}</view>
      </view>
    </view>
    <view class="cfb-balance" v-else>
      {{ memberAssets["memberHomeCNFBO"].availableAssets }}
    </view>

    <view class="view-bottom flex-box" v-if="!isDetails">
      <view class="flex-box">
        <u-image
          :showLoading="true"
          src="/static/icons/wallet.svg"
          width="20px"
          height="20px"
        ></u-image>
        <text class="b-text">钱包地址：</text>
      </view>
      <view class="flex-box">
        <text class="b-address">ABCDE*****FGHIJ</text>
        <u-image
          :showLoading="true"
          src="/static/icons/icon_copy.svg"
          width="20px"
          height="20px"
          @click="handleCopy('ABCDE*****FGHIJ')"
        ></u-image>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "user-balance",
  props: {
    isDetails: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      balanceList: [
        { label: "总资产", key: "totalAssets", value: "9999999" },
        { label: "可用资产", key: "availableAssets", value: "9999999" },
        { label: "冻结资产", key: "freezingAssets", value: "9999999" },
      ],
    };
  },
  computed: {
    ...mapState("user", ["memberAssets"]),
  },
  created() {
    console.warn(this.memberAssets);
  },
  methods: {
    handleCopy(value) {
      uni.setClipboardData({
        data: value,
        success: () => {},
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-balance {
  margin: 10px 10px 25px 10px;
  padding: 10px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 10px #0000003d;
  border-radius: 5px;

  .view-top {
    margin-bottom: 13px;

    .b-text {
      font-size: 14px;
      color: #666;
      margin-left: 5px;

      &-blue {
        font-size: 14px;
        color: #0277ff;
        margin-right: 5px;
      }
    }
    .b-text-green {
      font-size: 14px;
      color: #505bde;
    }
  }
}
.user-balance-details {
  margin: 0 10px;
}
.flex-box-between {
  align-items: flex-end;
  gap: 4rpx;
}

.b-list {
  text-align: center;
  width: 33.3333%;

  &-balance {
    font-size: 24rpx;
    color: #333333;
    margin-bottom: 4rpx;
    font-weight: bold;
    //word-break: break-all;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &-text {
    color: #999999;
    font-size: 12px;
  }
}
.cfb-balance {
  color: #333333;
  font-size: 24px;
  padding: 0 0 10px 0;
}
.view-bottom {
  font-size: 14px;
  border-top: 1px solid #eee;
  padding: 10px 0 5px 0;
  .b-text {
    color: #505bde;
  }
}
</style>
