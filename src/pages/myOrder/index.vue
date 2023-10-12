<!-- 订单 -->
<template>
  <view class="info-page-bg self-body page-myorder">
    <u-navbar :safeAreaInsetTop="false" :title="'订单'" @leftClick="() => $routers.back()" />
    <view class="info-page-content content-box">
      <!-- 状态导航 -->
      <view class="tabs">
        <scroll-view class="tab-box" scroll-x="true">
          <view
            class="tab"
            @click="changeTab(-1)"
            :class="{ 'active-tab': activeTab == -1 }"
            >全部</view
          >
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
        <Item
          class="item-box"
          v-for="(item, i) in list"
          :key="i"
          :item="item"
        />

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
          <view class="type-item" @click="form.orderType = 1">
            <text>购买</text>
            <view class="check" :class="{ checked: form.orderType == 1 }"
              ><view class="in"></view
            ></view>
          </view>
          <view class="type-item" @click="form.orderType = 2">
            <text>出售</text>
            <view class="check" :class="{ checked: form.orderType == 2 }"
              ><view class="in"></view
            ></view>
          </view>
        </view>
        <!-- 时间筛选 -->
        <view class="box time-box">
          <view class="subtitle">交易日期</view>
          <!-- <view class="times">
            <picker
              class="time"
              mode="date"
              :value="form.createTimeStart"
              @change="(e) => (form.createTimeStart = e.detail.value)"
            >
              <view class="uni-input">{{ form.createTimeStart || "开始日期" }}</view>
            </picker>
            <text class="to">至</text>
            <picker
              class="time"
              mode="date"
              :value="form.createTimeEnd"
              @change="(e) => (form.createTimeEnd = e.detail.value)"
            >
              <view class="uni-input">{{ form.createTimeEnd || "结束日期" }}</view>
            </picker>
          </view> -->
          <view class="faster-box">
            <view
              class="faster"
              :class="{ 'active-faster': activeTime == 1 }"
              @click="changeDate(1)"
              >今日</view
            >
            <view
              class="faster"
              :class="{ 'active-faster': activeTime == -1 }"
              @click="changeDate(-1)"
              >昨日</view
            >
            <view
              class="faster"
              :class="{ 'active-faster': activeTime == -7 }"
              @click="changeDate(-7)"
              >近一周</view
            >
            <view
              class="faster"
              :class="{ 'active-faster': activeTime == -30 }"
              @click="changeDate(-30)"
              >近一月</view
            >
          </view>
          <view class="btns">
            <view class="btn" @click="resetParams">重置</view>
            <view class="btn acrive-btn" @click="changeFilter">确认</view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import Item from "./components/trade-item.vue";
import { pageOtcMyOrder } from "@/api/api";
import { orderStatusMap } from "./map.js";
import { getTimestr2 } from "@/utils/time";

export default {
  name: "my-order",
  components: {
    Item,
  },
  data() {
    return {
      // 状态 0订单完成 1申诉中 2待付款 3 收款待确认 4超时 5交易取消 6申诉处理中 7申诉成功（收款成功） 8申诉失败（收款失败）9驳回
      tabs: {
        0: "进行中", // 2,3,
        1: "已完成", // 0,7,8,9
        2: "申诉中", // 1,6
        3: "已取消", // 4,5
      },
      tabMap: {
        0: [2, 3],
        1: [0, 7, 8, 9],
        2: [1, 6],
        3: [4, 5]
      },
      activeNav: 1, // 1-未完成 2-完成
      activeTab: -1,

      form: {
        pageNo: 0,
        pageSize: 10,
        orderType: 1, // 1-购买 2-支付
        createTimeStart: "",
        createTimeEnd: "",
      },

      list: [],
      loading: false,
      finish: false,

      // 日期 今日 1   昨日 -1   近一周 -7   近一月 -30
      activeTime: "",
    };
  },
  onLoad() {
    this.reset();
  },
  methods: {
    // 选择时间
    changeDate(key) {
      if (this.activeTime == key) return (this.activeTime = "");
      this.activeTime = key;
    },
    // 切换分类
    changeTab(key) {
      this.activeTab = key;
      this.reset();
    },
    // 重置弹框参数
    resetParams() {
      this.form.orderType = 1;
      this.form.createTimeStart = "";
      this.form.createTimeEnd = "";
      this.activeTime = "";
    },
    // 重置
    reset() {
      this.list = [];
      this.loading = false;
      this.finish = false;
      this.form.pageNo = 0;
      setTimeout(() => {
        this.loadMore();
      }, 0);
    },
    // 获取时间等参数
    getDateParams() {
      const orderStatusList = this.activeTab == -1 ? null : this.tabMap[this.activeTab]
      if (!this.activeTime)
        return {
          createTimeStart: "",
          createTimeEnd: "",
          orderStatusList,
        };
      let now = Date.now();
      const createTimeEnd = getTimestr2(now).split(" ")[0];
      switch (this.activeTime) {
        case 1:
          break;
        case -1:
          now = now - 1 * 24 * 60 * 60 * 1000;
          break;
        case -7:
          now = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case -30:
          now = now - 30 * 24 * 60 * 60 * 1000;
          break;
      }
      const createTimeStart = getTimestr2(now).split(" ")[0];
      return {
        createTimeStart,
        createTimeEnd,
        orderStatusList,
      };
    },
    // 加载更多
    loadMore() {
      if (this.loading || this.finish) return;
      this.form.pageNo++;
      this.loading = true;
      pageOtcMyOrder({
        ...this.form,
        ...this.getDateParams(),
      })
        .then((res) => {
          if (res.code != 200) return;
          if (!res.data || !res.data.list) return;
          this.list.push(...res.data.list);
          if (this.list.length >= res.data.total) {
            this.finish = true;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 打开筛选
    openFilter() {
      this.$refs.popup.open();
    },
    //
    changeFilter() {
      this.$refs.popup.close();
      this.reset();
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
      color: #454545;
      font-size: 26rpx;
      height: 80rpx;
    }

    .active-tab {
      // background-color: #f0f0f0;
      // border-radius: 7rpx;
      // height: 55rpx;
      // padding: 0 30rpx;
      border-bottom: 8rpx solid #449367;
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
    height: 836rpx;
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
      margin-bottom: 30rpx;
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
        color: #449367;
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
