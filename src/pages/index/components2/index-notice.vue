<template>
  <view class="index-notice" @click="toMessage" v-if="!hideBox">
    <view class="flex-box-between mb-10">
      <view class="flex-box">
        <u-image
          :showLoading="true"
          src="/static/icons/notify.svg"
          width="24px"
          height="24px"
        ></u-image>
        <text class="n-text">通知</text>
      </view>
      <u-image
        :showLoading="true"
        src="/static/icons/right.svg"
        width="24px"
        height="24px"
      ></u-image>
    </view>
    <view :class="{'content-box': true, 'message-box': true, 'content-box-1': messageList.length === 1}">
      <template v-if="loaded">
        <view class="m-list flex-box" v-for="(item, i) in messageList" :key="i">
          <view v-if="item.title" class="m-title">{{ item.title }}</view>
          <!--          <div class="m-content ml-5">{{ item.content }}</div>-->
          <u-notice-bar
            icon=""
            fontSize="28rpx"
            color="#333333"
            bgColor="transparent"
            style="flex: 1;padding: 0;margin: 0 10rpx"
            :text="item.content"
          ></u-notice-bar>
          <text class="m-time">{{ item.time }}</text>
        </view>
      </template>
      <u-skeleton v-else loading animate :title="false" rows="2" rowsWidth="100%" rowsHeight="44rpx"></u-skeleton>
    </view>
  </view>
</template>

<script>
import {pushMsgLatestMsg} from "../../../api/api";

export default {
  name: "index-notice",
  data() {
    return {
      /**
       * 消息列表
       */
      messageList: [],
      loaded: false,
      task: NaN,
      span: 5 * 1000,
      messageEnum: {
        NOTIFY: '普通通知',
        ORDER_DETAILS: '订单',
        BILLING_CHANGES: '帐变',
        DISPATCH: '派单',
        RELEASED_COIN: '待放币',
        PAY: '待支付',
        SYSTEM_MAINTAIN: '系统维护'
      },
    };
  },
  computed: {
    hideBox() {
      return this.loaded && !this.messageList.length
    }
  },
  created() {
    // this.refreshMessage()
    // this.task = setInterval(() => {
    //   this.refreshMessage()
    // }, this.span)
  },
  beforeDestroy() {
    // this.task && clearInterval(this.task)
  },
  methods: {
    /**
     * 获取最新的消息
     */
    refreshMessage() {
      const token = uni.getStorageSync("token")
      token && pushMsgLatestMsg().then(res => {
        if (res.code.toString() === '0') {
          const list = []
          const pushMsg = res.data.pushMsgDTO
          pushMsg && list.push({
            type: pushMsg.type,
            title: this.messageEnum[pushMsg.type],
            content: pushMsg.message,
            time: this.$dayjs(Number(pushMsg.createTime)).fromNow()
          })
          const stationLetter = res.data.stationLetterDTO
          stationLetter && list.push({
            type: stationLetter.type,
            title: stationLetter.typeName,
            content: stationLetter.content,
            time: this.$dayjs(stationLetter.createTime).fromNow()
          })
          this.messageList = list
          this.loaded = true
          this.$forceUpdate()
        }
      }).catch(_ => {
        console.error(_)
      })
    },
    toMessage() {
      uni.navigateTo({
        url: "/pages/message/index",
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.index-notice {
  padding: 0 10px;
}

.n-text {
  color: #333333;
  font-size: 14px;
  margin-left: 5px;
}

.content-box {
  padding: 12px 13px;
  height: 80px;
  overflow: hidden;
  box-sizing: border-box;

  &-1 {
    height: 46px !important;
  }

  .m-list {
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    //height: 50%;
    margin-bottom: 12px;
    color: #fff;

    .m-title {
      background: #63b72e 0 0 no-repeat padding-box;
      border-radius: 4rpx;
      font-size: 24rpx;
      padding: 6rpx 10rpx;
    }

    .m-content {
      color: #333333;
      font-size: 14px;
    }

    .m-time {
      color: #999999;
      font-size: 24rpx;
    }
  }
}
</style>
