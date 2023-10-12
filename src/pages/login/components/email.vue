<template>
  <view class="mobile-view">
    <u-form labelWidth="0" class="form" :model="form" ref="form" :rules="rules">
      <u-form-item prop="email" class="item-box">
        <view class="item">
          <!-- <u-text color="#505bde" text="电子邮箱"></u-text> -->
          <u-input class="item-content" clearable v-model="form.email" placeholder="请输入电子邮箱"></u-input>
        </view>
      </u-form-item>
      <u-form-item prop="captcha" class="item-box">
        <view class="item">
          <!-- <u-text color="#505bde" text="邮箱验证码"></u-text> -->
          <u-input class="item-content" clearable type="number" v-model="form.captcha" placeholder="请输入邮箱验证码">
            <template slot="suffix">
              <u-code ref="uCode" @change="codeChange" seconds="60" changeText="x秒后重新获取" startText="获取验证码"
                endText="重新获取验证码"></u-code>
              <u-button :disabled="buttonDisabled" :style="{ color: buttonDisabled ? '#999' : '#3A9861' }" class="get-button"
                @tap="getCode" type="success" size="small">
                {{ tips }}
              </u-button>
            </template>
          </u-input>
        </view>
      </u-form-item>

      <slot :form="form" :isDisabled="isDisabled"></slot>
      <u-button :disabled="isDisabled" :loading="loading" class="login-button" @click="toNext" type="primary">
        登录
      </u-button>
    </u-form>
    <u-picker @confirm="handleAreaCodeConfirm" @cancel="handleAreaCodeClose" @close="handleAreaCodeClose"
      :closeOnClickOverlay="true" :show="showAreaCode" :columns="areaCode"></u-picker>
    <u-notify ref="uNotify"></u-notify>
  </view>
</template>

<script>
let emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
import { BASE_ADDRESS, AREA_CODE } from "@/config/api";
import {
  sendEmailCode,
  emailRegister,
} from "@/api/api";
import storage from "../../../utils/storage";

export default {
  name: "email",
  props: {
    protocol: {
      type: Boolean,
    },
    showTip: {
      type: Function,
    },
    inviteCode: {
      type: String,
    },
  },
  data() {
    return {
      showPassWord: false,
      showAreaCode: false,
      areaCode: AREA_CODE,
      tips: "",
      src: "",
      form: {
        email: "",
        captcha: "",
        areaCode: "+86",
        inviteCode: "",
      },
      loading: false,
      rules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: ["blur", "change"],
          },
          {
            pattern: emailReg,
            transform(value) {
              return String(value);
            },
            message: "请输入正确格式的邮箱",
            trigger: ["blur", "change"],
          },
        ],
        captcha: [
          {
            required: true,
            message: "请输入验证码",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    isDisabled() {
      let phoneReg = /^\d*$/g;
      const { email, captcha } = this.form;
      return !(captcha && emailReg.test(email) && !this.loading && this.protocol);
    },
    // 获取验证码按钮禁用
    buttonDisabled() {
      const { email } = this.form;
      const count = parseInt(this.tips);
      return !isNaN(count) || !emailReg.test(email) || this.loading
    },
  },
  methods: {
    handleAreaCodeClose() {
      this.showAreaCode = false;
    },
    handleAreaCodeConfirm(e) {
      console.log(e);
      this.form.areaCode = "+" + e.value[0].split("+")[1];
      this.showAreaCode = false;
    },
    getCode() {
      if (this.buttonDisabled) return;
      const params = {
        email: this.form.email,
      };
      this.loading = true
      sendEmailCode(params)
        .then((res) => {
          if (res.code.toString() === '200') {
            this.showTip("验证码已发送，请留意信息！");
            this.$refs.uCode.start();
          }
        }).finally(() => {
          this.loading = false
        })
    },
    codeChange(text) {
      this.tips = text;
    },
    // 下一步
    toNext() {
      const { isDisabled, form, loading } = this;
      if (isDisabled || loading) return;
      const params = {
        verifyCode: form.captcha,
        email: form.email,
        deviceName: uni.getDeviceInfo().deviceModel,
        deviceType: 'phone',
      };
      this.loading = true;
      emailRegister(params)
        .then((res) => {
          if (res.code.toString() === '200') {
            const data = {
              ...params,
              ...res.data
            }
            this.$emit('loginSuccess', data)
          }
        }).finally(() => {
          this.loading = false
        })
    },
  },
};
</script>

<style lang="scss" scoped>
.item-box {
  padding: 0 36rpx 0;
  width: 100%;
  box-sizing: border-box;
}

.item {
  width: 603rpx;
  height: 112rpx;
  background-color: #f0f0f0;
  margin: 0 auto;
  box-sizing: border-box;
  padding-left: 24rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 6rpx;

  .item-content {
    flex: 1;
  }
}

.mobile-view {
  margin: 20px 0 30px;
}

.get-button {
  width: 222rpx;
  height: 67rpx;
  font-size: 28rpx;
  background: #FFFFFD;
  border-color: #FFFFFD;
  white-space: nowrap;
}

.login-button {
  background: #449367;
  border-color: #449367;
  margin-top: 30px;
  width: 450rpx;
  height: 112rpx;
}

.u-button--disabled {
  background: #cccccc 0 0 no-repeat padding-box;
  border: none;
  opacity: 1;
}
</style>
