<!-- 客服 -->
<template>
  <view class="info-page-bg self-body page-customer">
    <u-navbar
      :safeAreaInsetTop="false"
      :title="'帮助中心'"
      @leftClick="() => $routers.back()"
    />
    <view class="info-page-content content-box">
      <uni-collapse accordion>
        <uni-collapse-item
          :title="item.title"
          v-for="(item, i) in list"
          :key="i"
        >
          <view style="padding-bottom: 40rpx">
            <view class="link" @click="handleClick(link)" v-for="link in item.list" :key="link.id">
              <text>{{ link.title }}</text>
            </view>
            <view v-if="!item.list.length" class="nodata">暂无数据</view>
          </view>
        </uni-collapse-item>
      </uni-collapse>
    </view>
  </view>
</template>

<script>
import { helpList } from "@/api/api";
import storage from '@/utils/storage'

export default {
  name: "pageCustomer",
  data() {
    return {
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
      storage.set('help-info', link)
      uni.navigateTo({
         url: '/pages/helpInfo/info'
      })
    },
    // 获取帮助中心列表
    getList() {
      helpList({
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
    font-size: 26rpx;
    color: #433f48;
    .link {
      margin: 20rpx 0 0 60rpx;
      padding-bottom: 20rpx;
      width: 550rpx;
      border-bottom: 1px solid #e4e4e4;
    }
    .nodata {
      font-size: 26rpx;
      color: #888;
      text-align: center;
      padding-top: 20rpx;
    }
  }
}
</style>
