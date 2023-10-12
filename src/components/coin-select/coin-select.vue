<!-- 币种选择弹窗 -->
<template>
  <uni-popup ref="popup" type="bottom">
    <view class="coin-select-content">
      <view class="title">
        <text>选择充币币种</text>
        <view class="close" @click="() => $refs.popup.close()">×</view>
      </view>

      <scroll-view scroll-y="true" class="content">
        <view
          class="item"
          v-for="(item, i) in list"
          :key="i"
          @click="handleClick(item)"
        >
          <u-image
            class="img"
            :src="iconMap[item.coin]"
            width="51rpx"
            height="51rpx"
          ></u-image>
          <text>{{ item.name }}</text>
        </view>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script>
import usdtIcon from "@/static/images/index/usdt.png";
import cfbIcon from "@/static/images/index/cfb.png";
const iconMap = {
  USDT: usdtIcon,
  CFB: cfbIcon,
};

export default {
  name: "coinSelect",
  data() {
    return {
      iconMap,
      list: [
        {
          coin: "USDT",
          name: "USDT",
          chain: "TRC20",
        },
        {
          coin: "CFB",
          name: "CFB",
          chain: "CFB",
        },
      ],
    };
  },
  methods: {
    // 打开
    open() {
      this.$refs.popup.open();
    },
    // 关闭
    close() {
      this.$refs.popup.close();
    },
    // 点击
    handleClick(item) {
      this.$emit("select", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.coin-select-content {
  background-color: #fff;
  height: 1040rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .title {
    height: 128rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 50rpx 0 60rpx;
    border-bottom: 1px solid #dfdfdf;
    color: #38363b;
    font-size: 36rpx;

    .close {
      width: 40rpx;
      height: 40rpx;
      text-align: center;
      background-color: #eeeeee;
      border-radius: 50%;
      line-height: 36rpx;
      color: #888888;
    }
  }

  .content {
    flex: 1;
    overflow: hidden;
    box-sizing: border-box;
    padding: 40rpx 50rpx;

    .item {
      border: 1px solid #c4bfcb;
      border-radius: 6rpx;
      height: 120rpx;
      padding: 0 40rpx;
      box-sizing: border-box;
      align-items: center;
      display: flex;
      justify-content: flex-start;
      margin-bottom: 23rpx;
      color: #38363b;
      font-size: 26rpx;

      .img {
        margin-right: 28rpx;
      }
    }
  }
}
</style>
