<template>
  <view class="mobile-view">
    <view class="page-box">
      <u-form class="form" :model="form" ref="form">

        <u-form-item prop="code">
          <view class="item">
            <u-text color="#7A7A7A" text="验证码"></u-text>
            <view style="margin-top: 40rpx;">
              18888888888
            </view>
          </view>
        </u-form-item>
        
        <u-form-item prop="email">
          <view class="item">
            <u-text color="#7A7A7A" text="新手机号"></u-text>
            <u-row class="item-content ipt">
            <u-col span="2">
              <u-text class="item-area" :text="form.areaCode" color="#505bde" suffixIcon="arrow-down" @click="showAreaCode = true"
                :iconStyle="{
                  fontSize: '14px',
                  color: '#505bde',
                }"></u-text>
            </u-col>
            <u-col offset="1" span="9">
              <u-input  clearable :type="'number'" placeholder="请输入新手机号" v-model="form.email"></u-input>
            </u-col>
          </u-row>
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


    <!-- 区号 -->
    <u-picker @confirm="handleAreaCodeConfirm" @cancel="handleAreaCodeClose" @close="handleAreaCodeClose"
      :closeOnClickOverlay="true" :show="showAreaCode" :columns="areaCode"></u-picker>
  </view>
</template>

<script>
import { AREA_CODE } from "@/config/api";

const pawReg = /^[0-9]{6}$/
export default {
  name: "index",
  data() {
    return {
      loading: false,
      showAreaCode: false,
      areaCode: AREA_CODE,
      form: {
        areaCode: '+86',
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
    handleAreaCodeClose() {
      this.showAreaCode = false;
    },
    handleAreaCodeConfirm(e) {
      this.form.areaCode = "+" + e.value[0].split("+")[1];
      this.showAreaCode = false;
    },
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
.item-content {
  height: 96rpx;
}
.item-area {
  padding-left: 20rpx;
  border-right: 1px solid #848484;
}
</style>
