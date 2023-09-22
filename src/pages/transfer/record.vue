<template>
  <view class="page">
    <u-sticky class="page-tab">
      <u-subsection
        :class="'page-tab-' + tabIndex"
        :list="times"
        :current="tabIndex"
        mode="subsection"
        activeColor="#505bde"
        fontSize="28rpx"
        bold
        @change="onChangetabIndex"
      >
      </u-subsection>
    </u-sticky>
    <view class="page-list" v-for="(tab, index) in times" v-show="tabIndex === index" :key="index">
      <view class="page-list-item" v-for="(row, i) in listMap[index] || []" :key="i">
        <template v-if="index === 0">
          <view class="page-list-item-row">
            <text class="page-list-item-row-label">
              转出{{ row.orderCoinStr && row.orderCoinStr.split(/[\-_]/g)[0] || '' }}
            </text>
            <text class="page-list-item-row-value">{{ row.transferTime }}</text>
          </view>
          <view class="page-list-item-row">
            <text class="page-list-item-row-address">{{ row.receiveAddress }}</text>
            <text class="page-list-item-row-amount" v-if="row.orderStatus === 'DONE'">-{{ row.applyOrderNumber }}</text>
            <text class="page-list-item-row-amount page-list-item-row-amount-fail" v-else-if="row.orderStatus === 'FAIL'">订单失败</text>
            <text class="page-list-item-row-amount page-list-item-row-amount-system-fail" v-else-if="row.orderStatus === 'SYSTEM_FAIL'">系统失败</text>
            <text class="page-list-item-row-amount page-list-item-row-amount-pending" v-else-if="row.orderStatus === 'PENDING'">待处理</text>
          </view>
        </template>
        <template v-else-if="index === 1">
          <view class="page-list-item-row">
            <text class="page-list-item-row-label">
              收款{{ row.orderCoinStr && row.orderCoinStr.split(/[\-_]/g)[0] || '' }}
            </text>
            <text class="page-list-item-row-value">{{ row.orderTime }}</text>
          </view>
          <view class="page-list-item-row">
            <text class="page-list-item-row-address">{{ row.receiveAddress }}</text>
            <text class="page-list-item-row-amount-collection">+{{ row.amount }}</text>
          </view>
        </template>
      </view>
      <view v-if="listMap[index] && listMap[index].length === 0" class="page-list-null">
        <u-image src="/static/icons/icon-record-null.svg" width="160rpx" height="160rpx"></u-image>
        <text class="page-list-null-tip">目前无记录</text>
      </view>
      <uni-load-more v-if="loadStatus[index] !== undefined" :status="loadStatus[index]"></uni-load-more>
    </view>
  </view>
</template>

<script>
import {getMemberReceiveList, getTransferOrderList} from "@/api/api";

export default {
  data() {
    return {
      tabIndex: 0,
      pageSize: 10,
      listMap: {},
      pageIndexMap: {},
      refreshingMap: {},
      loadStatus: {},
      times: [
        {
          name: '转出',
        },
        {
          name: '收款',
        }
      ]
    }
  },
  watch: {
    tabIndex() {
      uni.startPullDownRefresh({})
    }
  },
  created() {
    this.times.forEach((v, i) => {
      // this.listMap[i] = []
      this.pageIndexMap[i] = 0
      this.refreshingMap[i] = false
    })
    this.onLoadData(true)
  },
  onPullDownRefresh() {
    this.onLoadData(true)
  },
  onReachBottom() {
    this.onLoadData()
  },
  methods: {
    /**
     * 分页加载数据
     */
    onLoadData(refresh) {
      const tabIndex = this.tabIndex
      if (!refresh && this.loadStatus[tabIndex] === 'nomore' || this.refreshingMap[tabIndex]) return

      let api
      switch (tabIndex) {
        case 0:
          api = getTransferOrderList
          break
        case 1:
          api = getMemberReceiveList
          break
      }
      if (!api) {
        uni.stopPullDownRefresh()
        return
      }

      uni.showLoading({
        title: '加载中...',
        mask: true
      })
      this.pageIndexMap[tabIndex] += 1
      api({
        currentPage: this.pageIndexMap[tabIndex],
        pageSize: this.pageSize
      }).then(res => {
        setTimeout(() => {
          this.refreshingMap[tabIndex] = false
        }, 500)
        uni.stopPullDownRefresh()
        uni.hideLoading();
        if (res.code.toString() === '0' && res.data) {
          if (refresh) {
            this.listMap[tabIndex] = res.data.rows || [];
          } else {
            this.listMap[tabIndex] = this.listMap[tabIndex].concat(res.data.rows || []);
          }

          if (Number(res.data.pages <= this.pageIndexMap[tabIndex])) {
            this.loadStatus[tabIndex] = 'nomore'
          } else {
            this.loadStatus[tabIndex] = 'loading'
          }

          this.$forceUpdate()
        }
      }).catch(_ => {
        console.error(_)
        setTimeout(() => {
          this.refreshingMap[tabIndex] = false
        }, 500)
        uni.stopPullDownRefresh()
        uni.hideLoading();
      })
    },
    onChangetabIndex(tabIndex) {
      this.tabIndex = tabIndex
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

.page {
  //min-height: 100vh;

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
      .page-tab-#{$i} {
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
      height: 154rpx;
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

        &-value {
          color: #999999;
          font-size: 24rpx;
        }

        &-address {
          color: #999999;
          font-size: 24rpx;
          height: 40rpx;
          padding-right: 60rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &-amount {
          color: #ef3c3c;
          font-size: 28rpx;
          font-weight: bold;
          white-space: nowrap;

          &-fail {
            color: #ef3c3c;
          }

          &-system-fail {
            color: #ef3c3c;
          }

          &-pending {
            color: #0277ff;
          }

          &-collection {
            color: #63b72e;
          }
        }
      }
    }
  }
}
</style>
