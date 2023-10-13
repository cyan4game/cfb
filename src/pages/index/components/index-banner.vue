<!-- 首页轮播 -->
<template>
  <swiper
    class="index-banner"
    circular
    :indicator-dots="true"
    :indicator-color="'#6A6D76'"
    :indicator-active-color="'#EBBC0E'"
    :autoplay="true"
    :interval="3000"
    :duration="500"
  >
    <swiper-item v-for="(item, i) in banners" :key="i">
      <u-image
        @click="jump(item)"
        class="swiper-item"
        :src="item.image"
        width="100%"
        height="280rpx"
      ></u-image>
    </swiper-item>
  </swiper>
</template>

<script>
import { getAllBanner } from "@/api/api";

export default {
  name: "index-banner",
  data() {
    return {
      banners: [],
    };
  },
  mounted() {
    this.getBanner();
  },
  methods: {
    // 获取banner
    getBanner() {
      getAllBanner().then((res) => {
        if (res.code == 200) {
          this.banners = res.data || [];
        }
      });
    },
    // 跳转
    jump(item) {
      if (!item.route) return;
      // 外链
      if (item.route.includes("http://") || item.route.includes("https://")) {
        // #ifdef H5
        window.open(item.route);
        // #endif
        // #ifdef APP-PLUS
        plus.runtime.openURL(item.route);
        // #endif
      } else {
        uni.navigateTo({
          url: item.route,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.index-banner {
  width: 100%;
  // margin-top: 20rpx;
  border-radius: 6rpx;
  height: 280rpx;
}
</style>
