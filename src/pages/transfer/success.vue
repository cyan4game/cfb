<template>
  <view class="page-success" v-if="detail">
    <view class="page-success-top">
      <u-icon size="120rpx" name="/static/icons/icon-transfer-success.svg"></u-icon>
      <text class="page-success-top-info">转账申请成功</text>
      <view class="page-success-top-value">
        <text class="page-success-top-amount">-{{ Number(detail.applyOrderNumber) }}</text>
        <text class="page-success-top-currency">{{ detail.orderCoinStr && detail.orderCoinStr.split(/[\-_]/g)[0] || "" }}</text>
      </view>
    </view>
    <view class="page-success-steps">
      <view class="page-success-steps-item">
        <view class="page-success-steps-item-line"></view>
        <u-icon class="page-success-steps-item-icon" size="40rpx" name="/static/icons/icon-step-active.svg"></u-icon>
        <text class="page-success-steps-item-label">转账申请已提交</text>
        <text class="page-success-steps-item-value">2022-12-12 12:12:12</text>
      </view>
      <view class="page-success-steps-item">
        <view class="page-success-steps-item-line"></view>
        <u-icon class="page-success-steps-item-icon" size="40rpx" name="/static/icons/icon-step-active.svg"></u-icon>
        <text class="page-success-steps-item-label">系统处理中</text>
        <text class="page-success-steps-item-value">预计15分钟到账</text>
      </view>
      <view class="page-success-steps-item" v-if="detail.orderStatus === 'PENDING'">
        <u-icon class="page-success-steps-item-icon" size="40rpx" name="/static/icons/icon-step-null.svg"></u-icon>
        <text class="page-success-steps-item-label page-success-steps-item-label-none">转账成功</text>
        <text class="page-success-steps-item-value"></text>
      </view>
      <view class="page-success-steps-item" v-else-if="detail.orderStatus === 'DONE'">
        <u-icon class="page-success-steps-item-icon" size="40rpx" name="/static/icons/icon-step-active.svg"></u-icon>
        <text class="page-success-steps-item-label">转账成功</text>
        <text class="page-success-steps-item-value"></text>
      </view>
      <view class="page-success-steps-item" v-else>
        <u-icon class="page-success-steps-item-icon" size="40rpx" name="/static/icons/icon-step-fail.svg"></u-icon>
        <text class="page-success-steps-item-label page-success-steps-item-label-fail">转账失败</text>
        <text class="page-success-steps-item-value"></text>
      </view>
    </view>
    <view class="page-success-info">
      <view class="page-success-info-item">
        <view class="page-success-info-item-label">订单号</view>
        <view class="page-success-info-item-value uni-flex-item">{{ detail.orderNo }}</view>
        <u-icon size="40rpx" name="/static/icons/copy.svg" @click="$uni.setClipboardData({data: detail.orderNo, showToast: true})"></u-icon>
      </view>
      <view class="page-success-info-item">
        <view class="page-success-info-item-label">转账时间</view>
        <view class="page-success-info-item-value">{{ detail.transferTime }}</view>
      </view>
      <view class="page-success-info-item">
        <view class="page-success-info-item-label">转账币种</view>
        <view class="page-success-info-item-value">{{ detail.orderCoinStr || "" }}</view>
      </view>
      <view class="page-success-info-item">
        <view class="page-success-info-item-label">转账数量</view>
        <view class="page-success-info-item-value">{{ detail.applyOrderNumber }}</view>
      </view>
      <view class="page-success-info-item">
        <view class="page-success-info-item-label">转账地址</view>
        <view class="page-success-info-item-value">{{ detail.receiveAddress }}</view>
      </view>
      <view class="page-success-info-item">
        <view class="page-success-info-item-label">手续费</view>
        <view class="page-success-info-item-value">{{ Number(detail.totalFee) || '' }}</view>
      </view>
      <u-button class="btn-to-home" @click="toHome" type="primary" color="#505bde">返回首页</u-button>
      <view class="btn-to-record" @click="toRecord">
        <text class="btn-to-record-text">查看转账记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import {getTransferOrderDetail} from "@/api/api"

export default {
  name: "success",
  data () {
    return {
      detail: null
    }
  },
  onShow () {
    uni.hideHomeButton && uni.hideHomeButton()
  },
  onLoad (query) {
    if (query.orderNo) {
      uni.showLoading({
        title: "获取数据中...",
        mask: true
      })
      getTransferOrderDetail({
        transferOrderNo: query.orderNo
      }).then(res => {
        uni.hideLoading()
        if (res.code.toString() === "0") {
          this.detail = res.data
        }
      }).catch(_ => {
        console.error(_)
        uni.hideLoading()
      })
    } else {
      this.toHome()
    }
  },
  methods: {
    toHome () {
      uni.reLaunch({
        url: "/pages/index/index"
      })
    },
    toRecord () {
      uni.navigateTo({
        url: "/pages/transfer/record"
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-success {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  &-top {
    background-color: #ffffff;
    height: 360rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding-top: 32rpx;
    box-sizing: border-box;

    &-info {
      color: #63B72E;
      font-size: 34rpx;
      font-weight: 700;
      margin: 30rpx 0;
    }

    &-value {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10rpx;
    }

    &-amount {
      color: #EF3C3C;
      font-size: 48rpx;
      font-weight: 700;
    }

    &-currency {
      color: #333333;
      font-size: 34rpx;
    }
  }

  &-steps {
    margin-top: 12rpx;
    height: 280rpx;
    background-color: #ffffff;
    padding: 40rpx;
    box-sizing: border-box;

    &-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      height: 40rpx;
      margin-bottom: 40rpx;
      position: relative;

      &-label {
        color: #63B72E;
        font-size: 28rpx;
        flex: 1;
        padding-left: 20rpx;
        font-weight: bold;

        &-none {
          color: #666666;
        }

        &-fail {
          color: #EF3C3C;
        }
      }

      &-value {
        font-size: 28rpx;
        color: #666666;
      }

      &-line {
        position: absolute;
        left: 18rpx;
        top: 20rpx;
        height: 80rpx;
        width: 4rpx;
        background-color: #dddddd;
      }

      &-icon {
        position: relative;
      }
    }
  }

  &-info {
    margin-top: 12rpx;
    flex: 1;
    background-color: #ffffff;
    padding: 32rpx 40rpx 0;

    &-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      min-height: 20rpx;
      margin-bottom: 20rpx;

      &-label {
        font-size: 28rpx;
        color: #333333;
        font-weight: bold;
        padding-right: 40rpx;
      }

      &-value {
        flex: 1;
        font-size: 28rpx;
        color: #666666;
        text-align: right;
        word-break: break-all;
      }
    }

    .btn-to-home {
      margin-top: 20rpx;
    }

    .btn-to-record {
      text-align: center;
      width: 100%;
      margin-top: 20rpx;

      &-text {
        color: #0277ff;
        font-size: 28rpx;
        font-weight: bold;
      }
    }
  }
}
</style>
