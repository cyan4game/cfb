<!-- 重设手机号 -->
<template>
  <view class="info-page-bg self-body mobile-view">
    <u-navbar :safeAreaInsetTop="false" :title="'重置手机号'" :leftIcon="''" />
    <view class="info-page-content page-box">
      <u-form class="form" :model="form" ref="form" :rules="rules">
        <!-- 旧手机 -->
        <u-form-item prop="oldPhoneNumber">
          <view class="item">
            <u-text color="#7A7A7A" text="旧手机号"></u-text>
            <u-row class="item-content ipt">
              <u-col span="2">
                <u-text
                  class="item-area"
                  :text="form.oldCountryCode"
                  color="#343434"
                  suffixIcon="arrow-down"
                  :iconStyle="{
                    fontSize: '14px',
                    color: '#343434',
                  }"
                ></u-text>
              </u-col>
              <u-col offset="1" span="9">
                <u-input
                  clearable
                  disabled
                  :type="'number'"
                  placeholder="请输入旧手机号"
                  v-model="form.oldPhoneNumber"
                ></u-input>
              </u-col>
            </u-row>
          </view>
        </u-form-item>

        <u-form-item prop="oldVerifyCode">
          <view class="item">
            <u-text color="#7A7A7A" text="验证码"></u-text>
            <view style="display: flex; align-items: center">
              <u-input
                class="ipt"
                type="number"
                :type="'text'"
                placeholder="请输入验证码"
                v-model="form.oldVerifyCode"
              >
              </u-input>
              <view
                class="code-box"
                :class="{ 'display-code': !form.oldPhoneNumber }"
                @click="sendCode('old')"
                >{{ timedown ? `${timedown}秒` : "获取验证码" }}</view
              >
            </view>
          </view>
        </u-form-item>

        <!-- 新手机 -->
        <u-form-item prop="newPhoneNumber">
          <view class="item">
            <u-text color="#7A7A7A" text="新手机号"></u-text>
            <u-row class="item-content ipt">
              <u-col span="2">
                <u-text
                  class="item-area"
                  :text="form.newCountryCode"
                  color="#343434"
                  suffixIcon="arrow-down"
                  @click="() => $refs.newCountryCode.open()"
                  :iconStyle="{
                    fontSize: '14px',
                    color: '#343434',
                  }"
                ></u-text>
              </u-col>
              <u-col offset="1" span="9">
                <u-input
                  clearable
                  :type="'number'"
                  placeholder="请输入新手机号"
                  v-model="form.newPhoneNumber"
                ></u-input>
              </u-col>
            </u-row>
          </view>
        </u-form-item>

        <u-form-item prop="newVerifyCode">
          <view class="item">
            <u-text color="#7A7A7A" text="验证码"></u-text>
            <view style="display: flex; align-items: center">
              <u-input
                class="ipt"
                type="number"
                :type="'text'"
                placeholder="请输入验证码"
                v-model="form.newVerifyCode"
              >
              </u-input>
              <view
                class="code-box"
                :class="{ 'display-code': disabledSms }"
                @click="sendCode('new')"
                >{{ timedown2 ? `${timedown2}秒` : "获取验证码" }}</view
              >
            </view>
          </view>
        </u-form-item>
      </u-form>

      <u-button
        :disabled="isDisabled"
        class="login-button"
        @click="submit"
        type="primary"
      >
        提交
      </u-button>
    </view>

    <!-- 区号弹窗 -->
    <area-code
      @sure="(item) => (form.oldCountryCode = item.code)"
      ref="oldCountryCode"
    />
    <area-code
      @sure="(item) => (form.newCountryCode = item.code)"
      ref="newCountryCode"
    />
  </view>
</template>

<script>
import storage from "@/utils/storage";
import { sendSMS, restPhone } from "@/api/api";
const chPhoneReg = /^1\d{10}$/;

const pawReg = /^[0-9]{6}$/;
export default {
  name: "index",
  data() {
    return {
      loading: false,
      showAreaCode: false,
      form: {
        oldCountryCode: "+86",
        oldPhoneNumber: "",
        oldVerifyCode: "",
        newCountryCode: "+86",
        newPhoneNumber: "",
        newVerifyCode: "",
      },
      timedown: 0,
      timeInterval: null,
      timedown2: 0,
      timeInterval2: null,

      rules: {
        newPhoneNumber: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur", "change", "input"],
          },
          {
            validator: (rule, value, callback) => {
              if (this.form.newCountryCode == "+86") return chPhoneReg.test(value);
              return true;
            },
            message: "请输入正确的手机号",
            trigger: ["change", "blur"],
          },
        ],
        oldVerifyCode: [
          {
            required: true,
            message: "请输入验证码",
            trigger: ["blur", "change"],
          },
        ],
        newVerifyCode: [
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
      if (this.form.newCountryCode == "+86" && !chPhoneReg.test(this.form.newPhoneNumber)) return true
      return !(
        this.form.oldPhoneNumber &&
        this.form.oldVerifyCode &&
        this.form.newPhoneNumber &&
        this.form.newVerifyCode
      );
    },
    disabledSms() {
      return !this.form.newPhoneNumber || ( this.form.newCountryCode == "+86" && !chPhoneReg.test(this.form.newPhoneNumber) )
    }
  },
  onShow() {
    const userInfo = storage.get("userInfo") || {};
    const loginInfo = storage.get("login-info") || {};
    this.form.oldPhoneNumber = loginInfo.phoneNumber || userInfo.phoneNumber
    this.form.oldPhoneNumber = loginInfo.phoneNumber || userInfo.phoneNumber
  },
  methods: {
    // 发送验证码
    sendCode(type = "old") {
      if (this.loading) return;
      if (type == "old") {
        // 旧手机
        if (this.timedown || !this.form.oldPhoneNumber) return;
        const form = {
          countryCode: this.form.oldCountryCode,
          phoneNumber: this.form.oldPhoneNumber,
        };
        this.loading = true;
        uni.showLoading({
          title: '',
          mask: true,
        });
        sendSMS(form)
          .then((res) => {
            if (res.code == 200) {
              uni.showToast({
                title: "短信已发送",
                icon: "none",
                duration: 2000,
              });
              this.timedown = 59;
              this.timeInterval = setInterval(() => {
                this.timedown--;
                if (this.timedown == 0) {
                  clearInterval(this.timeInterval);
                }
              }, 1000);
            }
          })
          .finally(() => {
            this.loading = false;
            uni.hideLoading();
          });
      } else {
        // 新手机
        if (this.timedown2 || !this.form.newPhoneNumber) return;
        const form = {
          countryCode: this.form.newCountryCode,
          phoneNumber: this.form.newPhoneNumber,
        };
        this.loading = true;
        uni.showLoading({
          title: '',
          mask: true,
        });
        sendSMS(form)
          .then((res) => {
            if (res.code == 200) {
              uni.showToast({
                title: "短信已发送",
                icon: "none",
                duration: 2000,
              });
              this.timedown2 = 59;
              this.timeInterval2 = setInterval(() => {
                this.timedown2--;
                if (this.timedown2 == 0) {
                  clearInterval(this.timeInterval2);
                }
              }, 1000);
            }
          })
          .finally(() => {
            this.loading = false;
            uni.hideLoading();
          });
      }
    },
    // 提交
    submit() {
      if (this.disabled || this.loading) return;
      this.loading = true;
      uni.showLoading({
          title: '',
          mask: true,
        });
      restPhone(this.form)
        .then((res) => {
          console.error(res);
          if (res.code == 200) {
            uni.showToast({
              title: "重置成功",
              icon: "none",
              duration: 2000,
            });
            setTimeout(() => {
              uni.reLaunch({
                url: "/pages/login/index",
              });
            }, 1000);
          }
        })
        .finally(() => {
          uni.hideLoading();
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  ::v-deep .u-form-item__body__right__message {
    margin-left: 0!important;
  }
}
.ipt {
  background-color: #f1f1f1;
  height: 72rpx;
  border-radius: 6rpx;
  margin-top: 35rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.code-box {
  height: 74rpx;
  border: 1px solid #7a7a7a;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
  margin-top: 35rpx;
  box-sizing: border-box;
}
.display-code {
  background-color: #f1f1f1;
  color: #999;
  border: 1px solid #ccc;
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
