<template>
  <view class="top-details">
    <view
      class="tips-view flex-box"
      v-if="Number(order.status) === 1 || Number(order.status) === 2"
    >
      <u-image
        width="20px"
        height="20px"
        src="/static/icons/tips.svg"
      ></u-image>
      <text class="tips-text" v-if="Number(order.advertiseType) === 0">
        请务必使用该银行卡付款，否则造成损失，平台概不负责。
      </text>
      <text class="tips-text" v-else>
        请仔细检查是否有收到买家付款，或全额付款。如果未付款，或未全额付款，您可发起申诉。否则造成损失，平台概不负责。
      </text>
    </view>
    <view
      class="show-count flex-box"
      v-if="Number(order.status) === 1 || Number(order.status) === 2"
    >
      <text
        class="show-count-label"
        v-if="
          (Number(order.status) === 1 && Number(order.advertiseType) === 0) ||
          (Number(order.status) === 2 && Number(order.advertiseType) === 1)
        "
        >请在</text
      >
      <text
        class="show-count-label"
        v-if="
          (Number(order.status) === 2 && Number(order.advertiseType) === 0) ||
          (Number(order.status) === 1 && Number(order.advertiseType) === 1)
        "
      >
        {{ Number(order.advertiseType) === 1 ? "买家" : "卖家" }}将在
      </text>
      <text class="show-count-time">{{ formatTime(expireTime) }}</text>
      <text class="show-count-label">
        内
        <text
          v-if="
            (Number(order.advertiseType) === 0 && Number(order.status) === 1) ||
            (Number(order.advertiseType) === 1 && Number(order.status) === 1)
          "
        >
          支付
        </text>
        <text
          v-if="
            (Number(order.advertiseType) === 0 && Number(order.status) === 2) ||
            (Number(order.advertiseType) === 1 && Number(order.status) === 2)
          "
        >
          放币
        </text>
      </text>
    </view>
    <view class="view-status">
      <view class="flex-box-between mb-10">
        <text class="t-label">
          <!-- {{ Number(order.advertiseType) === 1 ? "出售" : "购买"
          }}{{ order.coinUnit }} -->
          订单状态
        </text>
        <text
          v-if="order.hasOwnProperty('id')"
          class="show-status"
          :class="returnStatus(orderStatus, order.status).color"
        >
          {{ returnStatus(orderStatus, order.status).name }}
        </text>
      </view>
      <view class="flex-box-between mb-10">
        <text class="t-label">订单号</text>
        <text class="value uni-flex-item">{{ order.orderSn }}</text>
        <u-icon
          size="40rpx"
          name="/static/icons/copy.svg"
          @click="
            $uni.setClipboardData({ data: order.orderSn, showToast: true })
          "
        ></u-icon>
      </view>
      <view class="flex-box-between">
        <text class="t-label">交易金额</text>
        <text class="show-amount">￥{{ order.amount }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { orderStatus } from "../../../utils/data";
import { formatTime } from "../../../utils/utils";

export default {
  name: "top-details",
  props: {
    order: {
      type: Object,
      required: true,
    },
    expireTime: {
      type: Number,
    },
  },
  data() {
    return {
      orderStatus,
      formatTime,
    };
  },
  methods: {
    returnStatus(list, status) {
      return list.find((item) => item.key === status);
    },
  },
};
</script>

<style lang="scss" scoped>
.top-details {
  padding: 20px;
  background: #fff;
  margin-bottom: 6px;
  .tips-view {
    background: #ffe6e6;
    border-radius: 10px;
    padding: 10px;
    align-items: flex-start;
    .tips-text {
      color: #ef3c3c;
      font-size: 14px;
      margin-left: 10px;
    }
  }
  .show-count {
    margin: 25px 0;
    justify-content: center;
    &-label {
      font-size: 16px;
      color: #333333;
    }
    &-time {
      font-size: 24px;
      color: #ef3c3c;
      margin: 0 10px;
    }
  }
  .view-status {
    .t-label {
      font-size: 14px;
      color: #333333;
    }
  }
  .show-amount {
    font-size: 14px;
    color: #ef3c3c;
  }
  .show-status {
    font-size: 14px;
  }
}
</style>
