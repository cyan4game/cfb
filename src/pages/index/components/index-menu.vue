<!-- 首页-菜单 -->
<template>
  <view class="index-menu">
    <view
      class="item"
      v-for="item in navs"
      :key="item.key"
      @click="handleClick(item)"
    >
      <u-image
        fit="fill"
        class="icon"
        :src="item.icon"
        :width="item.key == 5 ? '64rpx' : '53rpx'"
        :style="{ position: 'relative', left: item.key == 5 ? '8rpx' : '' }"
        :height="'53rpx'"
      ></u-image>
      <view>{{ item.name }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "index-menu",
  data() {
    return {
      navs: [
        {
          key: 1,
          name: "扫一扫",
          icon: "/static/images/index/nav-1.png",
          route: "",
        },
        {
          key: 2,
          name: "收币",
          icon: "/static/images/index/nav-2.png",
          route: "/pages/index/collection",
        },
        {
          key: 3,
          name: "闪兑",
          icon: "/static/images/index/nav-3.png",
          route: "/pages/index/flashExchange",
        },
        {
          key: 4,
          name: "我的订单",
          icon: "/static/images/index/nav-4.png",
          route: "/pages/myOrder/index",
        },
        {
          key: 5,
          name: "我的挂单",
          icon: "/static/images/index/nav-5.png",
          route: "",
        },
        {
          key: 6,
          name: "教程",
          icon: "/static/images/index/nav-6.png",
          route: "",
        },
      ],
    };
  },
  methods: {
    handleClick(item) {
      switch (item.key) {
        case 1:
          this.scan();
          break;
        default:
          uni.navigateTo({
            url: item.route,
          });
      }
    },
    // 扫一扫
    scan() {
      // #ifdef APP-PLUS
      uni.scanCode({
        success: function (res) {
          console.log("条码类型：" + res.scanType);
          console.log("条码内容：" + res.result);
        },
      });
      // #endif

      // #ifdef H5
      uni.navigateTo({
        url: "/pages/index/scan",
      });
      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
.index-menu {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 63rpx 0 0 0;

  .item {
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    color: #5d5d5d;
    margin-bottom: 60rpx;

    .icon {
      margin-bottom: 20rpx;
    }
  }
}
</style>
