<template>
  <view class="safety-page">
    <view
      class="safety-item"
      v-for="(item, i) in menuList"
      :key="i"
      @click="pageTo(item)"
    >
      <view class="flex-box">
        <u-image width="24px" height="24px" :src="item.icon"></u-image>
        <text class="show-label">{{ item.label }}</text>
      </view>
      <text class="bind-text" v-if="item.bind">已绑定</text>
      <text class="bind-text" v-if="item.setted">已绑定</text>
      <u-image
        width="24px"
        height="24px"
        src="@/static/icons/right.svg"
      ></u-image>
    </view>
  </view>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "index",
  data() {
    return {
      menuList: [],
    };
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    user() {
      return this.userInfo.userInfo || {}
    }
  },
  onShow() {
    this.menuList = [
      {
        label: "变更手机号",
        icon: require("@/static/icons/phone.svg"),
        router: "pages/safety/mobile",
        bind: !!this.user.mobilePhone,
        click: true,
        setting: false
      },
      {
        label: "变更邮箱",
        icon: require("@/static/icons/emailChange.svg"),
        router: "pages/safety/email",
        bind: !!this.user.email,
        click: true,
        setting: false
      },
      {
        label: "变更登录密码",
        icon: require("@/static/icons/loginLock.svg"),
        router: "pages/safety/password",
        bind: false,
        click: true,
        setting: false
      },
      {
        label: "变更支付密码",
        icon: require("@/static/icons/coinLock.svg"),
        router: "pages/safety/paymentPWD",
        bind: false,
        click: true,
        setting: false
      },
      {
        label: "二次验证绑定",
        icon: require("@/static/icons/auth.svg"),
        router: "pages/safety/googleAuth",
        bind: this.user.googleState === '1',
        click: this.user.googleState === '0',
        setting: false
      }
    ]
  },
  methods: {
    pageTo(item) {
      if (!item.click) return
      this.router({
        url: item.router,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.safety-page {
  background: #fff;

  .safety-item {
    padding: 19px 16px;
    border-bottom: 1px solid #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .show-label {
      color: #333333;
      margin-left: 10px;
      font-size: 16px;
    }
  }
}

.bind-text {
  font-size: 28rpx;
  color: #999999;
  flex: 1;
  text-align: right;
  display: block;
  line-height: 1.8;
}
</style>
