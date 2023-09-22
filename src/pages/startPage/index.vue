<template>
  <view class="start-page">
    <image class="start-lottie" :src="animation"></image>
  </view>
</template>

<script>
import animation from "/static/images/animation.gif";
export default {
  name: "index",
  data() {
    return {
      animation,
    };
  },
  created() {
    this.openPage();
  },
  methods: {
    openPage() {
      setTimeout(() => {
        uni.navigateTo({
          url: "pages/index/index",
        });
      }, 2500);
    },
  },
};
</script>

<style lang="scss" scoped>
.start-page {
  background: #505bde;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.start-lottie {
  width: 160px;
  height: 160px;
}
</style>
