<!-- 首页-菜单 -->
<template>
  <view class="index-menu">
    <view
      class="item"
      v-for="item in navs"
      :key="item.key"
      :style="{paddingTop:[6,3].includes(item.key)?'0':'6rpx'}"
      @click="handleClick(item)"
    >
      <u-image
        fit="fill"
        class="icon"
        :src="item.icon"
        :width="item.iconW + 'rpx'"
        :height="item.iconH + 'rpx'"
      ></u-image>
      <view>{{ item.name }}</view>
    </view>
  </view>
</template>

<script>
import { isValidTRONAddress } from "@/utils/utils";

export default {
  name: "index-menu",
  data() {
    return {
      navs: [
        {
          key: 1,
          name: "扫一扫",
          icon: "/static/images/index/nav-1.png",
          iconW: 68,
          iconH: 61,
          route: "",
        },
        {
          key: 2,
          name: "转账",
          icon: "/static/images/index/nav-2.png",
          iconW: 67,
          iconH: 65,
          route: "/pages/withdraw/index",
        },
        {
          key: 6,
          name: "链上充币",
          icon: "/static/images/index/nav-7.png",
          iconW: 69,
          iconH: 75,
          route: "/pages/index/deposit",
        },
        {
          key: 3,
          name: "闪兑",
          icon: "/static/images/index/nav-8.png",
          iconW: 69,
          iconH: 71,
          route: "/pages/index/flashExchange",
        },
        {
          key: 4,
          name: "我的订单",
          icon: "/static/images/index/nav-5.png",
          iconW: 76,
          iconH: 61,
          route: "/pages/myOrder/index",
        },
        {
          key: 5,
          name: "我的委托",
          icon: "/static/images/index/nav-6.png",
          iconW: 78,
          iconH: 66,
          route: "/pages/entrust/index",
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
        scanType: ["qrCode"],
        success: function (res) {
          const rs = res.result;
          if (isValidTRONAddress(rs)) {
            // 解析成功
            // 根据不同页面 跳转不同结果
            uni.navigateTo({
              url: `/pages/withdraw/index?address=${rs}`,
            });
          } else {
            // 解析失败
            uni.showToast({
              title: `无效地址：${rs}`,
              icon: "none",
              duration: 4000,
            });
          }
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
  width: calc(100% + 48rpx);
  position: relative;
  left: -24rpx;
  margin: 58rpx 0 0 0;

  .item {
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: 30rpx;
    color: #5d5d5d;
    line-height: 30rpx;
    margin-bottom: 120rpx;
    box-sizing: border-box;

    .icon {
      margin-bottom: 50rpx;
    }
  }
}
</style>
