<!-- 首页 -->
<template>
  <view class="page-index">
    <!-- 顶部 -->
    <u-sticky offsetTop="0" customNavHeight="0">
      <view class="top">
        <u-image
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
      <user-balance />
      <!-- 导航 -->
      <view class="navs">
        <view class="nav" @click="jump('/pages/index/deposit')">
          <text>链上充币</text>
          <view class="icon">
            <u-image
              src="/static/images/index/recharge.png"
              width="80rpx"
              height="75rpx"
            ></u-image>
          </view>
        </view>
        <view class="nav">
          <text>购买CFB</text>
          <view class="icon">
            <u-image
              src="/static/images/index/buy.png"
              width="72rpx"
              height="68rpx"
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

export default {
  data() {
    return {};
  },
  components: {
    indexBanner,
    userBalance,
    indexMenu,
  },
  methods: {
    jump(name) {
      uni.navigateTo({
        url: name,
      });
    },
  },
};
</script>

<style lang="scss">
.page-index {
  padding-bottom: 100rpx;
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
    padding: 20rpx 60rpx;
    color: #fff;
    font-size: 36rpx;
    background-color: #0c1114;
  }

  .page-content {
    margin: 0 25rpx;

    .navs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 23rpx;

      .nav {
        width: 49%;
        height: 111rpx;
        background-color: #f1f1f1;
        border-radius: 6rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 40rpx;
        color: #38373c;
        font-size: 30rpx;
        font-weight: 500;
      }
    }
  }
}
</style>
