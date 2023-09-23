<!-- 首页轮播 -->
<template>
    <swiper class="index-banner" circular :indicator-dots="true" :indicator-color="'#6A6D76'" :indicator-active-color="'#EBBC0E'" :autoplay="true" :interval="3000" :duration="500">
        <swiper-item v-for="(item, i) in banners" :key="i">
            <u-image class="swiper-item" :src="item" width="100%" height="280rpx"></u-image>
        </swiper-item>
    </swiper>
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
};
</script>

<style lang="scss" scoped>
.index-banner {
    width: 100%;
    margin-top: 20rpx;
    border-radius: 6rpx;
    height: 280rpx;
}
</style>