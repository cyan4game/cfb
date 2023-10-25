<!-- 首页 -->
<template>
  <view class="page-index" :style="{paddingBottom:window?'100rpx':'0'}">
    <view class="self-status-bar"></view>
    <!-- 顶部 -->
    <u-sticky offsetTop="0" customNavHeight="0">
      <view class="top">
        <u-image
          @click="jump('/pages/customer/index')"
          class="icon"
          src="/static/images/index/kefu.png"
          width="46rpx"
          height="40rpx"
        ></u-image>
        <view>财富宝</view>
        <u-image
          @click="jump('/pages/message/index')"
          class="icon"
          src="/static/images/index/msg.png"
          width="40rpx"
          height="36rpx"
        ></u-image>
      </view>
    </u-sticky>

    <view class="page-content">
      <!-- 轮播 -->
      <index-banner />
      <!-- 用户资产 -->
      <user-balance ref="ub" />
      <!-- 导航 -->
      <view class="navs">
        <view class="nav" @click="switchTab(1)">
          <text>购买CFB</text>
          <view class="icon">
            <u-image
              src="/static/images/index/buy-coin.png"
              width="61rpx"
              height="63rpx"
            ></u-image>
          </view>
        </view>
        <view class="nav" @click="switchTab(2)">
          <text>出售CFB</text>
          <view class="icon">
            <u-image
              src="/static/images/index/buy.png"
              width="58rpx"
              height="59rpx"
            ></u-image>
          </view>
        </view>
      </view>
      <!-- 首页菜单 -->
      <index-menu />
    </view>
  </view>
</template>

<script>
import indexBanner from "./components/index-banner.vue";
import userBalance from "./components/user-balance.vue";
import indexMenu from "./components/index-menu.vue";
import storage from "@/utils/storage";

export default {
  data() {
    return {
      window,
      userInfo: {},
    };
  },
  components: {
    indexBanner,
    userBalance,
    indexMenu,
  },
  onShow() {
    this.userInfo = storage.get("userInfo") || {};
    if (!this.userInfo.payPasswordStatus) {
      uni.navigateTo({
        url: "/pages/setPayPassword/index",
      });
    }

    setTimeout(() => {
      this.$refs.ub.getAssets()
    }, 100)
  },
  onHide() {
    if (this.$refs.ub) {
      this.$refs.ub.closeSelectCoin();
    }
  },
  methods: {
    jump(name) {
      uni.navigateTo({
        url: name,
      });
    },
    switchTab(key) {
      storage.set('trade-tab', key)
      uni.switchTab({
        url: '/pages/confirmTrade/index',
      });
    }
  },
};
</script>

<style lang="scss">
.page-index {
  // padding-bottom: 100rpx;
  background-color: #fff;
  background: linear-gradient(
    to bottom,
    #0c1114 588rpx,
    #fff 589rpx,
    #fff 100%
  );

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 60rpx;
    color: #fff;
    font-size: 38rpx;
    background-color: #0c1114;
    height: 104rpx;
  }

  .page-content {
    margin: 0 25rpx;

    .navs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 25rpx;

      .nav {
        width: 49.4%;
        height: 111rpx;
        background-color: #f1f1f1;
        border-radius: 6rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 40rpx 0 42rpx;
        color: #38373c;
        font-size: 30rpx;
        font-weight: 500;
      }
    }
  }
}
</style>
