<template>
  <view class="page">
    <view class="page-top">
      <view class="page-top-row">
        <text class="page-top-amount">{{ Number(model.payNumber) }}</text>
        <text class="page-top-currency">{{ model.coinName }}</text>
      </view>
      <text class="page-top-cny">≈ ¥{{ (Number(model.payNumber) / Number(model.rate)).toLocaleString("en-US") }}</text>
    </view>
    <view class="page-balance">
      <view class="page-balance-label">我的账户余额</view>
      <view class="page-balance-value">{{ balance }} {{ model.coinName }}</view>
    </view>
    <view class="page-order">
      <view class="page-order-row">
        <text class="page-order-label">收款方</text>
        <text class="page-order-value">{{ model.receiveName }}</text>
      </view>
      <view class="page-order-row">
        <text class="page-order-label">下单时间</text>
        <text class="page-order-value">{{ model.payTime }}</text>
      </view>
      <view class="page-order-row">
        <text class="page-order-label">订单号</text>
        <text class="page-order-value uni-flex-item">{{ model.scanCodeOrderNo }}</text>
        <u-icon size="40rpx" name="/static/icons/copy.svg" @click="$uni.setClipboardData({data: model.scanCodeOrderNo, showToast: true})"></u-icon>
      </view>
      <u-button class="page-order-btn" text="确认支付" color="#505bde" @click="showPassword = true"></u-button>
    </view>
    <u-modal :show="showPassword" title="支付密码" @confirm="onPay" showCancelButton @cancel="showPassword = false;password=''">
      <u-code-input dot focus v-model="password"></u-code-input>
    </u-modal>
  </view>
</template>

<script>
import {mapGetters, mapMutations} from "vuex"
import {getMemberAssets, scanCodePay, scanCodePayOrderQuery} from "@/api/api"

export default {
  data () {
    return {
      showPassword: false,
      password: "",
      model: {}
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo", "memberAssets"]),
    user () {
      return this.userInfo && this.userInfo.userInfo || {}
    },
    balance () {
      const data = this.memberAssets[`memberHome${this.model.coinName}BO`]
      return data && Number(data.availableQuantity) || 0
    }
  },
  watch: {
    model () {
      this.getBalance()
    }
  },
  onLoad (query) {
    if (query) this.model = query
  },
  onShow (options) {
    if (options) this.model = options
  },
  methods: {
    ...mapMutations("user", ["SAVE_MEMBER_ASSETS"]),
    onPay () {
      if (this.password && /^\d{6}$/.test(this.password)) {
        scanCodePay({
          payPassword: this.password,
          scanCodeOrderNo: this.model.scanCodeOrderNo
        }).then(res => {
          if (res.code.toString() === "0") {
            uni.navigateTo({
              url: "/pages/payment/success?" + Object.keys(res.data.model).map(key => `${key}=${res.data.model[key]}`).join('&')
            })
          } else if (!res.message.includes("支付密码")) {
            uni.navigateTo({
              url: `/pages/payment/error?error=${res.message}`
            })
          }
        })
      } else {
        uni.showToast({
          title: "请输入6位支付密码",
          icon: "none",
          position: "bottom",
          duration: 2000
        })
      }
    },
    getBalance () {
      getMemberAssets().then((res) => {
        if (res.code.toString() === "0") {
          this.SAVE_MEMBER_ASSETS(res.data)
        }
      })
    }
  }
}
</script>

<style lang="scss">
::v-deep .u-popup {
  flex: unset !important;
}

.page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  &-top {
    height: 176rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    &-row {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-amount {
      color: #ef3c3c;
      font-size: 48rpx;
      margin-right: 10rpx;
      font-weight: bold;
    }

    &-currency {
      color: #333333;
      font-size: 28rpx;

    }

    &-cny {
      color: #333333;
      font-size: 34rpx;
    }
  }

  &-balance {
    margin-top: 12rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx 40rpx;

    &-label {
      font-weight: bold;
      color: #333333;
      font-size: 28rpx;
    }

    &-value {
      color: #666666;
      font-size: 28rpx;
    }
  }

  &-order {
    margin-top: 12rpx;
    padding: 32rpx 40rpx;
    background-color: #ffffff;
    flex: 1;

    &-btn {
      margin-top: 60rpx;
    }

    &-row {
      margin-bottom: 20rpx;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-label {
      font-weight: bold;
      color: #333333;
      font-size: 28rpx;
    }

    &-value {
      color: #666666;
      font-size: 28rpx;
      text-align: right;
    }
  }
}
</style>
