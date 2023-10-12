<!-- 转账地址选择 -->
<template>
  <uni-popup
    ref="popup"
    type="bottom"
    :mask-click="false"
    :is-mask-click="false"
  >
    <view class="select-doalog">
      <view class="title">
        <text>选择地址</text>
        <view class="close" @click="close">×</view>
      </view>
      <scroll-view scroll-y="true" class="scroll-Y">
        <view
          class="item"
          v-for="(item, i) in list"
          :key="i"
          @click="handleClick(item)"
        >
          <view class="item-title">
            <view>{{ item.name }}</view>
            <view class="type">{{
              item.coin || item.currency + "_" + item.chain
            }}</view>
          </view>
          <view class="address">{{ item.address }}</view>
        </view>
        <view class="nodata" @click="goAddress">
          暂无地址 <text class="go">去添加</text>
        </view>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script>
import { queryByMemberAndCoin } from "@/api/api";
import storage from "@/utils/storage";
export default {
  name: "coinSelect",
  data() {
    return {
      list: [],
    };
  },
  methods: {
    // 打开
    open() {
      this.$refs.popup.open();
      // 获取数据
      this.getList();
    },
    // 关闭
    close() {
      this.$refs.popup.close();
    },
    // 点击
    handleClick(item) {
      this.$emit("select", item);
    },
    // 查询地址
    getList() {
      this.list = storage.get("coin_address_list") || [];
      if (this.list.length) return;
      queryByMemberAndCoin().then((res) => {
        if (res.code == 200) {
          this.list = res.data || [];
          storage.set("coin_address_list", this.list);
        }
      });
    },
    // 去地址管理
    goAddress() {
      this.close();
      uni.navigateTo({
        url: "/pages/coinAddress/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.select-doalog {
  width: 100%;
  height: 900rpx;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .title {
    height: 120rpx;
    padding: 0 37rpx 0 63rpx;
    color: #38363b;
    font-size: 36rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dfdfdf;

    .close {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      background-color: #eeeeee;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      color: #888;
    }
  }

  .scroll-Y {
    flex: 1;
    box-sizing: border-box;
    padding: 24rpx 54rpx;
    overflow: hidden;
    .nodata {
      margin: 100rpx auto 0 auto;
      font-size: 26rpx;
      color: #757575;
      text-align: center;
      .go {
        color: #4c9778;
        margin-left: 20rpx;
      }
    }
  }

  .tip {
    background-color: #f0f0f0;
    border-radius: 6rpx;
    padding: 30rpx 80rpx 30rpx 30rpx;
    display: flex;
    align-items: flex-start;
    font-size: 26rpx;
    color: #3b3b3b;
    margin-bottom: 40rpx;

    .icon {
      margin-right: 30rpx;
      position: relative;
      top: 1px;
    }
  }
  .item {
    height: 173rpx;
    border-bottom: 1px solid #cecece;
    box-sizing: border-box;
    padding: 0 40rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    .address {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #757575;
      font-size: 24rpx;
      width: 100%;
      margin-top: 10rpx;
    }
    .item-title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: #454545;
      font-size: 32rpx;
      .type {
        background-color: #f1f1f1;
        height: 54rpx;
        padding: 0 30rpx;
        border-radius: 6rpx;
        display: flex;
        align-items: center;
        color: #449367;
        font-size: 20rpx;
        margin-left: 20rpx;
      }
    }
  }
}
</style>
