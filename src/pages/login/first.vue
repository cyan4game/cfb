<template>
  <view class="page">
    <u-sticky offsetTop="0" customNavHeight="0">
      <u-navbar :title="title" height="50px" :titleStyle="{ color: '#fff' }" placeholder bgColor="#505bde">
        <view class="u-nav-slot" slot="left"></view>
        <view class="u-nav-slot" slot="right">
          <u-image
              @click="router('pages/customer/meiqia')"
              :showLoading="true"
              src="/static/icons/customer.svg"
              width="24px"
              height="24px"
          ></u-image>
        </view>
      </u-navbar>
    </u-sticky>
    <view class="page-body" v-if="page === 0">
      <u-form class="page-body-form" :model="form" ref="passwordForm" :rules="passwordRules">
        <u-form-item prop="oldPassword" borderBottom>
          <view class="page-body-form-item">
            <text class="page-body-form-item-label">旧密码</text>
            <password-input
                password
                v-model="form.oldPassword"
                placeholder="8-20位字母和数字"
            ></password-input>
          </view>
        </u-form-item>
        <u-form-item prop="password1" borderBottom>
          <view class="page-body-form-item">
            <text class="page-body-form-item-label">新密码</text>
            <password-input
                password
                v-model="form.password1"
                placeholder="8-20位字母和数字,不可与原密码相同"
            ></password-input>
          </view>
        </u-form-item>
        <u-form-item prop="password2" borderBottom>
          <view class="page-body-form-item">
            <text class="page-body-form-item-label">确认新密码</text>
            <password-input
                password
                v-model="form.password2"
                placeholder="8-20位字母和数字"
            ></password-input>
          </view>
        </u-form-item>
      </u-form>
      <u-button text="下一步" color="#505bde" @click="onPasswordNext"></u-button>
    </view>
    <view class="page-body" v-if="page === 1">
      <u-form class="page-body-form" :model="form" ref="payPasswordForm" :rules="payPasswordRules">
        <u-form-item prop="payPassword1">
          <view class="page-body-form-item">
            <text class="page-body-form-item-label">支付密码</text>
            <u-code-input dot class="page-body-form-item-input" v-model="form.payPassword1"></u-code-input>
          </view>
        </u-form-item>
        <u-form-item prop="payPassword2">
          <view class="page-body-form-item">
            <text class="page-body-form-item-label">确认支付密码</text>
            <u-code-input dot class="page-body-form-item-input" v-model="form.payPassword2"></u-code-input>
          </view>
        </u-form-item>
      </u-form>
      <u-button text="下一步" color="#505bde" @click="onPayPasswordNext"></u-button>
    </view>
    <view class="page-body" v-if="page === 2">
      <u-alert
          fontSize="28rpx"
          class="page-body-google-tip"
          type="error"
          title="您需要确保您已经安装了谷歌身份验证器APP (Google Authenticator)"
      ></u-alert>
      <u-alert
          fontSize="28rpx"
          class="page-body-google-tip"
          type="info"
          description="如果您是大陆用户，您可能无法在手机自带应用市场获取到此应用，您可以从其他地方下载安装"
      ></u-alert>
      <u-button class="btn-next" text="下一步" color="#505bde" @click="page = 3"></u-button>
      <u-button class="btn-next" plain text="跳过" color="#505bde" @click="toSuccess"></u-button>
    </view>
    <view class="page-body" v-if="page === 3">
      <u-alert
      title="非常重要："
      type="error"
      class="page-body-google-tip"
      description="请备份以下32位秘钥。并保存在您认为安全的地方。在手机丢失/谷歌身份验证器被异常卸载的情况下，您可以通过此秘钥回复。"
      ></u-alert>
      <text class="page-body-google-tip-2">请将以下秘钥复制到您的谷歌验证器</text>
      <qrcode
          class="page-body-qrcode"
          size="145"
          ref="qrcode"
          canvas-id="qrcode"
          :value="link"
      ></qrcode>
      <text class="page-body-key">{{ secret }}</text>
      <u-button class="btn" @click="handleCopy(secret)" type="primary" color="#505bde" text="复制"></u-button>
      <text class="page-body-google-tip-3">谷歌验证码</text>
      <u-code-input dot v-model="googleCode" :maxlength="6" space="45rpx"></u-code-input>
      <u-button class="btn-next" @click="handleBind" text="完成" color="#505bde"></u-button>
    </view>
  </view>
</template>

<script>
import {mapGetters} from "vuex";
import {firstLoginRestPwd, googleAuth, googleQR} from "../../api/api";
import PasswordInput from "../../components/password-input/password-input"
import qrcode from '@/common/uQRCode/components/u-qrcode/u-qrcode.vue'


export default {
  components: {PasswordInput, qrcode},
  data() {
    return {
      page: 0,
      secret: '',
      link: '',
      googleCode: '',
      form: {
        oldPassword: '',
        password1: '',
        password2: '',
        payPassword1: '',
        payPassword2: '',
      }
    }
  },
  onShow(options) {
    this.page = 0
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    user() {
      return this.userInfo.userInfo || {}
    },
    title() {
      switch (this.page) {
        case 0:
          return '首次登录重置密码'
        case 1:
          return '首次登录设置支付密码'
        case 2:
        case 3:
          return '设置谷歌验证器'
      }
    },
    passwordRules() {
      return {
        oldPassword: [{required: true, pattern: /^[\dA-z]{8,20}$/g, message: "请输入8-20位登陆密码", trigger: ['blur']}],
        password1: [
          {required: true, pattern: /^[\dA-z]{8,20}$/g, message: "请输入8-20位字母和数字", trigger: ['blur']},
          {
            validator: (rule, value, callback) => {
              if (value === this.form.oldPassword) {
                callback('不可与原密码相同')
              } else {
                callback()
              }
            }, trigger: ['blur']
          }
        ],
        password2: [
          {required: true, pattern: /^[\dA-z]{8,20}$/g, message: "请输入8-20位字母和数字", trigger: ['blur']},
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password1) {
                callback('两次输入的密码不一致')
              } else {
                callback()
              }
            }, trigger: ['blur']
          }
        ],
      }
    },
    payPasswordRules() {
      return {
        payPassword1: [{required: true, pattern: /^\d{6}$/g, message: "请输入6位支付密码", trigger: ['blur', 'change']}],
        payPassword2: [
          {required: true, pattern: /^\d{6}$/g, message: "请输入6位支付密码", trigger: ['blur', 'change']},
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.payPassword1) {
                callback('两次输入的密码不一致')
              } else {
                callback()
              }
            }, trigger: ['blur', 'change']
          }
        ],
      }
    }
  },
  watch: {
    page() {
      if (this.page === 3) {
        googleQR().then(res => {
          if (res.code.toString() === '0') {
            this.secret = res.data.secret
            this.link = res.data.link
          }
        }).catch(_ => {
          console.error(_)
        })
      }
    }
  },
  methods: {
    toSuccess() {
      uni.reLaunch({
        url: '/pages/login/success'
      })
    },
    handleBind() {
      uni.showLoading({
        title: '请稍后...',
        mask: true
      })
      googleAuth({codes: this.googleCode}).then(({code, message}) => {
        uni.hideLoading()
        if (code === "0") {
          this.toSuccess()
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
    onPasswordNext() {
      this.$refs.passwordForm && this.$refs.passwordForm.validate().then(res => {
        this.page = 1
      }).catch(_ => {

      })
    },
    onPayPasswordNext() {
      this.$refs.payPasswordForm && this.$refs.payPasswordForm.validate().then(res => {
        firstLoginRestPwd({
          confirmPayPwd: this.form.payPassword2,
          confirmPwd: this.form.password2,
          newPwd: this.form.password1,
          oldPwd: this.form.oldPassword,
          payPwd: this.form.payPassword1
        }).then(({code, message, data}) => {
          if (code === '0') {
            uni.showToast({
              icon: 'none',
              title: '设置登录密码和支付密码成功！'
            })
            this.page = 2
          } else if (message === '原密码不匹配') {
            this.page = 0
          }
        })
      }).catch(_ => {
        console.error(_)
      })
    }
  }
}
</script>

<style lang="scss">
::v-deep .u-form-item__body__right__message {
  margin-left: 0 !important;
}

::v-deep .u-form-item__body {
  padding-bottom: 0 !important;
}

.page {
  min-height: 100%;
  background-color: #ffffff;

  &-body {
    padding: 0 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .btn-next {
      margin-top: 40rpx;
    }

    &-key {
      font-size: 28rpx;
      color: #505bde;
      margin: 20rpx 0;
      text-align: center;
      display: block;
      height: 40rpx;
      line-height: 40rpx;
    }

    &-qrcode {
      width: 290rpx;
      height: 290rpx;
      display: block;
      margin: 20rpx 0;
    }

    &-google-tip {
      margin-top: 40rpx;

      &-2 {
        font-size: 32rpx;
        font-weight: bold;
        color: #505bde;
        margin: 40rpx 0;
        text-align: center;
        width: 100%;
        display: block;
      }

      &-3 {
        font-size: 32rpx;
        font-weight: bold;
        color: #505bde;
        margin: 40rpx 0;
        text-align: center;
      }
    }

    &-form {
      margin-bottom: 36rpx;
      width: 100%;

      &-item {
        width: 100%;

        &-label {
          color: #505bde;
          font-size: 32rpx;
        }

        &-input {
          margin-top: 36rpx;
          //justify-content: center;
        }
      }
    }
  }
}
</style>
