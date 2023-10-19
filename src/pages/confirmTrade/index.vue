<!-- 购买 -->
<template>
  <view class="info-page-bg self-body page-trade">
    <u-navbar :safeAreaInsetTop="false" :leftIcon="''" :title="'交易'"  />
    <!-- 菜单按钮 -->
    <u-image
      @click="showNav = true"
      class="menu-icon"
      src="/static/images/index/menu.png"
      width="35rpx"
      height="35rpx"
    ></u-image>

    <view class="info-page-content content-box">
      <view class="box type-box">
        <view
          class="type"
          @click="changeTab(1)"
          :class="{ 'active-type': type == 1 }"
          >购买</view
        >
        <view
          class="type"
          @click="changeTab(2)"
          :class="{ 'active-type': type == 2 }"
          >出售</view
        >
      </view>

      <!-- <view class="box tab-box" v-if="type == 1">
        <view class="tab active-tab">USDT</view>
        <view class="tab">CFB</view>
      </view> -->

      <!-- 表单 -->
      <view class="form">
        <view class="title" v-show="type == 2">
          <text>收款账号</text>
        </view>
        <view class="ipt" v-show="type == 2">
          <text class="input" v-if="!payways.length" @click="goBind">请选择收款账号</text>
          <picker class="input" v-if="payways.length" @change="bindPayWayChange" :range-key="'_accountName'" :value="paywayIndex" :range="payways">
              <view >{{ paywayIndex == -1 ? '请选择收款账号' : payways[paywayIndex]._accountName }}</view>
          </picker>
          <u-image
            class="more"
            src="/static/images/index/more.png"
            width="16rpx"
            height="9rpx"
          ></u-image>
        </view>
        <view class="title">
          <text>{{ type == 2 ? "出售" : "请选择购买金额" }}</text>
          <text class="amount" v-show="type == 2">可用余额{{cfb}}CFB</text>
          <view class="refresh" @click="getFaters">
            <text>刷新</text>
            <u-image
              class="refresh-icon"
              src="/static/images/index/refresh.png"
              width="20rpx"
              height="20rpx"
            ></u-image>
          </view>
        </view>
        <view class="ipt" v-show="type == 2">
          <input v-model="form.payAmount" class="input" type="number" placeholder="限额  100-20000" />
        </view>
        <view class="fasters">
          <view class="faster" :class="{'active-faster': buy.chooseMoney == item}" v-for="item in fasters" :key="item" @click="clickFaster(item)">{{
            item
          }}</view>
          <view class="faster" v-show="type == 1">
            <input class="input" @input="buy.chooseMoney = buy.inputMoney" v-model="buy.inputMoney" type="number" placeholder="其他金额" />
          </view>
        </view>
      </view>

      <view class="box tip-box">
        <view class="tip">
          參考汇率
          <u-image
            class="question"
            src="/static/images/index/question.png"
            width="32rpx"
            height="32rpx"
            style="position: relative;top:2rpx"
          ></u-image>
        </view>
        <view>1:1</view>
      </view>

      <view class="box bottom-box">
        <view>预计{{ type == 1 ? "支付" : "到账" }}</view>
        <view v-if="type == 2">￥{{ form.payAmount || 0 }}</view>
        <view v-if="type == 1">￥{{ buy.chooseMoney || 0 }}</view>
      </view>
      <view class="bottom">
        <view>交易提醒：</view>
        <br />
        <view>1. 请严格按照页面指引操作；</view>
        <view>2. 订单一旦提交，请勿随意取消；</view>
      </view>
    </view>

    <u-button type="primary" :class="{'info-page-disabled':isDisabled}" class="info-page-btn submit" @click="submit"
      >立即{{ type == 1 ? "购买" : "出售" }}</u-button
    >

    <!-- 匹配弹窗 -->
    <MatchDialog @buy="submitBuy" ref="matchBox" :matchResultItemList="matchResultItemList" />
    <!-- 出售确认 -->
    <sellDialog @next="() => $refs.verifyBox.open()" ref="sellBox" :form="form" />
    <!-- 菜单弹窗 -->
    <navsDialog  ref="navsBox" @close="showNav = false" v-if="showNav" />
    <!-- 安全验证 -->
    <verify-dialog :paddingBottom="true" @success="submitSell" ref="verifyBox" :password="true" />
    <!-- 跳转绑定弹窗 -->
    <confirm-dialog :key="'bind'" ref="bindDialog" :title="'绑定收款账号'" :content="'你还未绑定收款账号，去绑定？'" :borderBtn="'取消'" :btn="'去绑定'" :btnHandle="goBindPage"></confirm-dialog>
    <!-- 购买时没有匹配到订单的提示 -->
    <confirm-dialog :key="'nodata'" ref="nodataDialog" :title="'提示'" :content="'您提交的购买数量暂没有相近订单，您可以选择固定购买数量或发布购买委托'" :borderBtn="'重新选择'" :btn="'发布委托'" :btnHandle="goEntrustPage"></confirm-dialog>
  </view>
</template>

<script>
import MatchDialog from "./components/match";
import sellDialog from "./components/sellDialog";
import navsDialog from "./components/navs";
import storage  from '@/utils/storage'
import { updateBalance } from '@/utils/utils'
import { queryPayBindInfo, cfbOtcOrder, paymentBehalf, quickPayAmount, matchMoney, confirmBuyOrder } from '@/api/api'

const payWayMap = {
  1: "支付宝",
  2: "微信",
  3: "银行卡",
};
export default {
  name: "pageTrade",
  components: {
    MatchDialog,
    sellDialog,
    navsDialog,
  },
  data() {
    return {
      amountMap: {}, // 余额
      type: 1, // 1-购买 2-出售
      fasters: [], // 快捷金额
      buyFasters: [], // 快捷金额 含订单号
      cfb: 0, // cfb 余额

      buy: {
        chooseMoney: '',
        inputMoney: ''
      },
      form: {
        payType: '',
        gatherNo: '',
        payAmount: '',
        payCoin: 'CFB',
        realName: '',
      },

      showNav: false, // 是否打开菜单

      payways: [], // 支付方式
      paywayIndex: -1,
      matchResultItemList: [], // 匹配列表
    };
  },
  computed: {
    isDisabled() {
      if (this.type == 1) return !this.buy.chooseMoney
      return !(this.form.payAmount && this.form.payAmount > 0 && this.form.payAmount <= this.cfb)
    }
  },
  onShow() {
    this.type = storage.get('trade-tab') || 1
    this.getAmounts()
    this.getPayways()
    this.getFaters()
  },
  methods: {
    // 点击快捷金额
    clickFaster(val) {
      if (this.type == 1) { // 购买
        this.buy.chooseMoney = val
      } else { // 出售
        this.form.payAmount = val
      }
    },
    // 改变类型
    changeTab(key) {
      if (this.type == key) return
      this.buy.chooseMoney = ''
      this.buy.inputMoney = ''
      this.form.payAmount = ''
      this.type = key
      storage.set('trade-tab', key)
      this.getFaters()
    },
    // 获取快捷支付
    getFaters() {
      this.fasters = []
      this.buyFasters = []
      this.buy.chooseMoney = ''
      this.buy.inputMoney = ''
      uni.showLoading({
        title: '',
        mask: true,
      });
      if (this.type == 1) { // 购买
        quickPayAmount().then(res => {
          console.error('购买', res)
          this.buyFasters = res.data || []
          this.fasters = (this.buyFasters.map(item => {
            return item.coinAmount
          })).slice(0, 8)
        }).finally(() => {
          uni.hideLoading();
        })
      } else { // 出售
        paymentBehalf().then(res => {
          this.fasters = (res.data || []).slice(0, 6)
        }).finally(() => {
          uni.hideLoading();
        })
      }
    },
    // 购买
    submit() {
      if (this.isDisabled) return
      if (this.type == 1) { // 购买
        // 如果是快捷金额则直接下单，如果不是则请求撮合，如果结果只有一个则直接下单，否则弹窗让用户选择金额后下单
        const target = this.buyFasters.find(item => item.coinAmount == this.buy.chooseMoney)
        if (!target) {
          uni.showLoading({
            title: '',
            mask: true
          });
          this.matchResultItemList = []
          matchMoney({ buyAmount: this.buy.chooseMoney }).then(res => {
            console.error('匹配结果', res.data)
            if (res.code !== 200) return
            if (res.data.status == -1) { // 没有匹配上
              return this.$refs.nodataDialog.open()
            }
            if (res.data.matchResultItemList.length == 1) { // 只有一个 直接下单
              this.submitBuy(res.data.matchResultItemList[0])
            } else { // 用户选择
              this.matchResultItemList = res.data.matchResultItemList
              this.$refs.matchBox.open()
            }
          }).finally(() => {
            uni.hideLoading();
          })
        } else {
          this.submitBuy(target)
        }
        // this.$refs.matchBox.open();
      } else { // 出售
        this.$refs.sellBox.open();
      }
    },
    // 确认购买
    submitBuy(target) {
      console.error('确认购买', target)
      uni.showLoading({
        title: '',
        mask: true
      });
      confirmBuyOrder({ matchNo: target.matchOrderNo }).then(res => {
        console.error('结果', res)
      }).finally(() => {
        uni.hideLoading();
      })
    },
    // 确认出售
    submitSell(codes) {
      const params = {
        ...this.form,
        realName: this.form.realName,
        payModelId: this.form.payModelId,
        gatherWay: this.form.payType,
        payAmount: Number(this.form.payAmount),
        phoneVerifyCode: codes.phoneCode
      }
      uni.showLoading({
        title: '',
        mask: true,
      })
      cfbOtcOrder(params).then(res => {
        if (res.code == 200) {
          this.form.payAmount = ''
          uni.showToast({
            title: '出售成功',
            icon: 'none',
            duration: 2000
          })
          this.getAmounts()
        }
      }).finally(() => {
        uni.hideLoading();
      })
    },
    // 获取币种余额
    getAmounts() {
      this.amountMap = storage.get('balanceList') || []
      updateBalance().then((res) => {
        if (res) {
          this.amountMap = res
          const target = this.amountMap.find(item => item.currency == 'CFB')
          if (target) this.cfb = target.balance
        }
      });
    },
    // 选择支付方式
    bindPayWayChange(e) {
      console.error(this.payways[this.paywayIndex])
      this.paywayIndex = e.target.value
      this.form.payType = this.payways[this.paywayIndex].payType
      this.form.gatherNo = this.payways[this.paywayIndex].account
      this.form.payModelId = this.payways[this.paywayIndex].id
      this.form.realName = this.payways[this.paywayIndex].username
    },
    // 查询支付方式
    getPayways() {
      this.payways = storage.get('mypayways') || []
      queryPayBindInfo().then(res => {
        if (res.code == 200) {
          this.payways = res.data.map(item => {
            item._accountName = payWayMap[item.payType] + '-' + item.account
            return item
          })
          storage.set('mypayways', this.payways)
          if (this.payways.length) {
            this.bindPayWayChange({target:{value:0}})
          }
        }
      })
    },
    // 跳转绑定
    goBind() {
      this.$refs.bindDialog.open()
    },
    // 跳转绑定页面
    goBindPage() {
      this.$refs.bindDialog.close()
      uni.navigateTo({
         url: '/pages/collection/index'
      })
    },
    // 跳转委托页面
    goEntrustPage() {
      this.$refs.nodataDialog.close()
      uni.navigateTo({
         url: '/pages/entrust/index'
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.page-trade {
  font-weight: 400;
  .menu-icon {
    position: fixed;
    z-index: 9999;
    right: 40rpx;
    top: 36rpx;
  }
  .content-box {
    color: #7a7a7a;
    font-size: 26rpx;
    padding-bottom: 200rpx;
    .box {
      height: 100rpx;
      border-bottom: 1px solid #cecece;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .type-box {
      .type {
        line-height: 38rpx;
        font-size: 32rpx;
        color: #868686;
        padding: 0 31rpx;
        border-right: 1px solid #bebebe;
        font-weight: 400;
      }
      .active-type {
        color: #454545;
        font-size: 34rpx;
        font-weight: 500;
      }
    }
    .tab-box {
      align-items: stretch;
      .tab {
        margin-right: 40rpx;
        padding: 0 20rpx;
        box-sizing: border-box;
        line-height: 100rpx;
      }
      .active-tab {
        border-bottom: 8rpx solid #449367;
      }
    }
    .tip-box {
      .tip {
        display: flex;
        align-items: center;
        flex: 1;
        .question {
          margin-left: 16rpx;
        }
      }
    }
    .bottom-box {
      border-bottom: none;
      justify-content: space-between;
    }
    .bottom {
      color: #3c3c3c;
      margin-top: 10rpx;
      font-weight: 500;
    }
  }
  .form {
    .title {
      margin: 36rpx 0;
      position: relative;
      .amount {
        margin-left: 30rpx;
        color: #fb2b2b;
      }
      .refresh {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        top: 0;
        .refresh-icon {
          margin-left: 10rpx;
        }
      }
    }
    .ipt {
      height: 72rpx;
      background-color: #f1f1f1;
      border-radius: 6rpx;
      margin-bottom: 42rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30rpx;
      box-sizing: border-box;
      .input {
        font-size: 28rpx;
        color: #333;
        flex: 1;
      }
    }
    .fasters {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      .faster {
        width: 213rpx;
        height: 72rpx;
        border-radius: 6px;
        margin-bottom: 28rpx;
        margin-right: 18rpx;
        background-color: #f1f1f1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #433f48;
        font-size: 28rpx;
        padding: 0 20rpx;
        box-sizing: border-box;
        .input {
          color: #433f48;
          font-size: 28rpx;
          text-align: center;
        }
      }
      .active-faster {
        border: 1px solid #449367;
        color: #449367;
        background-color: #fff;
      }
    }
  }
  .submit {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 160rpx;
  }
}
</style>
