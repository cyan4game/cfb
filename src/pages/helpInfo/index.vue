<!-- 客服 -->
<template>
  <view class="info-page-bg self-body page-customer">
    <u-navbar :safeAreaInsetTop="false" :title="'帮助中心'" @leftClick="() => $routers.back()" />
    <view class="info-page-content content-box">
      <uni-collapse accordion>
        <uni-collapse-item :title="item.title" v-for="(item, i) in list" :key="i">
          <view class="info" v-html="item.content"></view>
        </uni-collapse-item>
      </uni-collapse>
    </view>
  </view>
</template>


<script>
import { helpList } from '@/api/api'

export default {
  name: "pageCustomer",
  data() {
    return {
      list: []
    }
  },
  onLoad() {
    this.getList()
  },
  methods: {
    // 获取帮助中心列表
    getList() {
      helpList({
        pageNo: 1,
        pageSize: 1000,
      }).then(res => {
        if (res.code == 200 && res.data && res.data.list) {
          this.list = res.data.list || []
        }
        console.error('帮助', res)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.page-customer {

  .content-box {
    font-size: 26rpx;
    color: #433F48;
    .info {
      padding: 60rpx;
      width: 550rpx;
      overflow: auto;
    }
  }
}
</style>