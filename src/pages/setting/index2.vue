<template>
  <view class="setting-page">
    <view class="flex-box-between set-item">
      <text class="set-label">音效通知</text>
      <u-switch
        activeColor="#62CE3A"
        style="margin-left: auto"
        v-model="isMuted"
      ></u-switch>
    </view>
    <!-- #ifdef APP-PLUS -->
    <u-line></u-line>
    <view class="flex-box-between set-item" @click="toUpdate">
      <text class="set-label">版本更新</text>
      <u-icon size="54rpx" name="/static/icons/right.svg"></u-icon>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "index",
  computed: {
    isMuted: {
      get() {
        return !this.$store.state.socket.isMuted;
      },
      set(val) {
        this.SWITCH_MUTED(!val);
      },
    },
  },
  methods: {
    ...mapMutations("socket", ["SWITCH_MUTED"]),
    toUpdate() {
      uni.navigateTo({
        url: '/pages/update'
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.setting-page {
  background: #fff;
  .set-item {
    padding: 19px 16px;
    .set-label {
      color: #333333;
      font-size: 16px;
    }
  }
}
</style>
