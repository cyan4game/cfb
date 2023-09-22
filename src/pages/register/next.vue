<template>
  <view class="mobile-view">
    <u-form class="form" :model="form" ref="form" :rules="rules">
      <u-form-item borderBottom prop="nickname">
        <view class="item">
          <u-text color="#505bde" text="昵称"></u-text>
          <u-input placeholder="请输入昵称，限制6-12中英文混字" clearable v-model="form.nickname"></u-input>
        </view>
      </u-form-item>
      <u-form-item prop="password" borderBottom>
        <view class="item">
          <u-text color="#505bde" text="密码"></u-text>
          <password-input v-model="form.password" placeholder="请输入密码，限制8-20英数字混合字符"></password-input>
        </view>
      </u-form-item>
      <u-form-item prop="confirmPassword" borderBottom>
        <view class="item">
          <u-text color="#505bde" text="确认密码"></u-text>
          <password-input v-model="form.confirmPassword" placeholder="请再次输入密码"></password-input>
        </view>
      </u-form-item>
      <u-button :disabled="isDisabled" class="login-button" @click="toNext" type="primary">
        下一步
      </u-button>
    </u-form>
  </view>
</template>

<script>
const nickReg = /^[\u4e00-\u9fa5A-z\d]{6,12}$/
const pawReg = /^(?!^\d+$)(?!^[A-z]+$)[\dA-z]{8,20}$/
import storage from "../../utils/storage";
import {register} from "../../api/api";
import {AREA_CODE} from "../../config/api";
import PasswordInput from "../../components/password-input/password-input"

export default {
  components: {
    PasswordInput
  },
  data() {
    return {
      showAreaCode: false,
      showConfirmPassWord: false,
      areaCode: AREA_CODE,
      REGISTER_INFO: {},
      form: {
        nickname: '',
        password: '',
        areaCode: '+86',
        confirmPassword: ""
      },
      rules: {
        'nickname': [
          {
            required: true,
            message: '此为必填字段',
            // blur和change事件触发检验
            trigger: ['blur', 'change']
          },
          {
            pattern: nickReg,
            message: '限制6-12中英文',
            trigger: ['blur', 'change']
          },
        ],
        'password': [
          {
            required: true,
            message: '此为必填字段',
            trigger: ['blur', 'change'],
          },
          {
            pattern: pawReg,
            message: '限制8-20英数混合字符',
            trigger: ['blur', 'change']
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: '此为必填字段',
            trigger: ['blur', 'change'],
          },
          {
            pattern: pawReg,
            message: '限制8-20英数混合字符,并且密码保持一致',
            trigger: ['blur', 'change']
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return value === this.form.password
            },
            message: '密码请保持一致',
            // 触发器可以同时用blur和change
            trigger: ['change', 'blur'],
          }
        ]
      },
    }
  },
  onShow() {
    const REGISTER_INFO = storage.get('REGISTER_INFO');
    if (REGISTER_INFO) {
      this.REGISTER_INFO = JSON.parse(REGISTER_INFO)
    } else this.router('pages/register/index')
  },
  computed: {
    isDisabled() {
      const {nickname, password, confirmPassword} = this.form;
      return !(nickReg.test(nickname) && pawReg.test(password) && pawReg.test(confirmPassword) && password === confirmPassword);
    }
  },

  methods: {
    handleAreaCodeClose() {
      this.showAreaCode = false
    },
    handleAreaCodeConfirm(e) {
      this.form.areaCode = '+' + e.value[0].split('+')[1]
      this.showAreaCode = false
    },
    toNext() {
      const {captcha, internationalCode, mobilePhone, email, inviteCode} = this.REGISTER_INFO
      const {nickname, password} = this.form
      const params = {captcha, internationalCode, nickname, password}
      if (mobilePhone) params.mobilePhone = mobilePhone
      if (email) params.email = email
      if (inviteCode) params.inviteCode = inviteCode
      uni.showLoading({
        title: '提交中...',
        mask: true
      })
      register(params).then(res => {
        uni.hideLoading()
        if (res.code.toString() === '0') {
          this.router({
            url: 'pages/login/index',
            params: {type: 'mobile', account: mobilePhone}
          })
        }
      }).catch(_ => {
        console.error(_)
        uni.hideLoading()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
}

.mobile-view {
  padding: 45px 20px;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
}

.login-button {
  background: #505bde;
  border-color: #505bde;
  margin-top: 30px;
}

.u-button--disabled {
  background: #cccccc 0% 0% no-repeat padding-box;
  border: none;
  opacity: 1;
}
</style>
