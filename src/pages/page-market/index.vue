<template>
  <view class="page">
    <u-sticky offsetTop="0" customNavHeight="0">
      <notice-navbar :back="false" title="市场行情"></notice-navbar>
      <!--      <view class="page-tab">-->
      <!--        <u-tabs-->
      <!--          :current="tabIndex"-->
      <!--          :list="baseCurrencyList"-->
      <!--          activeStyle="color:#505bde"-->
      <!--          lineColor="#505bde"-->
      <!--          lineHeight="6rpx"-->
      <!--          lineWidth="80rpx"-->
      <!--          itemStyle="height:100rpx;padding:0 20rpx"-->
      <!--          @change="onChangeTab"-->
      <!--        ></u-tabs>-->
      <!--      </view>-->
      <u-row class="page-header">
        <u-col class="page-header-item" style="flex: 0 0 30%">
          <text class="page-header-item-text">币种</text>
        </u-col>
        <u-col class="page-header-item" style="flex: 0 0 50%">
          <text class="page-header-item-text">当前价格</text>
        </u-col>
        <u-col class="page-header-item" style="flex: 0 0 20%">
          <text class="page-header-item-text">24h涨跌</text>
        </u-col>
      </u-row>
    </u-sticky>
    <view class="page-item" v-for="(v, i) in targetList || []" :key="i">
      <u-icon style="margin-right: 20rpx" size="48rpx" :name="`/static/icons/icon-currency-${v.currency}.svg`"></u-icon>
      <view class="page-item-currency">
        <view class="page-item-currency-name">
          <text class="page-item-currency-name-1">{{ v.currency }}</text>
          <text class="page-item-currency-name-2">/{{ v.baseCurrency }}</text>
        </view>
        <text class="page-item-currency-market">市值 {{ v.marketValue }}</text>
      </view>
      <view class="page-item-price">
        <text class="page-item-price-text">{{ parseFloat(v.price) }}</text>
        <text class="page-item-price-cny">{{ v.priceCNY }}</text>
      </view>
      <view :class="{'page-item-ud': true, 'page-item-ud-d': parseFloat(v.chg ) < 0}">
        <text class="page-item-ud-text">{{ parseFloat(v.chg) < 0 ? "" : "+" }}{{ parseFloat(v.chg).toFixed(2) }}%</text>
      </view>
    </view>
  </view>
</template>

<script>
import noticeNavbar from "@/components/notice-navbar/index"
import {quotationList} from "@/api/api"

export default {
  components: {noticeNavbar},
  data () {
    return {
      refreshing: false,
      baseCurrencyList: [],
      quotationMap: {},
      tabIndex: 0,
      refreshTask: NaN,
      refreshSpan: 10 * 1000
    }
  },
  computed: {
    targetList () {
      return this.quotationMap[this.targetCurrency]
    },
    targetCurrency () {
      return this.baseCurrencyList[this.tabIndex] && this.baseCurrencyList[this.tabIndex].name
    }
  },
  onShow () {
    this.startRefresh()
  },
  onHide () {
    this.stopRefresh()
  },
  onUnload () {
    this.stopRefresh()
  },
  onPullDownRefresh () {
    this.refresh()
  },
  methods: {
    startRefresh () {
      this.stopRefresh()
      this.refresh()
      this.refreshTask = setInterval(() => {
        this.refresh()
      }, this.refreshSpan)
    },
    stopRefresh () {
      if (this.refreshTask) clearInterval(this.refreshTask)
    },
    onChangeTab ({index, item}) {
      this.tabIndex = index
    },
    refresh () {
      if (this.refreshing) return

      if (this.baseCurrencyList.length === 0) {
        uni.showLoading({
          title: "加载中...",
          mask: true
        })
      }

      this.refreshing = true
      quotationList().then(res => {
        this.refreshing = false
        uni.stopPullDownRefresh()
        uni.hideLoading()
        if (res.code.toString() === "0") {
          this.baseCurrencyList = res.data.baseCurrencyList.map(v => {
            return {
              name: v
            }
          })
          this.quotationMap = res.data.quotationMap || {}
        }
      }).catch(_ => {
        console.error(_)
        this.refreshing = false
        uni.hideLoading()
        uni.stopPullDownRefresh()
      })
    }
  }
}
</script>

<style lang="scss">
::v-deep .u-tabs__wrapper__nav__line {
  bottom: 18rpx;
}

.page {
  min-height: 100%;
  padding-bottom: 50px;

  &-tab {
    height: 100rpx;
    background-color: #ffffff;
  }

  &-header {
    height: 72rpx;
    padding: 0 20rpx;
    background-color: #f8f8f8;

    &-item {

      &-text {
        color: #666666;
        font-size: 24rpx;
        text-align: center;
      }
    }
  }

  &-item {
    height: 154rpx;
    background-color: #ffffff;
    margin-bottom: 12rpx;
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-currency {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;

      &-name {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        &-1 {
          color: #505bde;
          font-size: 28rpx;
          font-weight: bold;
        }

        &-2 {
          color: #333333;
          font-size: 28rpx;
          font-weight: bold;
        }
      }

      &-market {
        color: #999999;
        font-size: 24rpx;
      }
    }

    &-price {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      &-text {
        color: #333333;
        font-size: 28rpx;
        font-weight: bold;
      }

      &-cny {
        color: #999999;
        font-size: 24rpx;
      }
    }

    &-ud {
      min-width: 136rpx;
      padding: 0 4rpx;
      height: 48rpx;
      border-radius: 10rpx;
      background-color: #63b72e;
      display: flex;
      align-items: center;
      justify-content: center;

      &-d {
        background-color: #ef3c3c;
      }

      &-text {
        color: #ffffff;
        font-size: 28rpx;
        //font-weight: bold;
        text-align: center;
      }
    }
  }
}
</style>
