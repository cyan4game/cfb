<template>
  <view class="page">
    <u-navbar
      :title="title"
      bgColor="#505bde"
      leftIconColor="#ffffff"
      titleStyle="color:#ffffff;"
      autoBack
      :fixed="false"
      rightIcon="/static/icons/icon-customer.svg"
      @rightClick="toCustomer"
    ></u-navbar>
    <!--验证方式-->
    <view class="page-body page-body-0" v-if="pageIndex === 0">
      <view class="page-body-0-email">
        <text class="page-body-0-email-text">
          电子邮箱 {{ user.email }}
        </text>
      </view>
      <u-button color="#505bde" text="发送验证码" @click="sendOldEmailCode"></u-button>
      <view class="page-body-0-other" v-if="user.jyPassword || user.googleState === '1'">
        <text class="page-body-0-other-label">无法验证原邮箱？</text>
        <text class="page-body-0-other-link" @click="pageIndex = 1">其他认证方式</text>
      </view>
    </view>
    <view class="page-body page-body-1" v-else-if="pageIndex === 1">
      <view class="page-body-1-tip" v-if="user.jyPassword && user.googleState === '1'">
        <text class="page-body-1-tip-text">请任意输入以下两种验证方式中的一种</text>
      </view>
      <u-form class="page-body-1-form" labelPosition="left" :model="otherForm" ref="otherForm" labelWidth="0">
        <u-form-item prop="otherForm" borderBottom v-if="user.jyPassword">
          <u-text color="#505bde" size="28rpx" text="支付密码"></u-text>
          <password-input v-model="otherForm.payPassword" border="bottom" placeholder="请输入支付密码"></password-input>
        </u-form-item>
        <u-form-item prop="otherForm" borderBottom v-if="user.googleState === '1'">
          <u-text color="#505bde" size="28rpx" text="谷歌验证码"></u-text>
          <u-input v-model="otherForm.googleCode" placeholder="请输入谷歌验证码" border="bottom" clearable></u-input>
        </u-form-item>
      </u-form>
      <u-button color="#505bde" text="下一步" @click="onOtherCheck" :disabled="otherNuxtDisabled"></u-button>
    </view>
    <view class="page-body page-body-2" v-else-if="pageIndex === 2">
      <view class="page-body-2-email">
        <text class="page-body-2-email-text">
          已发送至 {{ user.email }}
        </text>
      </view>
      <u-code-input v-model="oldCode"></u-code-input>
      <u-code seconds="60" ref="oldCodeTimer" @change="oldCodeTimerChange" startText="发送验证码" endText="重新发送" changeText="重新发送 (Xs)"></u-code>
      <view class="page-body-2-timer">
        <text class="page-body-2-timer-label">没收到验证码？</text>
        <text :class="{'page-body-2-timer-resend': true, 'page-body-2-timer-resend-disabled': oldCodeTimerTip !== '重新发送'}" @click="sendOldEmailCode">
          {{ oldCodeTimerTip }}
        </text>
      </view>
      <u-button color="#505bde" text="下一步" @click="onOldEmailCheck" :disabled="oldCode.length !== 6"></u-button>
    </view>
    <view class="page-body page-body-3" v-else-if="pageIndex === 3">
      <u-form class="page-body-3-form" labelPosition="left" :model="newForm" ref="newForm" labelWidth="0" :rules="newRules">
        <u-form-item prop="email" borderBottom>
          <u-text color="#505bde" size="28rpx" text="请输入新邮箱"></u-text>
          <u-input v-model="newForm.email" placeholder="请输入电子邮箱" border="bottom" clearable></u-input>
        </u-form-item>
      </u-form>
      <u-button color="#505bde" text="下一步" @click="sendNewEmailCode" :disabled="newEmailNextDisabled"></u-button>
    </view>
    <view class="page-body page-body-2" v-else-if="pageIndex === 4">
      <view class="page-body-2-email">
        <text class="page-body-2-email-text">
          已发送至 {{ newForm.email }}
        </text>
      </view>
      <u-code-input v-model="newCode"></u-code-input>
      <u-code seconds="60" ref="newCodeTimer" @change="newCodeTimerChange" startText="发送验证码" endText="重新发送" changeText="重新发送 (Xs)"></u-code>
      <view class="page-body-2-timer">
        <text class="page-body-2-timer-label">没收到验证码？</text>
        <text :class="{'page-body-2-timer-resend': true, 'page-body-2-timer-resend-disabled': newCodeTimerTip !== '重新发送'}" @click="sendNewEmailCode">
          {{ newCodeTimerTip }}
        </text>
      </view>
      <u-button color="#505bde" text="下一步" @click="onNewEmailCheck" :disabled="newCode.length !== 6"></u-button>
    </view>
  </view>
</template>

<script>
let emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
import {mapGetters} from "vuex";
import {checkGoogle, checkTxPassword, sendEmailCode, updateEmail, verifyEmailCode} from "../../api/api";
import PasswordInput from "../../components/password-input/password-input"

export default {
  components: {
    PasswordInput
  },
  data() {
    return {
      /**
       * 是否已经绑定
       */
      bind: undefined,
      /**
       * 验证方式: email,payPassword,googleCode
       */
      checkMod: '',
      pageIndex: 0,
      oldCode: '',
      newCode: '',
      oldCodeTimerTip: '',
      newCodeTimerTip: '',
      otherForm: {
        payPassword: '',
        googleCode: ''
      },
      newForm: {
        email: ''
      }
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    user() {
      return this.userInfo.userInfo || {}
    },
    title() {
      switch (this.bind) {
        case true:
          return '变更邮箱'
        case false:
          return '绑定邮箱'
      }
    },
    otherNuxtDisabled() {
      return !(this.otherForm.googleCode.length === 6 || this.otherForm.payPassword.length === 6);
    },
    newEmailNextDisabled() {
      return !emailReg.test(this.newForm.email)
    },
    newRules() {
      return {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: ["blur", "change"]
          },
          {
            pattern: emailReg,
            transform(value) {
              return String(value);
            },
            message: "请输入正确格式的邮箱",
            trigger: ["blur", "change"]
          },
        ]
      }
    }
  },
  created() {
    this.bind = !!this.user.email
    this.pageIndex = this.bind ? 0 : 3
  },
  methods: {
    oldCodeTimerChange(text) {
      this.oldCodeTimerTip = text
    },
    newCodeTimerChange(text) {
      this.newCodeTimerTip = text
    },
    /**
     * 进入客服页面
     */
    toCustomer() {
      uni.navigateTo({
        url: '/pages/customer/index'
      })
    },
    /**
     * 发送旧邮箱验证码
     */
    sendOldEmailCode() {
      if (!this.$refs.oldCodeTimer || this.$refs.oldCodeTimer.canGetCode) {
        sendEmailCode({
          email: this.user.email,
          type: 3
        }).then(res => {
          if (res.code.toString() === '0') {
            this.pageIndex = 2
            this.$nextTick(() => {
              this.$refs.oldCodeTimer && this.$refs.oldCodeTimer.start();
            })
          }
        })
      }
    },
    /**
     * 发送新邮箱验证码
     */
    sendNewEmailCode() {
      if (!this.$refs.newCodeTimer || this.$refs.newCodeTimer.canGetCode) {
        sendEmailCode({
          email: this.newForm.email,
          type: 2
        }).then(res => {
          if (res.code.toString() === '0') {
            this.pageIndex = 4
            this.$nextTick(() => {
              this.$refs.newCodeTimer && this.$refs.newCodeTimer.start();
            })
          }
        })
      }
    },
    /**
     * 验证旧邮箱验证码
     */
    onOldEmailCheck() {
      verifyEmailCode({
        email: this.user.email,
        code: this.oldCode,
        type: 3
      }).then(res => {
        if (res.code.toString() === '0') {
          this.checkMod = 'email'
          this.pageIndex = 3
        }
      })
    },
    /**
     * 验证新邮箱验证码
     */
    onNewEmailCheck() {
      verifyEmailCode({
        email: this.newForm.email,
        code: this.newCode,
        type: 2
      }).then(res => {
        if (res.code.toString() === '0') {
          this.onBindNewEmail()
        }
      })
    },
    onBindNewEmail() {
      updateEmail({
        email: this.newForm.email
      }).then(res => {
        if (res.code.toString() === '0') {
          uni.navigateTo({
            url: '/pages/safety/success?type=email'
          })
        }
      })
    },
    /**
     * 执行其他验证方式
     */
    onOtherCheck() {
      if (this.otherForm.payPassword && this.otherForm.payPassword.length === 6) {
        checkTxPassword({
          txPwd: this.otherForm.payPassword
        }).then(res => {
          if (res.code.toString() === '0') {
            this.checkMod = 'payPassword'
            this.pageIndex = 3
          }
        })
      } else if (this.otherForm.googleCode && this.otherForm.googleCode.length === 6) {
        checkGoogle({
          codes: this.otherForm.googleCode
        }).then(res => {
          if (res.code.toString() === '0') {
            this.checkMod = 'googleCode'
            this.pageIndex = 3
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
::v-deep .u-form-item__body__right__content__slot {
  display: block !important;
  padding-top: 50rpx;
}

::v-deep .u-border-bottom {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

::v-deep .u-input__content__subfix-icon {
  margin-left: 20rpx;
}

.page {
  min-height: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  &-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    &-0 {
      padding: 0 40rpx;

      &-email {
        padding: 100rpx 0;
        text-align: center;
        display: flex;
        justify-content: center;

        &-text {
          font-size: 32rpx;
          color: #505bde;
          font-weight: 500;
          text-align: center;
        }
      }

      &-other {
        margin-top: 40rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40rpx;

        &-label {
          font-size: 28rpx;
          color: #333333;
        }

        &-link {
          font-size: 28rpx;
          color: #0277ff;
        }
      }
    }

    &-1 {
      padding: 0 20rpx;

      &-form {
        width: 100%;
        padding: 0 20rpx 60rpx;
        box-sizing: border-box;
      }

      &-tip {
        margin-top: 40rpx;
        width: 710rpx;
        height: 80rpx;
        background-color: #e6f2ff;
        border-radius: 10rpx;
        display: flex;
        padding: 0 10rpx;
        align-items: center;
        justify-content: flex-start;

        &-text {
          color: #0277ff;
          font-size: 28rpx;
        }
      }
    }

    &-2 {
      padding: 0 40rpx;

      &-email {
        padding-top: 60rpx;
        padding-bottom: 40rpx;
        text-align: center;
        display: flex;
        justify-content: center;

        &-text {
          font-size: 32rpx;
          color: #505bde;
          font-weight: 500;
          text-align: center;
        }
      }

      &-timer {
        padding-top: 80rpx;
        padding-bottom: 40rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40rpx;

        &-label {
        }

        &-link {
        }

        &-label {
          font-size: 28rpx;
          color: #333333;
        }


        &-resend {
          font-size: 28rpx;
          color: #0277ff;

          &-disabled {
            color: #999999;
          }
        }
      }
    }

    &-3 {
      padding: 0 40rpx;

      &-form {
        width: 100%;
        padding: 0 0 60rpx;
        box-sizing: border-box;
      }
    }
  }
}
</style>
