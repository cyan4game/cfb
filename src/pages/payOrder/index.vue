<template>
  <view class="page-pay-order">
    <u-sticky class="page-pay-order-tab">
      <u-subsection
        :class="'page-pay-order-tab-' + timeIndex"
        :list="times"
        :current="timeIndex"
        mode="subsection"
        activeColor="#505bde"
        fontSize="28rpx"
        bold
        @change="onChangeTimeIndex"
      >
      </u-subsection>
    </u-sticky>
    <view class="page-pay-order-list" v-for="(tab, index) in times" v-show="timeIndex === index" :key="index">
      <view class="page-pay-order-list-item" v-for="(v, i) in listMap[index] || []" :key="i">
        <view class="page-pay-order-list-item-row">
          <text class="page-pay-order-list-item-row-label">支付{{ v.coinName }}</text>
          <text class="page-pay-order-list-item-row-value uni-flex-item"></text>
          <text class="page-pay-order-list-item-row-value page-pay-order-list-item-row-value-time">{{ v.payTime }}</text>
        </view>
        <view class="page-pay-order-list-item-row">
          <text class="page-pay-order-list-item-row-label">商家</text>
          <text class="page-pay-order-list-item-row-value uni-flex-item">{{ v.receiveName }}</text>
          <text class="page-pay-order-list-item-row-value page-pay-order-list-item-row-value-status-1" v-if="v.orderState === 'DONE'">支付成功</text>
          <text class="page-pay-order-list-item-row-value page-pay-order-list-item-row-value-status-2" v-if="v.orderState === 'PENDING'">待处理</text>
          <text class="page-pay-order-list-item-row-value page-pay-order-list-item-row-value-status-3" v-if="v.orderState === 'FAIL'">订单失败</text>
          <text class="page-pay-order-list-item-row-value page-pay-order-list-item-row-value-status-3" v-if="v.orderState === 'SYSTEM_FAIL'">系统失败</text>
        </view>
        <view class="page-pay-order-list-item-row">
          <text class="page-pay-order-list-item-row-label">订单号</text>
          <text class="page-pay-order-list-item-row-value uni-flex-item" style="text-align: right">{{ v.scanCodeOrderNo }}</text>
          <u-icon size="40rpx" name="/static/icons/copy.svg" @click="$uni.setClipboardData({data: v.scanCodeOrderNo, showToast: true})"></u-icon>
        </view>
        <view class="page-pay-order-list-item-row">
          <text class="page-pay-order-list-item-row-label">交易金额</text>
          <text
            style="text-align: right"
            :class="'page-pay-order-list-item-row-value uni-flex-item ' + (v.orderState !== 'DONE' ? '' : 'page-pay-order-list-item-row-value-success')"
          >
            -{{ (Number(v.payNumber) / Number(v.rate)).toFixed(2) }}
          </text>
        </view>
      </view>
      <view v-if="listMap[index] && listMap[index].length === 0" class="page-pay-order-list-null">
        <u-image src="/static/icons/icon-record-null.svg" width="160rpx" height="160rpx"></u-image>
        <text class="page-pay-order-list-null-tip">目前无记录</text>
      </view>
      <uni-load-more v-if="loadStatus[index] !== undefined" :status="loadStatus[index]"></uni-load-more>
    </view>
  </view>
</template>

<script>
import {scanCodePayOrderQuery} from "../../api/api"

export default {
  name: "index",
  data () {
    return {
      pageSize: 10,
      timeIndex: 0,
      listMap: {},
      pageIndexMap: {},
      refreshingMap: {},
      loadStatus: {},
      times: [
        {
          name: "全部",
          startTime: "",
          endTime: "",
        },
        {
          name: "当日",
          startTime: this.$dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          endTime: this.$dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          name: "本周",
          startTime: this.$dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD HH:mm:ss"),
          endTime: this.$dayjs().endOf("week").add(1, "day").format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          name: "本月",
          startTime: this.$dayjs().startOf("month").format("YYYY-MM-DD HH:mm:ss"),
          endTime: this.$dayjs().endOf("month").format("YYYY-MM-DD HH:mm:ss"),
        }
      ]
    }
  },
  computed: {
    time () {
      return this.times[this.timeIndex]
    }
  },
  watch: {
    timeIndex () {
      this.onLoadData(true)
    }
  },
  created () {
    this.times.forEach((v, i) => {
      // this.listMap[i] = []
      this.pageIndexMap[i] = 0
      this.refreshingMap[i] = false
    })
    this.onLoadData(true)
  },
  onPullDownRefresh () {
    this.onLoadData(true)
  },
  onReachBottom () {
    this.onLoadData()
  },
  methods: {
    /**
     * 分页加载数据
     */
    onLoadData (refresh) {
      const timeIndex = this.timeIndex
      uni.showLoading({
        title: "加载中...",
        mask: true
      })
      this.pageIndexMap[this.timeIndex] += 1
      scanCodePayOrderQuery({
        currentPage: 0,
        pageSize: this.pageSize,
        startTime: this.time.startTime,
        endTime: this.time.endTime
      }).then(res => {
        setTimeout(() => {
          this.refreshingMap[timeIndex] = false
        }, 500)
        uni.stopPullDownRefresh()
        uni.hideLoading()
        if (res.code.toString() === "0") {
          if (refresh) {
            this.listMap[timeIndex] = res.data.models
          } else {
            this.listMap[timeIndex] = this.listMap[timeIndex].concat(res.data.models)
          }
          this.$forceUpdate()
        }
      }).catch(_ => {
        console.error(_)
        setTimeout(() => {
          this.refreshingMap[timeIndex] = false
        }, 500)
        uni.stopPullDownRefresh()
        uni.hideLoading()
      })
    },
    onChangeTimeIndex (timeIndex) {
      this.timeIndex = timeIndex
    }
  }
}
</script>

<style lang="scss" scoped>
uni-page-wrapper,
uni-page-body {
  height: unset !important;
  min-height: 100%;
}

.page-pay-order {
  min-height: 100vh;

  &-tab {
    background-color: #ffffff !important;
    //height: 124rpx;
    padding: 32rpx 24rpx;

    ::v-deep .u-subsection--subsection {
      height: 60rpx;

      .u-subsection__item__text {
        color: #999999 !important;
        font-weight: bold !important;
      }
    }

    @for $i from 0 through 10 {
      .page-pay-order-tab-#{$i} {
        ::v-deep .u-subsection__item--#{$i} {
          .u-subsection__item__text {
            color: #ffffff !important;
            z-index: $i;
          }
        }
      }
    }
  }

  &-list {
    padding: 20rpx;

    &-null {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-top: 320rpx;

      &-tip {
        color: #999999;
        font-size: 28rpx;
        padding-top: 20rpx;
      }
    }

    &-item {
      width: 710rpx;
      margin-bottom: 20rpx;
      height: 280rpx;
      background-color: #ffffff;
      padding: 32rpx;
      box-sizing: border-box;

      &-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40rpx;
        margin-bottom: 20rpx;

        &-label {
          color: #333333;
          font-size: 28rpx;
          font-weight: bold;
        }

        .uni-flex-item {
          padding-left: 20rpx;
        }

        &-value {
          color: #999999;
          font-size: 28rpx;

          &-time {
            font-size: 24rpx;
          }

          &-status-1 {
            color: #63b72e;
          }

          &-status-2 {
            color: #0277ff;
          }

          &-status-3 {
            color: #ef3c3c;
          }

          &-success {
            color: #63b72e;
          }
        }
      }
    }
  }
}
</style>
