<template>
  <view class="show-limit">
    <view class="limit-label">OTC限额</view>
    <view class="flex-box">
      <view class="limit-value">
        <text>单次 </text>
        <view>{{ config[returnLimit(type).time] }}</view>
      </view>
      <view class="limit-value">
        <text>单日</text>
        <view>{{ config[returnLimit(type).day] }} </view>
      </view>
      <view class="limit-value">
        <text>单月 </text>
        <view>{{ config[returnLimit(type).month] }}</view>
      </view>
    </view>
    <view class="limit-label mt-5">转账限额</view>
    <view class="flex-box">
      <view class="limit-value">
        <text>单次 </text>
        <view>{{ config[returnLimit(type).transTime] }}</view>
      </view>
      <view class="limit-value">
        <text>单日</text>
        <view>{{ config[returnLimit(type).transDay] }} </view>
      </view>
      <view class="limit-value">
        <text>单月 </text>
        <view>{{ config[returnLimit(type).transMonth] }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "show-limit",
  props: {
    config: {
      type: Object,
    },
    returnLimit: {
      type: Function,
    },
    type: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../style";
.mt-5 {
  margin-top: 5px;
}
</style>
