<template>
  <view class="page">
    <u-image
      :showLoading="true"
      src="/static/images/logo.png"
      width="160px"
      height="64px"
      class="logo"
    ></u-image>
    <template v-if="page === 0">
      <radio-tab :value.sync="menuName" :menuList="menuList"></radio-tab>
      <template v-if="menuName === 'mobile'">
        <mobile :hasPassword="false">
          <template slot-scope="{ isDisabled, form }">
            <u-button
              :disabled="isDisabled"
              class="login-button"
              @click="sendSMS(isDisabled, form)"
              type="primary"
              text="下一步"
            ></u-button>
          </template>
        </mobile>
      </template>
      <template v-else-if="menuName === 'email'">
        <email :hasPassword="false">
          <template slot-scope="{ isDisabled, form }">
            <u-button
              :disabled="isDisabled"
              class="login-button"
              @click="sendEmailCode(isDisabled, form)"
              type="primary"
              text="下一步"
            ></u-button>
          </template>
        </email>
      </template>
    </template>

    <template v-else-if="page === 1">
      <view class="code-info">
        <text class="code-info-text">
          <template v-if="menuName === 'mobile'">
            已发送至 {{ form.areaCode }} {{ form.phone }}
          </template>
          <template v-else-if="menuName === 'email'">
            已发送至 {{ form.email }}
          </template>
        </text>
      </view>
      <u-code-input style="justify-content: center" focus v-model="code"></u-code-input>
      <u-code seconds="60" ref="codeTimer" @change="codeTimerChange" startText="发送验证码" endText="重新发送" changeText="重新发送 (Xs)"></u-code>
      <view class="code-timer">
        <text class="code-timer-label">没收到验证码？</text>
        <text :class="{'code-timer-resend': true, 'code-timer-resend-disabled': codeTimerTip !== '重新发送'}" @click="resendCode">
          {{ codeTimerTip }}
        </text>
      </view>
      <u-button color="#505bde" text="下一步" @click="onCodeCheck" :disabled="code.length !== 6"></u-button>
    </template>
    <template v-else-if="page === 2">
      <u-form class="page-body-3-form" labelPosition="left" :model="newForm" ref="newForm" labelWidth="0" :rules="newRules">
        <u-form-item prop="newPassword" borderBottom>
          <view style="width: 100%">
            <u-text color="#505bde" size="28rpx" text="请输入新登陆密码"></u-text>
            <u-input type="password" v-model="newForm.newPassword" placeholder="8-20个字母或数字" border="bottom" clearable></u-input>
          </view>
        </u-form-item>
        <u-form-item prop="newPassword2" borderBottom>
          <view style="width: 100%">
            <u-text color="#505bde" size="28rpx" text="请确认新登陆密码"></u-text>
            <u-input type="password" v-model="newForm.newPassword2" placeholder="8-20个字母或数字" border="bottom" clearable></u-input>
          </view>
        </u-form-item>
      </u-form>
      <u-button color="#505bde" text="下一步" @click="onSubmit"></u-button>
    </template>
  </view>
</template>

<script>
import radioTab from "../login/components/radio-tab";
import mobile from "../login/components/mobile";
import email from "../login/components/email";
import {resetPwdByCaptcha, sendEmailCode, sendSMS, verifyEmailCode, verifySMS} from "../../api/api";
import {mapGetters} from "vuex";

export default {
  components: {radioTab, mobile, email},
  data() {
    return {
      page: 0,
      menuName: "mobile",
      menuList: [
        {
          label: "手机登录",
          key: "mobile",
          icon: require("@/static/icons/mobile-default.svg"),
          active: require("@/static/icons/mobile.svg"),
        },
        {
          label: "邮箱登录",
          key: "email",
          icon: require("@/static/icons/email-default.svg"),
          active: require("@/static/icons/email.svg"),
        },
      ],
      form: {},
      code: '',
      codeTimerTip: '',
      newForm: {
        newPassword: '',
        newPassword2: ''
      },
      newRules: {
        newPassword: [
          {required: true, type: 'string', message: '请输入新密码', trigger: ['blur']},
          {pattern: /^[A-z\d]{8,20}$/, message: '密码应为8-20个字母或数字', trigger: ['blur']}
        ],
        newPassword2: [
          {required: true, type: 'string', message: '请输入新密码', trigger: ['blur']},
          {pattern: /^[A-z\d]{8,20}$/, message: '密码应为8-20个字母或数字', trigger: ['blur']},
          {
            validator: (rule, value, callback) => {
              if (value !== this.newForm.newPassword) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            },
            trigger: ['blur']
          }
        ],
      }
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    user() {
      return this.userInfo.userInfo || {}
    },
  },
  onBackPress() {
    if (this.page > 0) {
      this.page--
      return true
    }
  },
  methods: {
    onSubmit() {
      this.$refs.newForm.validate().then((valid) => {
        const data = {
          captcha: this.code,
          password: this.newForm.newPassword,
          confirmPwd: this.newForm.newPassword2,
        }

        switch (this.menuName) {
          case 'mobile':
            data.internationalCode = this.form.areaCode
            data.mobilePhone = this.form.phone
            break
          case 'email':
            data.email = this.form.email
            break
        }

        resetPwdByCaptcha(data).then(res => {
          if (res.code.toString() === '0') {
            uni.navigateTo({
              url: '/pages/safety/success?type=retrievePassword'
            })
          }
        }).catch(_ => {
          console.error(_)
        })
      }).catch(_ => {
        console.error(_)
      })
    },
    onCodeCheck() {
      switch (this.menuName) {
        case 'mobile':
          this.verifySMS()
          break
        case 'email':
          this.verifyEmailCode()
          break
      }
    },
    verifyEmailCode() {
      verifyEmailCode({
        code: this.code,
        email: this.form.email,
        type: 4
      }).then(res => {
        if (res.code.toString() === '0') {
          this.page = 2
        }
      }).catch(_ => {
        console.error(_)
      })
    },
    verifySMS() {
      verifySMS({
        captcha: this.code,
        internationalCode: this.form.areaCode,
        mobilePhone: this.form.phone,
        type: 4
      }).then(res => {
        if (res.code.toString() === '0') {
          this.page = 2
        }
      }).catch(_ => {
        console.error(_)
      })
    },
    codeTimerChange(text) {
      this.codeTimerTip = text
    },
    resendCode() {
      if (!this.$refs.codeTimer || this.$refs.codeTimer.canGetCode) {
        switch (this.menuName) {
          case 'mobile':
            this.sendSMS(false, this.form)
            break
          case 'email':
            this.sendEmailCode(false, this.form)
            break
        }
      }
    },
    sendSMS(isDisabled, form) {
      if (isDisabled) return
      sendSMS({
        internationalCode: form.areaCode,
        mobilePhone: form.phone,
        type: 4
      }).then(res => {
        if (res.code.toString() === '0') {
          this.form = form
          this.page = 1
          this.$nextTick(() => {
            this.$refs.codeTimer && this.$refs.codeTimer.start();
          })
        }
      }).catch(_ => {
        console.error(_)
      })
    },
    sendEmailCode(isDisabled, form) {
      if (isDisabled) return
      sendEmailCode({
        email: form.email,
        type: 4
      }).then(res => {
        if (res.code.toString() === '0') {
          this.form = form
          this.page = 1
          this.$nextTick(() => {
            this.$refs.codeTimer && this.$refs.codeTimer.start();
          })
        }
      }).catch(_ => {
        console.error(_)
      })
    }
  }
}
</script>

<style lang="scss">
.page {
  padding: 40px 20px;
  min-height: 100%;
  background-color: #FFFFFF;

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
  }

  .code-info {
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

  .code-timer {
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
</style>
