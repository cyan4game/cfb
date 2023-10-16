<!-- 币种选择-非弹窗 -->
<template>
  <view class="coin-select-inner" @click="show = false" v-if="show">
    <view :style="{ top: top, left: left, width: width }" class="select-box">
      <view
        class="item"
        :class="{ 'active-item': coin == item.coin }"
        v-for="(item, i) in coinList"
        :key="i"
        @click="handleClick(item)"
      >
        <u-image
          class="img"
          :src="iconMap[item.coin]"
          width="50rpx"
          height="50rpx"
        ></u-image>
        <text>{{ item.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { coinList, iconMap } from "@/utils/dataMap.js";

export default {
  props: {
    top: "",
    left: "",
    width: "",
    coin: "", // 当前选择的币种
  },
  data() {
    return {
      show: false,
      iconMap,
      coinList,
    };
  },
  methods: {
    // 打开
    open() {
      this.show = true;
    },
    // 关闭
    close() {
      this.show = false;
    },
    // 点击
    handleClick(item) {
      this.$emit("select", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.coin-select-inner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0);

  .select-box {
    position: absolute;
    background-color: #fff;
    border: 1px solid #5c5c5c;
    border-radius: 6rpx;
    .item {
      height: 72rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: #060606;
      font-size: 28rpx;
      box-sizing: border-box;
      padding-left: 30rpx;
      .img {
        margin-right: 16rpx;
      }
    }
    .active-item {
      background-color: #f0f0f0;
    }
  }
}
</style>
