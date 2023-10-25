<!-- 帮助中心详情 -->
<template>
  <view class="info-page-bg self-body page-help-info">
    <u-navbar
      :safeAreaInsetTop="true"
      :title="info.title"
      @leftClick="() => $routers.back()"
    />
    <view class="self-status-bar"></view>
    <view class="info-page-content content-box">
      <view v-html="info.content"></view>
    </view>
  </view>
</template>

<script>
import storage from "@/utils/storage";

export default {
  data() {
    return {
      info: {},
    };
  },
  onShow() {
    this.info = storage.get("help-info") || {};
  },
  methods: {},
};
</script>
