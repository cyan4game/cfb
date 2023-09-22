<template>
  <view class="full-screen">
    <view class="full-content">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: "full-screen",
};
</script>

<style lang="scss" scoped>
.full-screen {
  flex: 1;
  position: relative;
  width: 100%;
  .full-content {
    position: absolute;
    height: 100%;
    left: 0;
    width: 100%;
    top: 0;
  }
}
</style>
