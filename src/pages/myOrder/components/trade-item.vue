<template>
  <view class="trade-item" @click="pageTo">
    <view class="flex-box-between">
      <text class="t-label">
        {{ Number(item.advertiseType) === 0 ? "购买" : "出售" }}{{ item.coinUnit }}
      </text>
      <view class="flex-box">
        <text class="time-value success">{{ item.createTime }}</text>
        <u-image
          width="24px"
          height="24px"
          src="/static/icons/right.svg"
        ></u-image>
      </view>
    </view>
    <view class="mt-10 flex-box-between">
      <view class="flex-box">
        <text class="t-label">单价</text>
        <text class="t-value">￥{{ item.price }}</text>
      </view>
      <view class="show-status">
        <text
          v-if="current === 0"
          :class="returnStatus(orderStatus, item.status).color"
        >
          {{ returnStatus(orderStatus, item.status).name }}
        </text>
        <text
          v-else
          :class="
            item.status === '0' && item.isCreateOrder === '1'
              ? 'primary'
              : returnStatus(postBar, item.status).color
          "
        >{{
            item.status === "0" && item.isCreateOrder === "1"
              ? "交易中"
              : returnName(item.status).name
          }}
        </text
        >
        <text
          v-if="(item.status == 1 || item.status == 2) && current === 0"
          class="time-countdown"
        >
          {{
            formatTime(
              +item.expireDate - count > 0 ? +item.expireDate - count : 0
            )
          }}
        </text>
      </view>
    </view>
    <view class="mt-10 flex-box">
      <text class="t-label">数量</text>
      <text class="t-value">{{ item.number }}/{{ item.coinUnit }}</text>
    </view>
    <view class="mt-10 flex-box">
      <text class="t-label">{{ current === 0 ? "交易" : "挂单" }}金额</text>
      <text class="t-value">￥{{ item.amount }}</text>
    </view>
    <view v-if="current === 1" class="mt-10 flex-box">
      <text class="t-label">完成率</text>
      <u-line-progress
        style="margin-left: 20rpx"
        :percentage="+(item.finishAmount / item.amount * 100).toFixed(2)"
        activeColor="#78b546"
      ></u-line-progress>
    </view>
  </view>
</template>

<script>
import {postBar, orderStatus} from "../../../utils/data"
import {formatTime} from "../../../utils/utils"

export default {
  name: "trade-item",
  props: {
    item: {
      type: Object,
    },
    count: {
      type: Number,
      required: true,
    },
    current: {
      type: Number,
    },
  },
  data () {
    return {
      orderStatus,
      postBar,
      formatTime,
    }
  },
  methods: {
    returnStatus (list, status) {
      return list.find((item) => item.key === status)
    },
    returnName (status) {
      return postBar.find((item) => item.key === status)
    },
    pageTo () {
      const {tradeId, orderSn, advertiseNo} = this.item
      console.log(this.item)
      this.router({
        url:
          this.current === 1
            ? "pages/postDetails/index"
            : "pages/tradeDetails/index",
        params: {
          id: this.current === 1 ? advertiseNo : orderSn,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.trade-item {
  padding: 32rpx 12rpx 12rpx 32rpx;
  background: #fff;
  margin-bottom: 12rpx;
  border-radius: 10rpx;

  .t-label {
    color: #333333;
    font-size: 28rpx;
  }

  .t-value {
    color: #666666;
    font-size: 28rpx;
    margin-left: 20rpx;
  }

  .time-value {
    color: #999999;
    font-size: 24rpx;
  }

  .show-status {
    font-size: 28rpx;
    padding-right: 20rpx;
  }

  .time-countdown {
    margin-left: 12rpx;
    color: #ef3c3c;
  }
}
</style>
