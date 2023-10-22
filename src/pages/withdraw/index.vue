<!-- 转账 -->
<template>
  <view class="info-page-bg self-body page-withdraw">
    <u-navbar
      :safeAreaInsetTop="false"
      :title="'转账'"
      @leftClick="() => $routers.back()"
    />
    <!-- 表单 -->
    <view class="info-page-content content-box">
      <view class="form">
        <!-- 币种 -->
        <view class="form-item">
          <!-- <view class="item-title">币种</view> -->
          <view class="item-content" @click="() => $refs.currencyPopup.open()">
            <view class="ipt">
              <coin-icon class="ipt-icon" :coin="form.currency" />
              <text>{{ form.currency || "请选择币种" }}</text>
            </view>

            <u-image
              src="@/static/images/index/more.png"
              width="16rpx"
              height="9rpx"
            ></u-image>
          </view>
        </view>

        <!-- 转账地址 -->
        <view class="form-item">
          <view class="item-title">转账地址</view>
          <view class="item-content" style="padding-right: 20rpx">
            <input
              @input="checkAddress"
              v-model.trim="form.toAddress"
              type="text"
              class="ipt"
              placeholder="输入或长按粘贴地址"
            />
            <text class="content-icon" @click="() => $refs.addressPopup.open()"
              >选择地址</text
            >
          </view>
          <view class="item-tip" v-if="form.toAddress && !passAddress"
            >无效的地址</view
          >
        </view>

        <!-- 转账数量 -->
        <view class="form-item">
          <view class="item-title">转账数量 <text class="use">可用转账余额 {{ money }} {{ form.currency.replace("_TRC20", "") }}</text></view>
          <view class="item-content">
            <input
              @input="inputNum"
              v-model="form.amount"
              type="number"
              class="ipt"
              :placeholder="`请输入转账数量 ${
                state.minWithdrawAmount
                  ? '最小数量:' + state.minWithdrawAmount
                  : ''
              }  ${
                state.maxWithdrawAmount
                  ? '最大数量:' + state.maxWithdrawAmount
                  : ''
              }`"
            />
          </view>
          <view class="tip">
            <view class="tip-flex">
              <text class="tip-title">最小转账数量：</text> {{ state.minWithdrawAmount || '--' }} 
            </view>
            <view class="tip-flex">
              <text class="tip-title">最大转账数量：</text> {{ state.maxWithdrawAmount || '--' }} 
            </view>
            <view class="tip-flex">
              <text class="tip-title">手续费：</text> {{ fee }} 
            </view>
            <view class="tip-flex">
              <text class="tip-title">实际到账：</text> <text class="num">{{ form.amount - fee < 0 ? 0 : form.amount - fee }}</text> <text class="tail">{{ form.currency }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 按钮 -->
    <view
      v-show="state.withdrawState == 1"
      class="btn"
      @click="submit"
      :class="{ 'disabled-btn': disabled }"
      >转账</view
    >
    <view v-show="state.withdrawState != 1" class="btn-tip"
      >{{ form.currency }}禁止转账</view
    >

    <!-- 验证弹窗 -->
    <verify-dialog :password="true" ref="vd" @success="successHandle" />

    <!-- 币种选择 -->
    <!-- <coin-select  @select="clickCurrency" /> -->
    <coin-select-inner
      ref="currencyPopup"
      :coin="form.currency"
      :width="'691rpx'"
      @select="clickCurrency"
      :top="'calc(204rpx + env(safe-area-inset-top))'"
      :left="'30rpx'"
    />

    <!-- 转账地址选择 -->
    <address-select ref="addressPopup" @select="selectAddress" />

    <!-- 交易确认 -->
    <uni-popup
      ref="popup"
      type="bottom"
      :mask-click="false"
      :is-mask-click="false"
    >
      <view class="sure-box">
        <view class="title">
          <text>转账确认</text>
          <view class="close" @click="() => $refs.popup.close()"
            ><u-image
              mode="contain"
              src="/static/images/index/close.png"
              width="24rpx"
              height="24rpx"
            ></u-image
          ></view>
        </view>

        <view style="padding: 0 30rpx; box-sizing: border-box">
          <view class="sure-item">
            <text>转账地址</text>
            <text class="sure-val">{{ form.toAddress }}</text>
          </view>
          <view class="sure-item">
            <text>转账数量</text>
            <text class="sure-val">{{ form.amount }} {{ form.currency }}</text>
          </view>
          <view class="sure-item">
            <text>手续费</text>
            <text class="sure-val">{{ fee }} {{ form.currency }}</text>
          </view>
          <view class="sure-item">
            <text>实际到账</text>
            <text class="sure-val"
              >{{ form.amount - fee }} {{ form.currency }}</text
            >
          </view>
        </view>
        <view class="submit" @click="next">确认转账</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { withdraw, getCoinConfig } from "@/api/api";
import storage from "@/utils/storage";
import { isValidTRONAddress, updateBalance, _fixed } from "@/utils/utils";
import { coinList } from "@/utils/dataMap";

export default {
  name: "addressList",
  data() {
    return {
      type: 1, // 页面类型 1-添加  2-修改
      form: {
        toAddress: "", // 地址
        currency: "USDT", // 币种
        amount: "", // 数量
      },
      loading: false,
      userInfo: {},
      passAddress: false, // 是否通过地址格式校验

      amountMap: [],

      coinConfig: {}, // 币种配置信息
    };
  },
  computed: {
    disabled() {
      let minLimit = false
      let maxLimit = false
      if (this.state.minWithdrawAmount) {
        minLimit = this.form.amount < this.state.minWithdrawAmount;
      }
      if (this.state.maxWithdrawAmount) {
        maxLimit =  this.form.amount > this.state.maxWithdrawAmount;
      }
      return (
        !(this.form.toAddress && this.form.amount) ||
        this.loading ||
        this.form.amount > this.money ||
        this.form.amount <= 0
        || minLimit
        || maxLimit
      );
    },
    money() {
      const currency = this.form.currency;
      const target = this.amountMap.find((item) => item.currency == currency);
      if (target) return target.balance;
      return "--";
    },
    state() {
      return (
        this.coinConfig[this.form.currency] || {
          withdrawState: 0, // 1-可以转账  0-禁止转账
          minWithdrawAmount: "",
          maxWithdrawAmount: "",
        }
      );
    },
    fee() {
      const config = this.coinConfig[this.form.currency] || {};
      let val = 0;
      switch (
        config.withdrawFeeType // 提现手续费类型：1-固定值 2-百分比 3-固定值+百分比
      ) {
        case 1:
          val = config.withdrawFeeFixed;
          break;
        case 2:
          val = (config.withdrawFeePercentage / 100) * (this.form.amount || 0);
          break;
        case 3:
          val =
            config.withdrawFeeFixed +
            (config.withdrawFeePercentage / 100) * (this.form.amount || 0);
          break;
      }
      return val;
    },
  },
  onLoad(data) {
    this.userInfo = storage.get("userInfo") || {};
    if (data.address) {
      this.form.toAddress = data.address;
      this.checkAddress();
    }
  },
  onShow() {
    this.getAmounts();
    this.getConfig();
  },
  methods: {
    // 输入数量过滤
    inputNum() {
      setTimeout(() => {
        this.form.amount = _fixed(this.form.amount, 4);
      }, 0);
    },
    // 获取币种余额
    getAmounts() {
      this.amountMap = storage.get("balanceList") || [];
      updateBalance().then((res) => {
        if (res) {
          this.amountMap = res;
        }
      });
    },
    // 获取币种配置
    getConfig() {
      if (this.coinConfig[this.form.currency]) return;
      uni.showLoading({
        title: "",
        mask: true,
      });
      getCoinConfig(this.getCoinParams(this.form.currency))
        .then((res) => {
          if (res.code == 200) {
            this.coinConfig[this.form.currency] = res.data;
            this.coinConfig = JSON.parse(JSON.stringify(this.coinConfig)); // 触发计算手续费
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    // 获取币种参数
    getCoinParams(coin) {
      const target = coinList.find((item) => item.coin == coin);
      if (target) return target.coin + "_" + target.chain;
      return coin;
    },
    // 选择币种
    clickCurrency(item) {
      this.form.currency = item.name;
      this.$refs.currencyPopup.close();
      this.checkAddress();
      this.getConfig();
    },
    // 校验地址是否合法
    checkAddress() {
      setTimeout(() => {
        switch (this.form.currency) {
          default:
            this.passAddress =
              this.form.toAddress && isValidTRONAddress(this.form.toAddress);
            break;
        }
      });
    },
    // 提交
    submit() {
      if (this.disabled) return;
      this.$refs.popup.open();
    },
    next() {
      this.$refs.popup.close();
      this.$refs.vd.open();
    },
    successHandle(codes) {
      this.loading = true;
      const params = JSON.parse(JSON.stringify(this.form));
      params.currency = this.getCoinParams(params.currency);
      params.smsVerifyCode = codes.phoneCode;
      params.payPassword = codes.payPass;
      withdraw(params)
        .then((res) => {
          if (res.code == 200) {
            uni.showToast({
              title: "转账成功",
              icon: "none",
              duration: 2000,
            });
            this.form.toAddress = "";
            this.form.amount = "";
            this.getAmounts();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 选择地址
    selectAddress(item) {
      this.form.toAddress = item.address;
      this.$refs.addressPopup.close();
      this.checkAddress();
    },
  },
};
</script>

<style scoped lang="scss">
.page-withdraw {
  .content-box {
    color: #757575;
    font-size: 28rpx;
    padding-bottom: 100rpx;

    .form {
      .form-item {
        margin-bottom: 41rpx;

        .item-title {
          color: #7a7a7a;
          font-size: 26rpx;
          margin-bottom: 34rpx;
          .use {
            font-size: 20rpx;
            margin-left: 24rpx;
          }
        }

        .item-content {
          background-color: #f1f1f1;
          border-radius: 6rpx;
          height: 72rpx;
          position: relative;
          display: flex;
          align-items: center;
          padding: 0 40rpx;
          font-size: 26rpx;
          color: #7a7a7a;

          .ipt {
            flex: 1;
            margin-right: 20rpx;
            font-size: 28rpx;
            display: flex;
            align-items: center;
            .ipt-icon {
              width: 40rpx;
              height: 40rpx;
              margin-right: 16rpx;
            }
          }
          .content-icon {
            color: #4c9778;
          }
        }

        .item-tip {
          color: #dc2727;
          font-size: 24rpx;
          margin-top: 20rpx;
        }
        .tip {
          font-size: 26rpx;
          color: #3c3c3c;
          margin-top: 50rpx;
          .tip-flex {
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;
          }
          .tip-title {
            width: 180rpx;
            text-align: right;
            font-size: 24rpx;
          }
          .num {
            color: #dc2727;
          }
          .tail {
            font-size: 20rpx;
            color: #666;
            margin-left: 12rpx;
          }
        }
      }
    }
  }

  .btn {
    width: 451rpx;
    height: 96rpx;
    background-color: #449367;
    color: #fff;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 60rpx;
  }
  .btn-tip {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 60rpx;
    font-size: 24rpx;
    color: #dc2727;
  }

  .disabled-btn {
    background-color: #f1f1f1;
    color: #757575;
  }
}
.sure-box {
  width: 100%;
  height: 840rpx;
  background-color: #fff;
  box-sizing: border-box;
  padding: 40rpx 50rpx 50rpx 50rpx;

  .title {
    height: 120rpx;
    padding: 0 20rpx 0 40rpx;
    color: #38363b;
    font-size: 36rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dfdfdf;

    .close {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      background-color: #eeeeee;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      color: #888;
    }
  }
  .sure-item {
    height: 110rpx;
    border-bottom: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26rpx;
    color: #7a7a7a;
    .sure-val {
      max-width: 420rpx;
      color: #3c3c3c;
      margin-left: 60rpx;
      word-break: break-all;
      text-align: right;
    }
  }

  .submit {
    background: #449367;
    border-color: #449367;
    width: 451rpx;
    height: 96rpx;
    margin: 60rpx auto 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;
  }
}
</style>
