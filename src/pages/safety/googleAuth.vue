<template>
  <view class="google-auth" v-if="user">
    <view v-if="status === 0">
      <u-text margin="0 0 20px 0" text="请输入支付密码"></u-text>
      <u-code-input focus dot v-model="password" :maxlength="6" space="45rpx"></u-code-input>
      <u-button :disabled="password.length !== 6" class="btn" @click="handleNext" type="primary" color="#176af0" text="下一步"></u-button>
    </view>
    <view v-if="status === 1">
      <view class="qrcode">
        <view class="google-auth-tip">
          <view class="uni-flex">
            <text class="google-auth-tip-content">非常重要：</text>
          </view>
          <view class="uni-flex">
            <text class="google-auth-tip-content">请备份以下32位秘钥。并保存在您认为安全的地方。在手机丢失/谷歌身份验证器被异常卸载的情况下，您可以通过此秘钥回复。</text>
          </view>
        </view>
        <text class="google-auth-tip-2">请将以下秘钥复制到您的谷歌验证器</text>
        <qrcode
          class="page-body-qrcode"
          size="145"
          ref="qrcode"
          canvas-id="qrcode"
          :value="link"
        ></qrcode>
        <text class="google-auth-key">{{ secret }}</text>
        <u-button class="btn" @click="handleCopy(secret)" type="primary" color="#176af0" text="复制"></u-button>
        <text class="google-auth-tip-3">谷歌验证码</text>
        <u-code-input dot v-model="googleCode" :maxlength="6" space="45rpx"></u-code-input>
        <u-button class="btn" @click="handleBind" type="primary" text="完成" color="#176af0"></u-button>
      </view>
    </view>
  </view>
</template>

<script>
import qrcode from '@/common/uQRCode/components/u-qrcode/u-qrcode.vue'
import {mapGetters} from "vuex";
import {checkTxPassword, googleAuth, googleQR} from "@/api/api";

export default {
  components: {qrcode},
  data() {
    return {
      status: 0,
      password: '',
      googleCode: '',
      secret: '',
      link: ''
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    user() {
      return this.userInfo.userInfo || {}
    }
  },
  onShow(options) {
    if (!this.user) {
      this.goBack()
    }
  },
  methods: {
    handleNext() {
      uni.showLoading({
        title: '请稍后...',
        mask: true
      })
      if (this.password && this.password.length === 6) {
        checkTxPassword({
          txPwd: this.password
        }).then(res => {
          uni.hideLoading()
          if (res.code.toString() === '0') {
            this.status = 1
            googleQR().then(res => {
              if (res.code.toString() === '0') {
                this.secret = res.data.secret
                this.link = res.data.link
              }
            }).catch(_ => {
              console.error(_)
            })
          }
        }).catch(_ => {
          console.error(_)
          uni.hideLoading()
        })
      }
    },
    handleBind() {
      uni.showLoading({
        title: '请稍后...',
        mask: true
      })
      googleAuth({codes: this.googleCode}).then(({code, message}) => {
        uni.hideLoading()
        if (code === "0") {
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/mine/index'
            })
          }, 1000);
        } else {
          this.googleCode = "";
        }
      }).catch(_ => {
        console.error(_)
        uni.hideLoading()
      });
    },
    handleCopy(value) {
      uni.setClipboardData({
        data: value,
        success: function () {
          console.log('success');
        }
      });
    },
  }
}
</script>

<style lang="scss">
.google-auth {
  padding: 40rpx;
  min-height: 100%;
  box-sizing: border-box;
  background-color: #ffffff;

  &-tip {
    width: 100%;
    height: 220rpx;
    border-radius: 20rpx;
    background-color: #ffe8e8;
    box-sizing: border-box;
    padding: 30rpx 20rpx;

    &-title {
      color: #ef3c3c;
      font-weight: bold;
      font-size: 28rpx;
      line-height: 40rpx;
    }

    &-content {
      color: #ef3c3c;
      line-height: 40rpx;
      font-size: 28rpx;
    }
  }

  &-tip-2 {
    font-size: 32rpx;
    font-weight: bold;
    color: #176af0;
    margin: 40rpx 0;
    text-align: center;
  }

  &-tip-3 {
    font-size: 32rpx;
    font-weight: bold;
    color: #176af0;
    margin: 40rpx 0;
    text-align: center;
  }

  &-key {
    font-size: 28rpx;
    color: #176af0;
    margin: 20rpx 0;
    text-align: center;
  }

  .btn {
    margin-top: 20px;
  }

  .qrcode {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60px;
  }
}
</style>
