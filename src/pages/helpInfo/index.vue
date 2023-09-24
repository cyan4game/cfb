<!-- 客服 -->
<template>
  <view class="page-customer">
    <view class="content-box">
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
  background-color: #0e1216;
  padding-top: 20rpx;
  height: 100%;
  box-sizing: border-box;

  .content-box {
    box-sizing: border-box;
    border-top-left-radius: 22rpx;
    border-top-right-radius: 22rpx;
    background-color: #fff;
    padding: 60rpx;
    font-size: 26rpx;
    color: #433F48;
    min-height: 100vh;
    .info {
      padding: 60rpx;
    }
  }
}
</style>