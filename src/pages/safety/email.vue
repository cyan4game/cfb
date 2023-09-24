<template>
  <view class="mobile-view">
    <view class="page-box">
      <u-form class="form" :model="form" ref="form">
        <u-form-item prop="email">
          <view class="item">
            <u-text color="#7A7A7A" text="邮箱"></u-text>
            <u-input class="ipt" :type="'text'" placeholder="请输入邮箱" v-model="form.email"></u-input>
          </view>
        </u-form-item>
        <u-form-item prop="code">
          <view class="item">
            <u-text color="#7A7A7A" text="验证码"></u-text>
            <view style="display: flex;align-items: center;">
              <u-input class="ipt" type="number" :type="'text'" placeholder="请输入验证码" v-model="form.code">
              </u-input>
              <view class="code-box" @click="sendCode">{{ timedown ? `${timedown}秒` : '获取验证码' }}</view>
            </view>

          </view>
        </u-form-item>
      </u-form>

      <u-button :disabled="isDisabled" class="login-button" @click="toNext" type="primary">
        提交
      </u-button>
    </view>


  </view>
</template>

<script>
import { register, firstLoginRestPwd } from "../../api/api";

const pawReg = /^[0-9]{6}$/
export default {
  name: "index",
  data() {
    return {
      loading: false,
      form: {
        email: '',
        code: ""
      },
      timedown: 0,
      timeInterval: null
    }
  },
  computed: {
    isDisabled() {
      const { loading } = this
      const { password, confirmPassword } = this.form;
      if (pawReg.test(password) && pawReg.test(confirmPassword) && password === confirmPassword && !loading) return false
      else return true
    }
  },
  methods: {
    // 发送验证码
    sendCode() {
      if (this.timedown) return
      this.timedown = 59
      this.timeInterval = setInterval(() => {
        this.timedown--
        if (this.timedown == 0) {
          clearInterval(this.timeInterval)
        }
      }, 1000)
    },
    toNext() {
      this.loading = true
      const { form: { password, confirmPassword } } = this
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
  padding-top: 20rpx;
  height: 100%;
  background: #0e1216;
  box-sizing: border-box;
}

.page-box {
  background: #fff;
  border-top-left-radius: 22rpx;
  border-top-right-radius: 22rpx;
  padding: 52rpx 28rpx;
  height: 100%;
}

.ipt {
  background-color: #F1F1F1;
  height: 72rpx;
  border-radius: 6rpx;
  margin-top: 35rpx;
}
.code-box {
    height: 74rpx;
    border: 1px solid #7A7A7A;
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20rpx;
    margin-top: 35rpx;
  }

.login-button {
  background: #449367;
  border-color: #449367;
  position: fixed;
  bottom: 100rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 451rpx;
  height: 96rpx;
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
