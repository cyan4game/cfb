<template>
  <view class="index-teach flex-box-between">
    <view
      class="content-box teach-item"
      v-for="(item, i) in teachList"
      :key="i"
      :style="{ width: item.width }"
      @click="toHelp(item)"
    >
      <view class="flex-box-between content-box">
        <text class="teach-title">{{ item.title }}</text>
        <u-image
          src="/static/icons/right.svg"
          width="24px"
          height="24px"
        ></u-image>
      </view>
      <text class="item-label">{{ item.text }}</text>
      <u-image
        :showLoading="true"
        :src="item.icon"
        width="60px"
        height="44px"
      ></u-image>
    </view>
  </view>
</template>

<script>
export default {
  name: "index-teach",
  data() {
    return {
      teachList: [
        {
          title: "新手指导",
          text: "从0~1学会财富宝钱包",
          width: "66%",
          icon: require("@/static/icons/t1.svg"),
          id: 1
        },
        {
          title: "OTC交易",
          text: "买卖详尽攻略",
          width: "32%",
          icon: require("@/static/icons/t2.svg"),
          id: 2
        },
        {
          title: "收银与支付",
          text: "数字货币支付款项",
          width: "32%",
          icon: require("@/static/icons/t3.svg"),
          id: 3
        },
        {
          title: "转币与收币",
          text: "与其他钱包间转账",
          width: "32%",
          icon: require("@/static/icons/t4.svg"),
          id: 4
        },
        {
          title: "常见问题",
          text: "疑问答案都在这里",
          width: "32%",
          icon: require("@/static/icons/t5.svg"),
          id: 5
        },
      ],
    };
  },
  methods: {
    toHelp({id, title}) {
      uni.navigateTo({
        url: `/pages/helpInfo/details?name=${title}&id=${id}`
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.content-box {
  background: #fff 0 0 no-repeat padding-box;
  border-radius: 10rpx;
  //box-shadow: 1px 1px 1px #f00;
}

.index-teach {
  padding: 0 20rpx;
  margin-top: 12rpx;
  flex-wrap: wrap;

  .teach-item {
    padding: 20rpx 0 0 12rpx;
    margin-bottom: 12rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: #fff;

    .item-label {
      font-size: 24rpx;
      color: #999999;
      margin-bottom: 18rpx;
    }
  }

  .teach-title {
    color: #333;
    font-size: 28rpx;
    font-weight: 700;
  }
}
</style>
