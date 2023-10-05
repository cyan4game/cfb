<!-- 委托 -->
<template>
  <view class="info-page-bg page-entrust">
    <view class="info-page-content content-box">
      <!-- 发布委托 -->
      <view class="post" @click="goPost">发布委托</view>

      <!-- 筛选 -->
      <view class="filter-box">
        <view class="types">
          <text>出售委托</text>
          <u-image
            class="icon"
            src="/static/images/index/more.png"
            width="13rpx"
            height="8rpx"
          ></u-image>
        </view>
        <view class="show">
          <view class="check checked"><view class="in"></view></view>
          <text>隐藏关闭委托</text>
        </view>
      </view>

      <!-- 列表 -->
      <scroll-view scroll-y="true" class="list">
        <view
          class="item"
          v-for="i in 20"
          :key="i"
          @scrolltolower="loadMore"
          @click="goInfo"
        >
          <!-- 头部 -->
          <view class="top">
            <view class="status">出售</view>
            <view class="name">CFB</view>
            <view class="state">发布中</view>
          </view>

          <view class="body">
            <view class="row">
              <view class="row-name">参考汇率（CNY）</view>
              <view class="row-val">￥6.16</view>
            </view>
            <view class="row">
              <view class="row-name">委托数量</view>
              <view class="row-val">100.00</view>
            </view>
          </view>

          <!-- 底部 -->
          <view class="bottom">
            <view class="icons">
              <!-- <u-image
                class="icon"
                src="/static/images/mine/icon-alipay.png"
                width="32rpx"
                height="32rpx"
              ></u-image>
              <u-image
                class="icon"
                src="/static/images/mine/icon-wechat.png"
                width="32rpx"
                height="32rpx"
              ></u-image> -->
            </view>
            <!-- <view class="btn">订单</view> -->
            <view class="btn">查看详情</view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  name: "entrust",
  data() {
    return {};
  },
  methods: {
    // 加载更多
    loadMore() {
      console.error("加载更多");
    },
    // 查看详情
    goInfo() {
      uni.navigateTo({
        url: "/pages/entrust/info",
      });
    },
    // 发布委托
    goPost() {
      uni.navigateTo({
        url: "/pages/entrust/post",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-entrust {
  height: 100%;
  .content-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    border-top-right-radius: 6rpx;
    border-top-left-radius: 6rpx;
    padding: 0;
    .post {
      position: fixed;
      top: 26rpx;
      right: 40rpx;
      color: #fff;
      z-index: 9999;
      font-size: 28rpx;
    }
  }
  .filter-box {
    height: 127rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 31rpx 0 59rpx;
    .types {
      display: flex;
      align-items: center;
      color: #38363b;
      font-size: 32rpx;
      .icon {
        margin-left: 10rpx;
      }
    }
    .show {
      display: flex;
      align-items: center;
      color: #827e88;
      font-size: 30rpx;
      
    }
  }
  .list {
    flex: 1;
    overflow: hidden;
    padding: 30rpx;
    background-color: #f1f1f1;
    box-sizing: border-box;
    .item {
      height: 353rpx;
      border-radius: 9rpx;
      background-color: #fff;
      margin-bottom: 26rpx;
      padding: 0 42rpx;
      box-sizing: border-box;
      font-weight: 400;
      .top {
        height: 103rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 26rpx;
        border-bottom: 1px solid #e5e5e5;
        .status {
          height: 44rpx;
          border-radius: 6rpx;
          background-color: #da3030;
          color: #fff;
          padding: 0 10rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .name {
          flex: 1;
          color: #343635;
          margin: 0 20rpx;
        }
        .state {
          font-size: 24rpx;
          color: #979797;
        }
      }
      .bottom {
        border-top: 1px solid #e5e5e5;
        height: 108rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icons {
          flex: 1;
          display: flex;
          align-items: center;
          .icon {
            margin-right: 15rpx;
          }
        }
        .btn {
          height: 56rpx;
          padding: 0 20rpx;
          background-color: #449367;
          border-radius: 6rpx;
          margin-left: 17rpx;
          font-size: 24rpx;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 400;
        }
      }
      .body {
        height: 140rpx;
        box-sizing: border-box;
        padding: 10rpx 0;
        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 26rpx;
          height: 55rpx;
          .row-name {
            color: #696969;
          }
          .row-val {
            color: #38363b;
          }
        }
      }
    }
  }
}
</style>
