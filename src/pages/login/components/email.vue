<template>
  <view class="mobile-view">
    <u-form class="form" :model="form" ref="form" :rules="{}">
      <u-form-item prop="email" borderBottom :rule="rules.email">
        <view class="item">
          <u-text color="#505bde" text="邮箱"></u-text>
          <u-input clearable placeholder="请输入邮箱" v-model="form.email"></u-input>
        </view>
      </u-form-item>
      <u-form-item v-if="hasPassword" prop="password" borderBottom :rule="rules.password">
        <view class="item">
          <u-text color="#505bde" text="密码"></u-text>
          <password-input v-model="form.password"></password-input>
        </view>
      </u-form-item>
      <slot :form="form" :isDisabled="isDisabled"></slot>
    </u-form>
  </view>
</template>

<script>
import PasswordInput from "../../../components/password-input/password-input"

let emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/

export default {
  components: {
    PasswordInput
  },
  props: {
    hasPassword: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showAreaCode: false,
      form: {
        email: '',
        password: '',
      },
      rules: {
        'email': [
          {
            required: true,
            message: '此为必填字段',
            // blur和change事件触发检验
            trigger: ['blur', 'change']
          },
          {
            pattern: emailReg,
            // 正则检验前先将值转为字符串
            // transform(value) {
            //   return String(value);
            // },
            message: '请输入正确格式的邮箱',
            trigger: ['blur', 'change']
          }
        ],
        'password': [
          {
            required: true,
            message: '此为必填字段',
            trigger: ['blur', 'change']
          },
        ]
      },
    }
  },
  onLoad(option) {
    const {type, account} = option
    if (type === 'email' && account) {
      this.form.email = account
    }
  },
  computed: {
    isDisabled() {
      let {email, password} = this.form;
      // console.log(email , password , emailReg.test(email),email&&password&&emailReg.test(email));
      password = this.hasPassword ? password : true
      return !(email && password && emailReg.test(email));
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
}

.mobile-view {
  margin: 20px 0 30px;
}
</style>
