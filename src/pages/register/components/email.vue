<template>
  <view class="mobile-view">
    <u-form
      labelWidth="0"
      class="form"
      :model="form"
      ref="form"
      :rules="rules"
    >
      <u-form-item borderBottom prop="email">
        <view class="item">
          <u-text color="#505bde" text="电子邮箱"></u-text>
          <u-input clearable v-model="form.email" placeholder="请输入电子邮箱"></u-input>
        </view>
      </u-form-item>
      <u-form-item prop="selfCaptcha" borderBottom>
        <view class="item">
          <u-text color="#505bde" text="验证码"></u-text>
          <u-input clearable type="text" placeholder="请输入右方验证码" v-model="form.selfCaptcha">
            <template slot="suffix">
              <view class="flex-box" @click="getCaptcha">
                <u-image
                  mode="aspectFit"
                  :src="src"
                  width="110px"
                  height="40px"
                ></u-image>
                <u-image
                  src="/static/icons/reload.svg"
                  width="24px"
                  height="24px"
                ></u-image>
              </view>
            </template>
          </u-input>
        </view>
      </u-form-item>
      <u-form-item borderBottom prop="captcha">
        <view class="item">
          <u-text color="#505bde" text="邮箱验证码"></u-text>
          <u-input clearable type="number" v-model="form.captcha" placeholder="请输入邮箱验证码">
            <template slot="suffix">
              <u-code
                ref="uCode"
                @change="codeChange"
                seconds="60"
                changeText="x秒后重新获取"
                startText="获取验证码"
                endText="重新获取验证码"
              ></u-code>
              <u-button
                :disabled="buttonDisabled"
                class="get-button"
                @tap="getCode"
                type="success"
                size="small"
              >
                {{ tips }}
              </u-button>
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
        下一步
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
  </view>
</template>

<script>
let emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
import {BASE_ADDRESS, AREA_CODE} from "@/config/api";
import {
  captcha,
  sendEmailCode,
  sendSMS,
  verifyEmailCode,
  verifySMS,
} from "@/api/api";
import storage from "../../../utils/storage";

export default {
  name: "email",
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
        email: "",
        captcha: "",
        areaCode: "+86",
        selfCaptcha: "",
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
        selfCaptcha: [
          {
            required: true,
            message: "请输入右方验证码",
            trigger: ["blur", "change"],
          },
        ],
        captcha: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.form.selfCaptcha) {
                if (value) {
                  callback();
                } else {
                  callback(new Error("请先输入验证码"));
                }
              } else {
                callback(new Error("请先输入图形验证码,方可发送手机验证码"));
              }
            },
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    this.getCaptcha();
  },
  mounted() {
    this.$nextTick(() => {
      this.checkCaptcha();
    });
  },
  computed: {
    isDisabled() {
      let phoneReg = /^\d*$/g;
      const {email, captcha, selfCaptcha} = this.form;
      return !(selfCaptcha && captcha && emailReg.test(email) && !this.loading);
    },
    // 获取验证码按钮禁用
    buttonDisabled() {
      const {email, selfCaptcha} = this.form;
      const count = parseInt(this.tips);
      return !isNaN(count) || !emailReg.test(email) || !selfCaptcha;
    },
  },
  watch: {
    "form.selfCaptcha"() {
      this.checkCaptcha();
    },
  },
  methods: {
    checkCaptcha() {
      console.error(this.$refs.form);
      this.$refs.form && this.$refs.form.validateField("captcha");
    },
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
        captcha: this.form.selfCaptcha,
        email: this.form.email,
        type: 1,
      };
      sendEmailCode(params)
        .then((res) => {
          if (res.code.toString() === '0') {
            this.showTip("验证码已发送，请留意信息！");
            this.$refs.uCode.start();
          }
          this.getCaptcha();
        })
        .catch(() => {
          this.getCaptcha();
        });
    },
    codeChange(text) {
      this.tips = text;
    },
    getCaptcha() {
      this.src = BASE_ADDRESS + captcha();
      // console.log(this.src);
    },
    // 下一步
    toNext() {
      const {isDisabled, form, loading} = this;

      if (isDisabled || loading) return;
      const params = {
        code: form.captcha,
        email: form.email,
        type: 1,
      };
      this.loading = true;
      verifyEmailCode(params)
        .then((res) => {
          if (res.code.toString() === '0') {
            const data = {
              type: "email", // 注册类型
              captcha: form.captcha,
              email: form.email,
              inviteCode: this.inviteCode,
            };
            storage.set("REGISTER_INFO", JSON.stringify(data));
            this.router("pages/register/next");
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
}

.mobile-view {
  margin: 20px 0 30px;
}

.get-button {
  width: 136px;
  height: 35px;
  font-size: 15px;
  background: #505bde;
  border-color: #505bde;
}

.login-button {
  background: #505bde;
  border-color: #505bde;
  margin-top: 30px;
}

.u-button--disabled {
  background: #cccccc 0 0 no-repeat padding-box;
  border: none;
  opacity: 1;
}
</style>
