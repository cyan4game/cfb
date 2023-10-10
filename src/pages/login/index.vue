<template>
  <view class="main-page">

    <view class="login-bg">
      <u-image src="/static/images/login/hello.png" width="143rpx" height="41rpx" class="hello-icon"></u-image>
      <u-image src="/static/images/login/welcome.png" width="299rpx" height="42rpx" class="welcome-icon"></u-image>
      <!-- <u-image @click="pageTo" :showLoading="true" src="/static/icons/customer.svg" width="24px" height="24px"
        class="service-icon"></u-image> -->
    </view>

    <view class="login-box">
      <!-- <radio-tab :value.sync="menuName" :menuList="menuList"></radio-tab> -->
      <!--    <component :showTip="showTip" :is="menuName"></component>-->
      <mobile @loginSuccess="loginSuccess" :protocol="protocol" :inviteCode="inviteCode" :showTip="showTip"
        v-if="menuName === 'mobile'"></mobile>
      <!-- <email @loginSuccess="loginSuccess" :protocol="protocol" :inviteCode="inviteCode" :showTip="showTip"
        v-if="menuName === 'email'"></email> -->
      <text style="color: #38363B;font-size: 26rpx;margin: 0 auto;display: block;text-align: center;position: relative;top:-20rpx" @click="router('pages/login/index')" >接收不到短信？</text>
    </view>

    <view class="protocol">
      <checkbox-group @change="changeProtocol">
        <label>
          <checkbox value="protocol" :checked="protocol" />
          我已阅读并同意《财富宝用户协议》
        </label>
      </checkbox-group>
    </view>

  </view>
</template>

<script>
import radioTab from "./components/radio-tab";
import mobile from "./components/mobile";
import email from "./components/email";
import storage from "../../utils/storage";
import { updatUserInfo } from '@/utils/utils'

export default {
  name: "index",
  components: { radioTab, mobile, email },
  data() {
    return {
      protocol: true, // 是否同意协议
      menuList: [
        {
          label: "手机登录",
          key: "mobile",
        },
        // {
        //   label: "邮箱登录",
        //   key: "email",
        // },
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
    async loginSuccess(data) {
      storage.set("tokenName", data.tokenName)
      storage.set("token", data.tokenValue)
      storage.set("LOGIN_INFO", JSON.stringify(data))
      await updatUserInfo()
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    changeProtocol(e) {
      this.protocol = e.target.value.includes('protocol')
    },
    routeBack() {
      this.router({ type: "back" });
    },
    toNext(isDisabled, form) {
      console.log(isDisabled, form);
    },
    showTip(message) {
      uni.showToast({
        title: message,
        icon: 'none',
        duration: 1700
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
    background-image: url('../../static/images/login/login-bg.png');
    background-size: 100% 100%;
    top: -2px;

    .service-icon {
      top: 44rpx;
      right: 40rpx;
      position: absolute;
    }

    .hello-icon {
      position: absolute;
      top: 140rpx;
      left: 100rpx;
    }

    .welcome-icon {
      position: absolute;
      top: 200rpx;
      left: 100rpx;
    }
  }

  .login-box {
    position: relative;
    margin: 30rpx;
    border-radius: 6rpx;
    background-color: #fff;
    top: -300rpx;
    overflow: hidden;
  }

  .login-logo {
    margin-bottom: 40px;
  }

  .protocol {
    position: fixed;
    bottom: 60rpx;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    color: #38363B;
    transform: scale(0.7);
    transform-origin: center center;
  }
}
</style>
