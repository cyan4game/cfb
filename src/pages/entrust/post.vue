<!-- 发布委托 -->
<template>
  <view class="info-page-bg entrust-post">
    <view class="info-page-content content-box">
      <view class="types">
        <text class="name">广告类型</text>
        <view class="type">
          <view class="check" @click="changeType('buy')" :class="{'checked':type=='buy'}"><view class="in"></view></view>
          <text>购买</text>
        </view>
        <view class="line"></view>
        <view class="type">
          <view class="check" @click="changeType('sell')" :class="{'checked':type=='sell'}"><view class="in"></view></view>
          <text>出售</text>
        </view>
      </view>

      
      <view class="subtitle">数量</view>
      <view class="ipt">
        <input v-model="form.entrustAmount" @input="() => form.estimatedAmount = form.referenceRate * form.entrustAmount" class="input" type="number" placeholder="数量" />
        <text>CFB</text>
      </view>
      <view style="display: flex;">
        <view style="flex:1">
          <view class="subtitle">参考汇率</view>
          <view class="ipt">
            <text class="input">{{ form.referenceRate }}</text>
          </view>
        </view>
        <view style="flex:2;margin-left: 20rpx;">
          <view class="subtitle">预估成交金额</view>
          <view class="ipt">
            <text class="input">{{ form.estimatedAmount }}</text>
          </view>
        </view>
      </view>
      <view class="subtitle">结束时间</view>
      <view class="ipt">
        <!-- <text class="input">3天</text> -->
        <picker class="input" @change="bindPickerChange" :range-key="'name'" :value="index" :range="array">
						<view >{{ array[index].name }}</view>
        </picker>
        <u-image
          class="icon"
          src="/static/images/index/more.png"
          width="15rpx"
          height="9rpx"
        ></u-image>
      </view>
      <view class="subtitle" v-show="type=='sell'">收款账号</view>
      <view class="ipt" v-show="type=='sell'">
        <text class="input" v-if="!payways.length" @click="goBind">请选择收款账号</text>
        <picker class="input" v-if="payways.length" @change="bindPayWayChange" :range-key="'_accountName'" :value="paywayIndex" :range="payways">
						<view >{{ paywayIndex == -1 ? '请选择收款账号' : payways[paywayIndex]._accountName }}</view>
        </picker>
        <u-image
          class="icon"
          src="/static/images/index/more.png"
          width="15rpx"
          height="9rpx"
        ></u-image>
      </view>


      <u-button class="submit" :disabled="disabled" @click="post">{{ form.id?'编辑':'发布' }}委托</u-button>
    </view>

    <!-- 跳转绑定弹窗 -->
    <confirm-dialog ref="bindDialog" :title="'绑定收款账号'" :content="'你还未绑定收款账号，去绑定？'" :borderBtn="'取消'" :btn="'去绑定'" :btnHandle="goBindPage"></confirm-dialog>
  </view>
</template>

<script>
import { entrustRelease, queryByPaymodelMember, entrustUpdate } from '@/api/api'
import storage from '@/utils/storage'


const payWayMap = {
  1: '支付宝',
  2: '微信',
  3: '银行卡'
}

export default {
  name: "entrustPost",
  data() {
    return {
      loading: false,
      type: 'buy', // 出售-sell  购买-buy
      form: {
        currency: 'CFB', // 币种
        paymodelId: '', // 收款方式id
        entrustAmount: '', // 委托数量
        estimatedAmount: '', // 预估成交金额
        referenceRate: '1.00', // 汇率
        endTime: 3, // 结束时间
        type: 1, // 类型：1 购买，2出售
      },
      array: [
        { name: '3天', val: 3 },
        { name: '5天', val: 5 },
        { name: '10天', val: 10 },
        { name: '15天', val: 15 },
        { name: '30天', val: 30 },
      ],
      index: 0, // 结束时间下标

      payways: [], // 支付方式
      paywayIndex: -1,
    }
  },
  computed: {
    disabled() {
      if (this.type == 'buy') {
        if (this.form.entrustAmount && !this.loading) return false
        return true
      } else {
        if (this.form.entrustAmount && this.form.paymodelId && !this.loading) return false
        return true
      }
    }
  },
  onLoad(data) {
    this.type = data.type == 2 ? 'sell' : 'buy'
    // 'currency', 'paymodelId', 'entrustAmount', 'estimatedAmount', 'referenceRate', 'endTime', 'type'
    Object.assign(this.form, data)

    
    this.index = this.array.findIndex(item => item.val == this.form.endTime)
  },
  onShow() {
    this.getPayways()
  },
  methods: {
    // 改变类型  如果编辑模式就不能变更
    changeType(key) {
      if (this.form.id) return
      this.type = key
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
    // 选择时间
    bindPickerChange(e) {
      this.index = e.target.value
      this.form.endTime = this.array[this.index].val
    },
    // 选择支付方式
    bindPayWayChange(e) {
      this.paywayIndex = e.target.value
      this.form.paymodelId = this.payways[this.paywayIndex].id
    },
    // 查询支付方式
    getPayways() {
      this.payways = storage.get('mypayways') || []
      queryByPaymodelMember().then(res => {
        if (res.code == 200) {
          this.payways = res.data.map(item => {
            item._accountName = payWayMap[item.payType] + '-' + item.accountName
            return item
          })
          storage.set('mypayways', this.payways)
          if (this.form.paymodelId) {
            this.paywayIndex = this.payways.findIndex(item => item.id == this.form.paymodelId)
          }
        }
      })
    },
    // 发布
    post() {
      this.form.type = this.type == 'buy' ? 1 : 2
      this.loading = true
      const Req = this.form.id ? entrustUpdate : entrustRelease
      Req(this.form).then(res => {
        if (res.code == 200) {
          uni.showToast({
            title: this.form.id ? '编辑成功' : '发布成功',
            icon: 'none',
            duration: 2000
          })
          this.form.paymodelId = ''
          this.form.entrustAmount = ''
          this.form.estimatedAmount = ''
          setTimeout(() => {
            uni.navigateBack()
          }, 500)
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.entrust-post {
  .content-box {
    overflow: auto;
  }
  .types {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #7a7a7a;
    font-size: 26rpx;
    padding-bottom: 30rpx;
    border-bottom: 1px solid #cecece;
    .name {
      flex: 1;
    }
    .type {
      display: flex;
      align-items: center;
      color: #454545;
    }
    .line {
      width: 1px;
      height: 38rpx;
      background-color: #bebebe;
      margin: 0 50rpx;
    }
  }
  .subtitle {
    color: #7a7a7a;
    font-size: 26rpx;
    margin: 35rpx 0;
  }
  .title2 {
    color: #433F48;
    font-size: 26rpx;
    margin-top: 50rpx;
    margin-bottom: 30rpx;
  }
  .pays {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .pay {
        display: flex;
        color: #433F48;
        font-size: 26rpx;
        align-items: center;
        .icon {
            margin-right: 10rpx;
        }
    }
  }
  .ipt {
    box-sizing: border-box;
    height: 72rpx;
    border-radius: 6rpx;
    background-color: #f1f1f1;
    padding: 0 40rpx 0 29rpx;
    display: flex;
    align-items: center;
    color: #433f48;
    font-size: 28rpx;
    .input {
      flex: 1;
      margin-right: 20rpx;
      font-size: 28rpx;
    }
  }
  .submit {
    width: 451rpx;
    height: 96rpx;
    background-color: #449367;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;
    margin: 96rpx auto;
  }

  .price {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 30rpx 0;
    line-height: 50rpx;
    .price-item {
        width: 40%;
        color: #433F48;
        font-size: 26rpx;
        .price-info {
            display: flex;
            align-items: center;
            .icon {
                margin-left: 10rpx;
            }
        }
    }
  }
}
</style>
