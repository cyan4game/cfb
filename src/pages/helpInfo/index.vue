<!-- 客服 -->
<template>
  <view class="info-page-bg self-body page-customer">
    <u-navbar :safeAreaInsetTop="false" :title="'帮助中心'" @leftClick="() => $routers.back()" />
    <view class="info-page-content content-box">
      <uni-collapse accordion>
        <uni-collapse-item :title="item.title" v-for="(item, i) in list" :key="i">
          <view class="info">
            {{ item.content }}
          </view>
        </uni-collapse-item>
      </uni-collapse>
    </view>
  </view>
</template>


<script>

export default {
  name: "pageCustomer",
  data() {
    return {
      list: [
        { title: '常见问题', content: '这是内容' },
        { title: '转币与收币', content: '这是内容' },
        { title: 'OTC交易', content: '这是内容' },
        { title: '收银与支付', content: '这是内容' },
        { title: '新手指导', content: '这是内容' },
      ]
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
    }
  }
}
</style>