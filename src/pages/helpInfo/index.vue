<!-- 客服 -->
<template>
  <view class="info-page-bg self-body page-customer">
    <u-navbar
      :safeAreaInsetTop="true"
      :title="'帮助中心'"
      @leftClick="() => $routers.back()"
    />
    <view class="self-status-bar"></view>
    <view class="info-page-content content-box">
      <uni-collapse accordion v-model="collapse">
        <uni-collapse-item
          :class="{ active: collapse == i, unactive: collapse != i }"
          :title="item.title"
          v-for="(item, i) in list"
          :key="i"
        >
          <view>
            <view
              class="link"
              @click="handleClick(link)"
              v-for="link in item.list"
              :key="link.id"
            >
              <text>{{ link.title }}</text>
              <u-image
                class="more"
                src="/static/images/mine/right.png"
                width="10rpx"
                height="18rpx"
              ></u-image>
            </view>
            <view v-if="!item.list.length" class="nodata">暂无数据</view>
          </view>
        </uni-collapse-item>
      </uni-collapse>
    </view>
  </view>
</template>

<script>
import { articlePage } from "@/api/api";
import storage from "@/utils/storage";

export default {
  name: "pageCustomer",
  data() {
    return {
      collapse: "-1",
      list: [
        { title: "帮助中心", type: 1, list: [] },
        { title: "用户协议", type: 2, list: [] },
      ],
    };
  },
  onLoad() {
    this.getList();
  },
  methods: {
    handleClick(link) {
      storage.set("help-info", link);
      uni.navigateTo({
        url: "/pages/helpInfo/info",
      });
    },
    // 获取帮助中心列表
    getList() {
      articlePage({
        pageNo: 1,
        pageSize: 1000,
      }).then((res) => {
        if (res.code == 200 && res.data && res.data.list) {
          (res.data.list || []).forEach((item) => {
            if (item.type == 1) {
              this.list[0].list.push(item);
            }
            if (item.type == 2) {
              this.list[1].list.push(item);
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-customer {
  .content-box {
    padding: 30rpx 0 0 0;
    font-size: 26rpx;
    color: #433f48;
    .active {
      padding: 0;
      ::v-deep .uni-collapse-item__title-text {
        padding: 0 40rpx;
      }
      ::v-deep .uni-collapse-item__title-arrow {
        margin-right: 60rpx;
      }
    }
    .unactive {
      padding: 0 40rpx;
    }
    .link {
      width: 100vw;
      height: 100rpx;
      background-color: #f1f1f1;
      border-bottom: 1px solid #e4e4e4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 70rpx 0 88rpx;
      color: #595959;
      font-size: 30rpx;
      box-sizing: border-box;
    }
    .nodata {
      font-size: 26rpx;
      color: #888;
      text-align: center;
      padding: 20rpx;
    }
  }
}
</style>
