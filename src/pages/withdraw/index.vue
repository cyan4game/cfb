<!-- 提币 -->
<template>
  <view class="info-page-bg page-withdraw">
    <!-- 表单 -->
    <view class="info-page-content content-box">
      <view class="form">
        <!-- 币种 -->
        <view class="form-item">
          <view class="item-title">币种</view>
          <view class="item-content">
            <view class="ipt">{{ form.currency || "请选择币种" }}</view>
            <u-image
              class="content-icon"
              src="@/static/images/mine/right.png"
              width="15rpx"
              height="29rpx"
            ></u-image>
          </view>
        </view>

        <!-- 提现地址 -->
        <view class="form-item">
          <view class="item-title">提现地址</view>
          <view class="item-content">
            <input
              @input="checkAddress"
              v-model.trim="form.toAddress"
              type="text"
              class="ipt"
            />
            <u-image
              class="content-icon"
              src="@/static/images/home/trans.png"
              width="36rpx"
              height="33rpx"
              @click="() => $refs.addressPopup.open()"
            ></u-image>
          </view>
          <view class="item-tip" v-if="form.toAddress && !passAddress"
            >无效的地址</view
          >
        </view>

        <!-- 提现数量 -->
        <view class="form-item">
          <view class="item-title">提现数量</view>
          <view class="item-content">
            <input
              v-model="form.amount"
              type="number"
              class="ipt"
              placeholder="请输入提现数量"
            />
          </view>
          <view class="tip">可用转账月 5000.1234 USDT</view>
        </view>

        <view class="form-item">
          <view class="item-title">手续费</view>
          <view>0 USDT</view>
        </view>
      </view>
    </view>

    <!-- 按钮 -->
    <view class="btn" @click="submit" :class="{ 'disabled-btn': disabled }"
      >提交</view
    >

    <!-- 验证弹窗 -->
    <verify-dialog :password="true" ref="vd" @success="successHandle" />

    <!-- 币种选择 -->
    <coin-select ref="currencyPopup" @select="clickCurrency" />

    <!-- 提币地址选择 -->
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
          <view class="close" @click="() => $refs.popup.close()">×</view>
        </view>

        <view style="padding: 0 30rpx; box-sizing: border-box">
          <view class="sure-item">
            <text>提现地址</text>
            <text class="sure-val">{{ form.toAddress }}</text>
          </view>
          <view class="sure-item">
            <text>提现数量</text>
            <text class="sure-val">{{ form.amount }} USDT</text>
          </view>
          <view class="sure-item">
            <text>手续费</text>
            <text class="sure-val">0 USDT</text>
          </view>
          <view class="sure-item">
            <text>实际到账</text>
            <text class="sure-val">{{ form.amount }} USDT</text>
          </view>
        </view>
        <view class="submit" @click="next">确认转账</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { withdraw } from "@/api/api";
import storage from "@/utils/storage";
import { isValidTRONAddress } from "@/utils/utils";

export default {
  name: "addressList",
  data() {
    return {
      type: 1, // 页面类型 1-添加  2-修改
      form: {
        toAddress: "", // 地址
        currency: "USDT_TRC20", // 币种
        amount: "", // 数量
      },
      loading: false,
      userInfo: {},
      passAddress: false, // 是否通过地址格式校验
    };
  },
  computed: {
    disabled() {
      return !(this.form.toAddress && this.form.amount) || this.loading;
    },
  },
  onLoad(data) {
    this.userInfo = storage.get("userInfo") || {};
    if (data.address) {
      this.form.toAddress = data.address;
      this.checkAddress();
    }
  },
  methods: {
    // 校验地址是否合法
    checkAddress() {
      setTimeout(() => {
        this.passAddress =
          this.form.toAddress && isValidTRONAddress(this.form.toAddress);
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
      withdraw({
        ...this.form,
        // ...codes,
      })
        .then((res) => {
          if (res.code == 200) {
            uni.showToast({
              title: "提币成功",
              icon: "none",
              duration: 2000,
            });
            this.form.toAddress = "";
            this.form.amount = "";
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
          }
        }

        .item-tip {
          color: #dc2727;
          font-size: 24rpx;
          margin-top: 20rpx;
        }
        .tip {
          font-size: 24rpx;
          margin-top: 10rpx;
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

  .disabled-btn {
    background-color: #f1f1f1;
    color: #757575;
  }
}
.sure-box {
  width: 100%;
  height: 600rpx;
  background-color: #fff;

  .title {
    height: 120rpx;
    padding: 0 37rpx 0 63rpx;
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
    height: 70rpx;
    border-bottom: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26rpx;
    .sure-val {
      margin-left: 20rpx;
    }
  }

  .submit {
    background: #449367;
    border-color: #449367;
    width: 451rpx;
    height: 96rpx;
    margin: 40rpx auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 26rpx;
  }
}
</style>
