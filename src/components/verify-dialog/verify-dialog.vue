<!-- 短信和邮箱验证弹框 -->
<template>
  <uni-popup
    ref="popup"
    type="bottom"
    :mask-click="false"
    :is-mask-click="false"
  >
    <view
      class="msg-doalog"
      :style="{ height: password ? '750rpx' : '600rpx', bottom: paddingBottom ? '160rpx' : '' }"
    >
      <view class="title">
        <text>安全验证</text>
        <view class="close" @click="close"
          ><u-image
            mode="contain"
            src="/static/images/index/close.png"
            width="24rpx"
            height="24rpx"
          ></u-image
        ></view>
      </view>

      <!-- 已绑定了邮箱和手机 -->
      <template v-if="userInfo.phoneNumber">
        <u-form :model="checkForm" ref="form2" class="form2">
          <!-- <u-form-item class="item" prop="codeEmail">
                        <view class="item">
                            <u-text text="邮箱验证"></u-text>
                            <u-input class="ipt" :type="'text'" placeholder="请输入邮箱验证码" v-model="checkForm.codeEmail">
                                <template slot="suffix">
                                    <view class="code-btn" :class="{ 'dis-btn': emailTimedown }" @click="sendCode('email')">
                                        {{
                                            emailTimedown ? `${emailTimedown}秒` : '发送验证码' }}</view>
                                </template>
                            </u-input>
                        </view>
                    </u-form-item> -->
          <u-form-item class="item" prop="codePhone">
            <view class="item">
              <view>手机验证</view>
              <view class="phone">{{ hiddenPhone(userInfo.phoneNumber) }}</view>
              <u-input
                class="ipt"
                :type="'text'"
                placeholder="请输入手机验证码"
                v-model="checkForm.codePhone"
              >
                <template slot="suffix">
                  <view
                    class="code-btn"
                    :class="{ 'dis-btn': phoneTimedown }"
                    @click="sendCode('phone')"
                  >
                    {{
                      phoneTimedown ? `${phoneTimedown}秒` : "发送验证码"
                    }}</view
                  >
                </template>
              </u-input>
            </view>
          </u-form-item>
          <u-form-item class="item" prop="payPass" v-if="password">
            <view class="item">
              <view>支付密码</view>
              <u-input
                class="ipt"
                :type="'password'"
                placeholder="请输入支付密码"
                v-model="checkForm.payPass"
              ></u-input>
            </view>
          </u-form-item>
        </u-form>
        <u-button
          @click="goCheck"
          :disabled="!checkForm.codePhone || (password && checkForm.payPass.length != 6 )"
          class="login-button2"
          type="primary"
          text="确认"
        ></u-button>
      </template>

      <!-- 邮箱未绑定 -->
      <!-- <template v-if="!userInfo.email">
                <view class="untip">
                    <text>未绑定邮箱</text>
                    <text class="link" @click="jump('/pages/safety/email')">去绑定</text>
                </view>
            </template> -->

      <!-- 手机未绑定 -->
      <template v-if="!userInfo.phoneNumber">
        <view class="untip">
          <text>未绑定手机</text>
          <text class="link" @click="jump('/pages/safety/mobile')">去绑定</text>
        </view>
      </template>

      <!-- 提现密码未绑定 -->
      <template v-if="password && !userInfo.payPasswordStatus">
        <view class="untip">
          <text>未绑定提现密码</text>
          <text class="link" @click="jump('/pages/setPayPassword/index')"
            >去绑定</text
          >
        </view>
      </template>
    </view>
  </uni-popup>
</template>

<script>
import { mailSecurity, smsSecurity } from "@/api/api";
import storage from "@/utils/storage";
import { hiddenPhone } from "@/utils/utils";

export default {
  name: "msgDialog",
  props: {
    password: {
      // 是否展示提现密码
      type: Boolean,
      default: false,
    },
    paddingBottom: { // 是否是tab页面 底部需要上浮
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userInfo: {},
      checkForm: {
        codeEmail: "",
        codePhone: "",
        payPass: "",
      },
      emailTimedown: 0,
      emailInterval: null,
      emailLoading: false,
      phoneTimedown: 0,
      phoneInterval: null,
      phoneLoading: false,
    };
  },
  beforeDestroy() {
    this.destoryInterval()
  },
  methods: {
    hiddenPhone,
    open() {
      this.userInfo = storage.get("userInfo") || {};
      this.checkForm = {
        codeEmail: "",
        codePhone: "",
        payPass: "",
      };
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
      this.destoryInterval()
    },
    destoryInterval() {
      this.emailTimedown = 0
      this.emailLoading = false
      this.phoneTimedown = 0
      this.phoneLoading = false
      if (this.emailInterval) clearInterval(this.emailInterval);
      if (this.phoneInterval) clearInterval(this.phoneInterval);
    },
    // 验证
    goCheck() {
      this.$emit("success", {
        emailCode: "666666",
        // emailCode: this.checkForm.codeEmail,
        phoneCode: this.checkForm.codePhone,
        payPass: this.checkForm.payPass,
      });
      this.close();
    },
    // 发送验证码
    sendCode(key) {
      if (key == "email") {
        if (this.emailLoading) return;
        if (this.emailTimedown) return;
        this.emailLoading = true;
        mailSecurity()
          .then((res) => {
            if (res.code == 200) {
              uni.showToast({
                title: "邮件已发送",
                icon: "none",
                duration: 2000,
              });
              this.emailTimedown = 59;
              this.emailInterval = setInterval(() => {
                this.emailTimedown--;
                if (this.emailTimedown == 0) {
                  clearInterval(this.emailInterval);
                }
              }, 1000);
            }
          })
          .finally(() => {
            this.emailLoading = false;
          });
      } else {
        if (this.phoneLoading) return;
        if (this.phoneTimedown) return;
        this.phoneLoading = true;
        smsSecurity()
          .then((res) => {
            if (res.code == 200) {
              uni.showToast({
                title: "短信已发送",
                icon: "none",
                duration: 2000,
              });
              this.phoneTimedown = 59;
              this.phoneInterval = setInterval(() => {
                this.phoneTimedown--;
                if (this.phoneTimedown == 0) {
                  clearInterval(this.phoneInterval);
                }
              }, 1000);
            }
          })
          .finally(() => {
            this.phoneLoading = false;
          });
      }
    },

    // 跳转
    jump(name) {
      uni.navigateTo({
        url: name,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.msg-doalog {
  width: 100%;
  height: 600rpx;
  background-color: #fff;
  position: relative;

  .title {
    padding: 60rpx 37rpx 20rpx 63rpx;
    color: #38363b;
    font-size: 36rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .close {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      background-color: #eeeeee;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      color: #888;
    }
  }

  .form2 {
    padding: 30rpx 50rpx;

    .ipt {
      margin-top: 20rpx;
      font-size: 28rpx;
    }

    .code-btn {
      color: #449367;
      font-size: 28rpx;
    }

    .dis-btn {
      color: #7a7a7a;
    }
  }

  .login-button2 {
    background: #449367;
    border-color: #449367;
    width: 451rpx;
    height: 96rpx;
    margin-top: 40rpx;
  }

  .item {
    width: 100%;
    color: #3a3939;
    font-size: 26rpx;
    position: relative;
    .phone {
      position: absolute;
      right: 0;
      color: #cf1a1a;
      font-size: 26rpx;
      top: 0;
    }
    .ipt {
      height: 72rpx;
      background-color: #f1f1f1;
      border-radius: 6rpx;
      display: flex;
      box-sizing: border-box;
      align-items: center;
      justify-content: space-between;
    }
  }

  .untip {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 120rpx;
    font-size: 26rpx;
    .link {
      color: #449367;
      margin-left: 10rpx;
    }
  }
}
</style>
