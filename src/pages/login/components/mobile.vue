<template>
  <view class="mobile-view" style="font-size: 28rpx">
    <u-form labelWidth="0" class="form" :model="form" ref="form" :rules="rules">
      <view class="subtitle">手机号</view>
      <u-form-item prop="phone" class="item-box">
        <view class="item">
          <!-- <u-text color="#343434" text="手机号码"></u-text> -->
          <u-row class="item-content">
            <u-col span="2" style="border-right: 1px solid #848484">
              <u-text
                :text="form.areaCode"
                color="#343434"
                @click="() => $refs.areaCode.open()"
                :iconStyle="{
                  fontSize: '14px',
                  color: '#343434',
                }"
              ></u-text>
            </u-col>
            <u-col offset="1" span="9">
              <u-input
                clearable
                type="number"
                placeholder="请输入手机号码"
                v-model="form.phone"
              ></u-input>
            </u-col>
          </u-row>
        </view>
      </u-form-item>
      <view class="subtitle">验证码</view>
      <u-form-item prop="captcha" class="item-box">
        <view class="item">
          <!-- <u-text color="#343434" text="手机验证码"></u-text> -->
          <u-input
            class="item-content"
            clearable
            type="number"
            v-model="form.captcha"
            placeholder="请输入短信验证码"
          >
            <template slot="suffix">
              <u-code
                ref="uCode"
                @change="codeChange"
                seconds="60"
                changeText="x秒后重新获取"
                startText="发送验证码"
                endText="重新获取验证码"
              ></u-code>
              <text
                :disabled="buttonDisabled"
                class="get-button"
                :style="{
                  color: buttonDisabled ? '#999' : '#3A9861',
                  backgroundColor: 'rgba(0,0,0,0)',
                }"
                @tap="getCode"
                type="success"
                size="small"
                >{{ tips }}
              </text>
            </template>
          </u-input>
        </view>
      </u-form-item>

      <slot :form="form" :isDisabled="isDisabled"></slot>
      <u-button
        :disabled="isDisabled"
        :loading="loading"
        class="login-button"
        @click="toNext"
        type="primary"
      >
        <text style="font-size: 34rpx">登录</text>
      </u-button>
    </u-form>
    <u-picker
      @confirm="handleAreaCodeConfirm"
      @cancel="handleAreaCodeClose"
      @close="handleAreaCodeClose"
      :closeOnClickOverlay="true"
      :show="showAreaCode"
      :columns="areaCode"
    ></u-picker>
    <u-notify ref="uNotify"></u-notify>

    <!-- 提示弹窗 -->
    <!-- <tip-dialog ref="dialog" :title="'提示'" :btn="'确认'">
      <template #content>
        <view>登录时间：10:22（UTC+0）</view>
        <view>登录设备：ACE8001(Android)</view>
        <view>若另一台设备登录成功，您将被强制下线。</view>
      </template>
    </tip-dialog> -->

    <!-- 区号弹窗 -->
    <area-code @sure="item => form.areaCode = item.code" ref="areaCode" />
  </view>
</template>

<script>
import { BASE_ADDRESS, AREA_CODE } from "@/config/api";
import { sendSMS, phoneRegister } from "@/api/api";
import storage from "../../../utils/storage";

const phoneReg = /^\d{7,16}$/;
const chPhoneReg = /^1\d{10}$/;
const phPhoneReg = /^9\d{10}$/;

export default {
  name: "mobile",
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
            trigger: ["blur", "change", "input"],
          },
          // {
          //   pattern: /^\d{7,16}$/,
          //   transform(value) {
          //     return String(value);
          //   },
          //   message: "请输入正确的手机号",
          //   trigger: ["blur", "change"],
          // },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              if (this.form.areaCode == "+86") return chPhoneReg.test(value);
              // if (this.form.areaCode == "+63") return phPhoneReg.test(value);
              return true;
            },
            message: "请输入正确的手机号",
            trigger: ["change", "blur"],
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
      const { phone, captcha, areaCode } = this.form;
      let pass = true;
      if (this.form.areaCode == "+86") pass = chPhoneReg.test(phone);
      // if (this.form.areaCode == "+63") pass = phPhoneReg.test(phone);
      return !(
        pass &&
        captcha.length == 6 &&
        areaCode &&
        phone &&
        // phoneReg.test(phone) &&
        !this.loading
      );
    },
    // 获取验证码按钮禁用
    buttonDisabled() {
      const { phone, areaCode } = this.form;
      const tip = this.tips.substr(0, 1);
      let pass = true;
      if (this.form.areaCode == "+86") pass = chPhoneReg.test(phone);
      // if (this.form.areaCode == "+63") pass = phPhoneReg.test(phone);
      return !(
        pass &&
        areaCode &&
        phone &&
        isNaN(Number(tip)) &&
        // phoneReg.test(phone) &&
        !this.loading
      );
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
      this.loading = true;
      sendSMS(params)
        .then((res) => {
          if (res.code.toString() === "200") {
            this.showTip("验证码已发送");
            this.$refs.uCode.start();
          }
        })
        .finally(() => {
          this.loading = false;
        });
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
        deviceType: "phone",
        phoneNumber: form.phone,
      };
      this.loading = true;
      phoneRegister(params)
        .then((res) => {
          this.router("pages/index/index");
          if (res.code.toString() === "200") {
            const data = {
              ...params,
              ...res.data,
            };
            this.$emit("loginSuccess", data);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.item-box {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 46rpx;
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
    font-size: 28rpx;
  }
}

.mobile-view {
  box-sizing: border-box;
  margin: 53rpx 42rpx 0 46rpx;
}

.get-button {
  width: 222rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 67rpx;
  font-size: 28rpx;
  background: rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0);
  white-space: nowrap;
  ::v-deep .uni-button {
    &::after {
      border: none !important;
    }
  }
  ::v-deep .u-button--disabled {
    background-color: rgba(0, 0, 0, 0) !important;
  }
}

.login-button {
  background: #449367;
  border-color: #449367;
  margin-top: 35rpx;
  font-size: 24rpx;
  width: 451rpx;
  height: 113rpx;
}

.u-button--disabled {
  background: #cccccc 0 0 no-repeat padding-box;
  border: none;
  opacity: 1;
}

.subtitle {
  color: #343434;
  font-size: 32rpx;
  margin-bottom: 26rpx;
}
</style>
