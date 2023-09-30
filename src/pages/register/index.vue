<template>
  <view class="main-page">
    <!-- <u-navbar
      title="注册"
      height="50px"
      :titleStyle="{ color: '#fff' }"
      placeholder
      bgColor="#505bde"
    >
      <view class="u-nav-slot" @click="routeBack" slot="left">
        <u-image
          src="/static/icons/back.svg"
          width="24px"
          height="24px"
        ></u-image>
      </view>
      <view class="u-nav-slot" slot="right">
        <u-image
          src="/static/icons/customer.svg"
          width="24px"
          height="24px"
        ></u-image>
      </view>
    </u-navbar> -->
    <!-- <u-image
      :showLoading="true"
      src="/static/images/logo.png"
      width="160px"
      height="64px"
      class="flex-box login-logo"
    ></u-image> -->

    <view class="login-bg">
      <u-image
          @click="pageTo"
          :showLoading="true"
          src="/static/icons/customer.svg"
          width="24px"
          height="24px"
          class="service-icon"
        ></u-image>
    </view>

    <view class="login-box">
      <radio-tab :value.sync="menuName" :menuList="menuList"></radio-tab>
      <!--    <component :showTip="showTip" :is="menuName"></component>-->
      <mobile
        :inviteCode="inviteCode"
        :showTip="showTip"
        v-if="menuName === 'mobile'"
      ></mobile>
      <email
        :inviteCode="inviteCode"
        :showTip="showTip"
        v-if="menuName === 'email'"
      ></email>
      <u-text
        align="center"
        @click="router('pages/login/index')"
        type="primary"
        text="已有账号去登录"
      ></u-text>
    </view>
    
    <u-notify ref="uNotify"></u-notify>
  </view>
</template>

<script>
import radioTab from "../login/components/radio-tab";
import mobile from "./components/mobile";
import email from "./components/email";

export default {
  name: "index",
  components: { radioTab, mobile, email },
  data() {
    return {
      menuList: [
        {
          label: "手机注册",
          key: "mobile",
          icon: require("@/static/icons/mobile-default.svg"),
          active: require("@/static/icons/mobile.svg"),
        },
        {
          label: "邮箱注册",
          key: "email",
          icon: require("@/static/icons/email-default.svg"),
          active: require("@/static/icons/email.svg"),
        },
      ],
      menuName: "mobile",
      currentView: "mobile",
      inviteCode: "",
    };
  },
  onLoad(option) {
    if (option.code) {
      this.inviteCode = option.code;
    }
  },
  methods: {
    routeBack() {
      this.router({ type: "back" });
    },
    toNext(isDisabled, form) {
      console.log(isDisabled, form);
    },
    showTip(message) {
      this.$refs.uNotify.show({
        top: 10,
        type: "success",
        color: "#4A9017",
        bgColor: "#D4F4C0",
        message,
        duration: 1500,
        fontSize: 17,
        safeAreaInsetTop: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-page {
  height: 100%;
  box-sizing: border-box;
  background: #fff;

  .login-bg {
    height: 588rpx;
    background-color: #0c1114;
    position: relative;
    .service-icon {
      top: 44rpx;
      right: 40rpx;
      position: absolute;

    }
  }
  .login-box {
    position: relative;
    margin: 30rpx;
    border-radius: 6rpx;
    background-color: #fff;
    top: -288rpx;
    overflow: hidden;
  }

  .login-logo {
    margin-bottom: 40px;
  }
}
</style>
