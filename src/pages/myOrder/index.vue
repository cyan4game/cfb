<!-- 订单 -->
<template>
  <view class="info-page-bg page-myorder">
    <view class="info-page-content content-box">
      <!-- 分类导航 -->
      <!-- <view class="navs">
        <view
          class="nav"
          :class="{ 'active-nav': activeNav == 1 }"
          @click="changeNav(1)"
          >未完成</view
        >
        <view
          class="nav"
          :class="{ 'active-nav': activeNav == 2 }"
          @click="changeNav(2)"
          >已结束</view
        >

        <u-image
          @click="openFilter"
          class="filter"
          src="/static/images/home/filter.png"
          width="31rpx"
          height="33rpx"
        ></u-image>
      </view> -->

      <!-- 状态导航 -->
      <view class="tabs">
        <scroll-view class="tab-box" scroll-x="true">
          <view
            class="tab"
            :class="{ 'active-tab': activeTab == key }"
            @click="changeTab(key)"
            v-for="(val, key) in tabs"
            :key="key"
            >{{ val }}</view
          >
        </scroll-view>

        <u-image
          @click="openFilter"
          class="filter"
          src="/static/images/home/filter.png"
          width="31rpx"
          height="33rpx"
        ></u-image>
      </view>

      <!-- 列表 -->
      <scroll-view scroll-y="true" class="list" @scrolltolower="loadMore">
        <Item class="item-box" v-for="i in 20" :key="i" />

        <!-- 加载状态 -->
        <view class="more">{{
          finish ? "没有更多了" : loading ? "加载中" : "加载更多"
        }}</view>
      </scroll-view>
    </view>

    <!-- 筛选弹框 -->
    <uni-popup ref="popup" type="bottom">
      <view class="filter-box">
        <view class="title">
          <text>筛选</text>
          <view class="close" @click="() => $refs.popup.close()">×</view>
        </view>
        <!-- 类型选择 -->
        <view class="box type-box">
          <view class="subtitle">交易类型</view>
          <view class="type-item">
            <text>购买</text>
            <view class="check checked"><view class="in"></view></view>
          </view>
          <view class="type-item">
            <text>出售</text>
            <view class="check"><view class="in"></view></view>
          </view>
        </view>
        <!-- 时间筛选 -->
        <view class="box time-box">
          <view class="subtitle">下单日期</view>
          <view class="times">
            <picker
              class="time"
              mode="date"
              :value="form.start"
              @change="(e) => (form.start = e.detail.value)"
            >
              <view class="uni-input">{{ form.start || "开始日期" }}</view>
            </picker>
            <text class="to">至</text>
            <picker
              class="time"
              mode="date"
              :value="form.end"
              @change="(e) => (form.end = e.detail.value)"
            >
              <view class="uni-input">{{ form.end || "结束日期" }}</view>
            </picker>
          </view>
          <view class="faster-box">
            <view class="faster">近7天</view>
            <view class="faster">近3个月</view>
            <view class="faster">近6个月</view>
            <view class="faster">近1年</view>
          </view>
          <view class="btns">
            <view class="btn">重置</view>
            <view class="btn acrive-btn">确认</view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import Item from "./components/trade-item.vue";

export default {
  name: "my-order",
  components: {
    Item,
  },
  data() {
    return {
      tabs: {
        0: "全部",
        1: "订单完成",
        2: "申诉中",
        3: "待付款",
        4: "收款待确认",
        5: "订单超时",
        6: "交易取消",
        7: "申诉处理中",
        8: "申诉成功",
        9: "申诉失败",
        10: "驳回",
      },
      activeNav: 1, // 1-未完成 2-完成
      activeTab: 0,

      form: {
        start: "",
        end: "",
      },

      list: [],
      loading: false,
      finish: false,
    };
  },
  methods: {
    // 切换分类
    changeNav(key) {
      this.activeTab = 0;
      this.activeNav = key;
    },
    // 切换分类
    changeTab(key) {
      this.activeTab = key;
    },
    // 加载更多
    loadMore() {
      console.error("加载更多");
    },
    // 打开筛选
    openFilter() {
      this.$refs.popup.open();
    },
  },
};
</script>

<style lang="scss" scoped>
.page-myorder {
  .content-box {
    border-radius: 6rpx;
    display: flex;
    flex-direction: column;
    padding: 0;
  }

  .navs {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    height: 127rpx;
    color: #827e88;
    font-size: 30rpx;
    border-bottom: 1px solid #dfdfdf;
    padding-left: 57rpx;
    position: relative;

    .nav {
      margin-right: 70rpx;
      display: flex;
      align-items: center;
    }

    .active-nav {
      color: #38363b;
      font-size: 32rpx;
      border-bottom: 8rpx solid #449367;
    }

    .filter {
      position: absolute;
      right: 57rpx;
      top: 50rpx;
    }
  }

  .tabs {
    height: 103rpx;
    padding: 0 30rpx;
    color: #454545;
    font-size: 26rpx;
    width: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
    box-sizing: border-box;

    .tab-box {
      flex: 1;
      overflow-x: auto;
      white-space: nowrap;
    }
    .tab {
      display: inline-flex;
      margin-right: 58rpx;
      align-items: center;
    }

    .active-tab {
      background-color: #f0f0f0;
      border-radius: 7rpx;
      height: 55rpx;
      padding: 0 30rpx;
    }
    .filter {
      margin-left: 20rpx;
    }
  }

  .list {
    flex: 1;
    overflow: hidden;
    padding: 28rpx;
    background-color: #f1f1f1;
    box-sizing: border-box;

    .more {
      padding: 40rpx 0;
      text-align: center;
      color: #999;
      font-size: 24rpx;
    }

    .item-box {
      margin-bottom: 20rpx;
    }
  }

  .filter-box {
    height: 936rpx;
    background-color: #fff;
    border-top-right-radius: 3rpx;
    border-top-left-radius: 3rpx;
    font-weight: 400;

    .title {
      height: 128rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40rpx 0 60rpx;
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
    .subtitle {
      color: #38363b;
      font-size: 32rpx;
      font-weight: 500;
      margin-bottom: 20rpx;
    }
    .box {
      box-sizing: border-box;
      padding: 40rpx 40rpx 40rpx 50rpx;
      height: 300rpx;
    }
    .type-box {
      border-bottom: 1px solid #dfdfdf;
      .type-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #38363b;
        font-size: 32rpx;
        height: 76rpx;
      }
    }
    .time-box {
      .times {
        display: flex;
        align-items: center;
        color: #4f4c53;
        font-size: 28rpx;
        margin: 40rpx 0;
        .time {
          background-color: #f1f1f1;
          height: 72rpx;
          flex: 1;
          border-radius: 6rpx;
          ::v-deep .uni-input {
            background-color: #f1f1f1;
          }
        }
        .to {
          margin: 0 20rpx;
        }
      }
    }
    .faster-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .faster {
        width: 23%;
        height: 61rpx;
        border: 1px solid #c7c7c7;
        color: #797480;
        font-size: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .active-faster {
        color: 449367;
        border: 1px solid #449367;
      }
    }
    .btns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 60rpx;
      .btn {
        width: 188rpx;
        height: 97rpx;
        border-radius: 6rpx;
        border: 1px solid #38363b;
        color: #38363b;
        font-size: 30rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }
      .acrive-btn {
        width: 451rpx;
        background-color: #449367;
        color: #fff;
        border: none;
      }
    }
  }
}
</style>
