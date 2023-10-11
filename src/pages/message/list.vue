<!-- 消息列表 -->
<template>
  <view class="info-page-bg self-body page-message">
    <u-navbar :title="'消息列表'" @leftClick="() => $router.back()" />
    <scroll-view
      class="info-page-content content-box"
      scroll-y="true"
      @scrolltolower="loadingMore"
    >
      <view class="item" v-for="(item, i) in list" :key="i">
        <view class="title">{{ item.title || "" }}</view>
        <view class="info">
          <u-text
            :color="'#8c8c8c'"
            :lines="2"
            :text="item.content || ''"
          ></u-text>
        </view>
        <view class="bottom">
          <view>{{ getTimestr(item.createDate) }}</view>
          <view class="btn" @click="checkInfo(item)">查看详情</view>
        </view>
      </view>
      <view class="more">{{
        finish ? "没有更多了" : loading ? "加载中" : "加载更多"
      }}</view>
    </scroll-view>

    <!-- 查看详情 -->
    <uni-popup ref="popup" type="bottom">
      <view class="info-box">
        <view class="title">{{ this.item.title || "" }}</view>
        <view class="time">{{ getTimestr(this.item.createDate) }}</view>
        <scroll-view class="content" scroll-y="true">
          <view>
            {{ this.item.content || "" }}
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { notification } from "@/api/api";
import { getTimestr } from "@/utils/time";

const titleMap = {
  1: "系统消息列表",
  2: "活动消息列表",
  3: "服务消息列表",
};
export default {
  name: "messageList",
  data() {
    return {
      type: 1, // 消息通知类型 1 系统 2 活动 3 服务  消息列表
      loading: false,
      finish: false,
      page: 1,
      list: [],

      item: {}, // 当前查看的元素
    };
  },
  onLoad(data) {
    this.type = data.type || 1;
    uni.setNavigationBarTitle({
      title: titleMap[this.type] || "消息列表",
    });
    this.getList();
  },
  methods: {
    getTimestr,
    // 获取列表
    getList(type) {
      this.loading = true;
      notification(this.page, 10, this.type)
        .then((res) => {
          if (!res.data) return;
          if (res.data.data?.length) {
            this.list.push(...res.data.data);
          }
          if (
            res.data.total === 0 ||
            (res.data.total && this.list.length >= res.data.total)
          )
            this.finish = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 加载更多
    loadingMore() {
      if (this.loading || this.finish) return;
      this.page++;
      this.getList();
    },
    // 查看详情
    checkInfo(item) {
      this.item = item;
      this.$refs.popup.open();
    },
  },
};
</script>

<style lang="scss" scoped>
.page-message {
  .content-box {
    .item {
      background-color: #fff;
      padding: 40rpx;
      border-radius: 9rpx;
      color: #8c8c8c;
      font-size: 26rpx;
      line-height: 40rpx;
      margin-bottom: 20rpx;

      .title {
        font-size: 36rpx;
        color: #484848;
        margin-bottom: 20rpx;
      }
      .info {
        height: 80rpx;
        overflow: hidden;
      }

      .bottom {
        margin-top: 40rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .btn {
    color: #449367;
  }
  .more {
    padding: 50rpx 0;
    text-align: center;
    font-size: 24rpx;
    color: #8c8c8c;
  }
}

.info-box {
  width: 100vw;
  height: 900rpx;
  background-color: #fff;
  border-top-right-radius: 22rpx;
  border-top-left-radius: 22rpx;
  box-sizing: border-box;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  font-size: 26rpx;
  line-height: 40rpx;

  .title {
    font-size: 36rpx;
    color: #484848;
    margin-bottom: 20rpx;
  }
  .time {
    margin-bottom: 20rpx;
  }
  .content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
