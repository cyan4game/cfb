<template>
  <view class="mobile-view">
    <u-form labelWidth="0" class="form" :model="form" ref="form" :rules="rules">
      <u-form-item prop="phone" class="item-box">
        <view class="item">
          <!-- <u-text color="#505bde" text="手机号码"></u-text> -->
          <u-row class="item-content">
            <u-col span="2">
              <u-text :text="form.areaCode" color="#505bde" suffixIcon="arrow-down" @click="showAreaCode = true"
                :iconStyle="{
                  fontSize: '14px',
                  color: '#505bde',
                }"></u-text>
            </u-col>
            <u-col offset="1" span="9">
              <u-input clearable type="number" placeholder="请输入手机号码" v-model="form.phone"></u-input>
            </u-col>
          </u-row>
        </view>
      </u-form-item>
      <u-form-item prop="captcha" class="item-box">
        <view class="item">
          <!-- <u-text color="#505bde" text="手机验证码"></u-text> -->
          <u-input class="item-content" clearable type="number" v-model="form.captcha" placeholder="请输入手机验证码">
            <template slot="suffix">
              <u-code ref="uCode" @change="codeChange" seconds="60" changeText="x秒后重新获取" startText="获取验证码"
                endText="重新获取验证码"></u-code>
              <u-button :disabled="buttonDisabled" class="get-button" :style="{ color: buttonDisabled ? '#999' : '#3A9861' }"
                @tap="getCode" type="success" size="small">{{ tips }}
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


    <!-- 提示弹窗 -->
    <!-- <tip-dialog ref="dialog" :title="'提示'" :btn="'确认'">
      <template #content>
        <view>登录时间：10:22（UTC+0）</view>
        <view>登录设备：ACE8001(Android)</view>
        <view>若另一台设备登录成功，您将被强制下线。</view>
      </template>
    </tip-dialog> -->
  </view>
</template>

<script>
const phoneReg = /^\d*$/g;
import { BASE_ADDRESS, AREA_CODE } from "@/config/api";
import { sendSMS, phoneRegister } from "@/api/api";
import storage from "../../../utils/storage";

export default {
  name: "mobile",
  props: {
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
        phone: "",
        captcha: "",
        areaCode: "+86",
      },
      loading: false,
      rules: {
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^\d*$/g,
            transform(value) {
              return String(value);
            },
            message: "手机号只能包含数字",
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
      const { phone, captcha, areaCode } = this.form;
      return !(
        captcha &&
        areaCode &&
        phoneReg.test(phone) &&
        !this.loading
      );
    },
    // 获取验证码按钮禁用
    buttonDisabled() {
      const { phone } = this.form;
      let phoneReg = /^\d+$/g;
      // if(phoneReg.test(phone)){}
      const count = parseInt(this.tips);
      return !isNaN(count) || !phoneReg.test(phone) || this.loading;
    },
  },
  methods: {
    handleAreaCodeClose() {
      this.showAreaCode = false;
    },
    handleAreaCodeConfirm(e) {
      this.form.areaCode = "+" + e.value[0].split("+")[1];
      this.showAreaCode = false;
    },
    getCode() {
      if (this.buttonDisabled) return;
      const params = {
        countryCode: this.form.areaCode,
        phoneNumber: this.form.phone,
      };
      this.loading = true
      sendSMS(params)
        .then((res) => {
          if (res.code.toString() === '200') {
            this.showTip("验证码已发送，请留意信息！");
            this.$refs.uCode.start();
          }
        }).finally(() => {
          this.loading = false;
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
        countryCode: form.areaCode,
        deviceName: uni.getDeviceInfo().deviceModel,
        deviceType: 'phone',
        phoneNumber: form.phone,
      };
      this.loading = true;
      phoneRegister(params)
        .then((res) => {
          console.error('登录', res)
          if (res.code.toString() === '200') {
            // const data = {
            //   type: "mobile", // 注册类型
            //   captcha: form.captcha,
            //   internationalCode: form.areaCode,
            //   mobilePhone: form.phone,
            //   inviteCode: this.inviteCode,
            // };
            // storage.set("REGISTER_INFO", JSON.stringify(data));
            // this.router("pages/register/next");
          }
        }).finally(() => {
          this.loading = false;
        })
    },
  }
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
