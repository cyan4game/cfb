<template>
  <u-swiper
    height="200rpx"
    class="index-banner"
    :list="banners"
    @change="onBannerChange"
    @click="onBannerClick"
  ></u-swiper>
</template>

<script>
export default {
  name: "index-banner",
  data() {
    return {
      banners: [
        "/static/images/banner.png",
        "/static/images/banner.png",
        "/static/images/banner.png",
        "/static/images/banner.png",
      ],
    };
  },
  methods: {
    onBannerClick(index) {},
    onBannerChange(index) {},
  },
};
</script>

<style lang="scss" scoped>
.index-banner {
  margin: 10rpx auto 20rpx auto;
  border-radius: 5px;
  overflow: hidden;
  height: 100px;
  width: 355px;
}
</style>
