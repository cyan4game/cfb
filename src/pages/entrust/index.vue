<!-- 委托 -->
<template>
  <view class="info-page-bg page-entrust">
    <view class="info-page-content content-box">
      <!-- 发布委托 -->
      <view class="post" @click="goPost">发布委托</view>

      <!-- 筛选 -->
      <view class="filter-box">
        <view class="types">
          <picker
            class="input"
            @change="bindPickerChange"
            :range-key="'name'"
            :value="index"
            :range="array"
          >
            <view>{{ array[index].name }}</view>
          </picker>
          <u-image
            class="icon"
            src="/static/images/index/more.png"
            width="13rpx"
            height="8rpx"
          ></u-image>
        </view>
        <view class="show" @click="changeHidden">
          <view class="check" :class="{ checked: params.isHide == 1 }"
            ><view class="in"></view
          ></view>
          <text>{{ params.isHide == 1 ? "隐藏" : "显示" }}关闭委托</text>
        </view>
      </view>

      <!-- 列表 -->
      <scroll-view scroll-y="true" class="list">
        <view
          class="item"
          v-for="(item, i) in list"
          :key="i"
          @scrolltolower="loadMore"
          @click="goInfo(item)"
        >
          <!-- 头部 -->
          <view class="top">
            <view class="status">{{ item.type==2?'出售':'购买' }}</view>
            <view class="name">{{ item.currency }}</view>
            <view class="state">{{ stateMap[item.state] || '--' }}</view>
          </view>

          <view class="body">
            <view class="row">
              <view class="row-name">参考汇率（CNY）</view>
              <view class="row-val">￥{{ item.referenceRate }}</view>
            </view>
            <view class="row">
              <view class="row-name">委托数量</view>
              <view class="row-val">{{ item.entrustAmount }}</view>
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

        <view class="more">{{ finish?'没有更多了':(loading?'加载中':'加载更多') }}</view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { entrustPage } from "@/api/api";

// 状态：-1关闭,0发布中,1交易中，2完成
const stateMap = {
  '-1': '关闭',
  0: '发布中',
  1: '交易中',
  2: '完成'
}

export default {
  name: "entrust",
  data() {
    return {
      stateMap,
      list: [],
      array: [
        // 类型：1 购买，2出售
        { name: "出售委托", val: 2 },
        { name: "购买委托", val: 1 },
      ],
      index: 0, // 0-出售委托 1-购买委托
      params: {
        isHide: 1, // 是否隐藏关闭委托：1是，0否
        pageNo: 0,
        pageSize: 10,
        type: 2,
      },

      loading: false,
      finish: false,
    };
  },
  onShow() {
    this.reset()
  },
  methods: {
    // 加载更多
    loadMore() {
      if (this.loading || this.finish) return
      this.params.pageNo++
      this.loading = true
      entrustPage(this.params).then(res => {
        console.error(res.data.list[0])
        if (res.code == 200) {
          this.list = res.data.list || []
          if (this.list.length >= res.data.total) {
            this.finish = true
          }
        }
      }).finally(() => {
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },
    reset() {
      this.list = []
      this.params.pageNo = 0;
      this.finish = false
      this.loading = false
      setTimeout(() => {
        this.loadMore();
      }, 0)
    },
    // 隐藏关闭委托
    changeHidden() {
      this.params.isHide = this.params.isHide == 1 ? 0 : 1;
      this.reset();
    },
    // 选择类型
    bindPickerChange(e) {
      this.index = e.target.value;
      this.params.type = this.array[this.index].val;
      this.reset()
    },
    // 查看详情
    goInfo(item) {
      uni.navigateTo({
        url: `/pages/entrust/info?id=${item.id}`,
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
    .more {
      padding: 50rpx 0;
      text-align: center;
      font-size: 24rpx;
      color: #999;
    }
    .item {
      height: 391rpx;
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
        height: 145rpx;
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
        height: 141rpx;
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
