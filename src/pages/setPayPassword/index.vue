<template>
  <view class="mobile-view">
    <u-form class="form" :model="form" ref="form" :rules="rules">
      <u-form-item prop="password" borderBottom>
        <view class="item">
          <u-text color="#505bde" text="密码"></u-text>
          <u-input :type="showPassWord ? 'text' : 'password'" placeholder="请输入支付密码,6位数字" v-model="form.password">
            <template slot="suffix">
              <u-icon @click="showPassWord = !showPassWord" :name="showPassWord ? 'eye-off' : 'eye-fill'" size="24"></u-icon>
            </template>
          </u-input>
        </view>
      </u-form-item>
      <u-form-item prop="confirmPassword" borderBottom>
        <view class="item">
          <u-text color="#505bde" text="确认密码"></u-text>
          <u-input type="number" :type="showConfirmPassWord ? 'text' : 'password'" placeholder="请再次输入密码" v-model="form.confirmPassword">
            <template slot="suffix">
              <u-icon @click="showConfirmPassWord = !showConfirmPassWord" :name="showConfirmPassWord ? 'eye-off' : 'eye-fill'" size="24"></u-icon>
            </template>
          </u-input>
        </view>
      </u-form-item>
    </u-form>

    <u-button
      :disabled="isDisabled"
      class="login-button"
      @click="toNext"
      type="primary"
    >
      下一步
    </u-button>
  </view>
</template>

<script>
import {register, firstLoginRestPwd} from "../../api/api";

const pawReg = /^[0-9]{6}$/
export default {
  name: "index",
  data() {
    return {
      showPassWord: false,
      showConfirmPassWord: false,
      loading: false,
      form: {
        password: '',
        confirmPassword: ""
      },
      rules: {

        'password': [
          {
            required: true,
            message: '此为必填字段',
            trigger: ['blur', 'change'],
          },
          {
            pattern: pawReg,
            message: '限制6位数字',
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
            message: '限制6位数字,并且密码保持一致',
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
  },
  computed: {
    isDisabled() {
      const {loading} = this
      const {password, confirmPassword} = this.form;
      if (pawReg.test(password) && pawReg.test(confirmPassword) && password === confirmPassword && !loading) return false
      else return true
    }
  },
  mounted() {
    var a = document.getElementsByClassName("uni-page-head-hd")[0];
    a.style.display = "none";
  },
  methods: {
    toNext() {
      this.loading = true
      const {form: {password, confirmPassword}} = this
      const params = {
        "payPwd": password,
        "confirmPayPwd": confirmPassword
      }
      firstLoginRestPwd(params).then(res => {
        if (res.code.toString() === '0') {
          // this.router({
          //   url:'pages/login/index',
          //   params:{type:'mobile',account:mobilePhone}
          // })
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
};
</script>

<style lang="scss" scoped>
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

.item {
  width: 100%;
}
</style>
