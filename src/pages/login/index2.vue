<template>
  <view class="login-page">
    <!-- <u-navbar
      title="登录"
      height="50px"
      :titleStyle="{ color: '#fff' }"
      placeholder
      bgColor="#505bde"
    >
      <view class="u-nav-slot" slot="left"></view>
      <view class="u-nav-slot" slot="right">
        <u-image
          @click="pageTo"
          :showLoading="true"
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
      <template v-if="menuName === 'mobile'">
        <mobile>
          <template slot-scope="{ isDisabled, form }">
            <u-button
              :disabled="isDisabled"
              class="login-button"
              @click="toLogin(isDisabled, form)"
              type="primary"
              text="登录"
            ></u-button>
          </template>
        </mobile>
      </template>
      <template v-else-if="menuName === 'email'">
        <email>
          <template slot-scope="{ isDisabled, form }">
            <u-button
              :disabled="isDisabled"
              class="login-button"
              @click="toLogin(isDisabled, form)"
              type="primary"
              text="登录"
            ></u-button>
          </template>
        </email>
      </template>

      <u-button
        @click="router('pages/register/index')"
        class="register-button mt-20 mb-20"
        type="primary"
        text="注册"
      ></u-button>
      <u-text align="center" type="primary" :color="'#38363B'" size="13" text="忘记密码?" @click="router('pages/retrievePassword/index')"></u-text>
    </view>
    
  </view>
</template>

<script>
import radioTab from "./components/radio-tab"
import mobile from "./components/mobile"
import email from "./components/email"
import {login} from "../../api/api"
import storage from "../../utils/storage"
import {mapActions} from "vuex"

export default {
  name: "index",
  components: {radioTab, mobile, email},
  data () {
    return {
      title: "",
      menuName: "mobile",
      menuList: [
        {
          label: "手机登录",
          key: "mobile",
          icon: require("@/static/icons/mobile-default.svg"),
          active: require("@/static/icons/mobile.svg"),
        },
        {
          label: "邮箱登录",
          key: "email",
          icon: require("@/static/icons/email-default.svg"),
          active: require("@/static/icons/email.svg"),
        },
      ],
      currentView: "mobile",
    }
  },
  onLoad (option) {
    const {type, mobile} = option
    if (type === "email") {
      this.menuName = "email"
    } else {
      this.menuName = "mobile"
    }
  },
  methods: {
    ...mapActions("socket", ["INIT_SOCKET"]),
    ...mapActions("user", ["GET_USER_INFO"]),
    toLogin (isDisabled, form) {
      if (isDisabled) return
      login({terminal: "C", ...form}).then((res) => {
        if (res.code.toString() === "0" && res.data) {
          const {data} = res
          storage.set("token", data.token)
          storage.set("pushToken", data.pushToken)
          storage.set("memberLevel", data.userInfo.memberLevel)
          this.GET_USER_INFO()
          if (data.isFirstLogin) {
            uni.reLaunch({
              url: "/pages/login/first",
            })
          } else {
            this.router({
              type: "switchTab",
              url: "pages/index/index",
            })
          }
        }
      })
      // console.log(form);
    },
    pageTo () {
      this.router("pages/customer/index")
    },
    To (url) {
      this.router(url)
    },
  },
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100%;
  box-sizing: border-box;
  background: #fff;

  .login-bg {
    height: 588rpx;
    background-color: #111;
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

  .register-button {
    background: #ffffff 0 0 no-repeat padding-box;
    border: 1px solid #449367;
    color: #449367;
    width: 450rpx;
    height: 112rpx;
  }
}
</style>
