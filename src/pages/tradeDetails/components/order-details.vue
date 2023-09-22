<template>
  <view class="order-details">
    <view class="view-order">
      <view class="flex-box-between mb-10">
        <text class="label">下单时间</text>
        <text class="value">{{ order.createTime }}</text>
      </view>
      <!-- <view class="flex-box-between mb-10">
        <text class="label">单价</text>
        <text class="value">￥{{ order.price }}</text>
      </view> -->
      <view class="flex-box-between mb-10">
        <text class="label">金额</text>
        <text class="value">{{ order.number }}/{{ order.coinUnit }}</text>
      </view>
      <view class="flex-box-between mb-10">
        <text class="label">手续费</text>
        <text class="value">￥{{ order.sellFeeAmount }}</text>
      </view>
      <view class="flex-box-between" v-show="order.payTime">
        <text class="label">付款时间</text>
        <text class="value">{{ order.payTime }}</text>
      </view>
    </view>
    <view class="show-trade flex-box">
      <u-image
        width="24px"
        height="24px"
        src="/static/icons/bank.svg"
      ></u-image>
      <text class="label ml-10">
        {{
          Number(order.advertiseType) === 0 ? "卖方收款信息" : "买方付款信息"
        }}
      </text>
    </view>
    <view class="sell-view view-order">
      <view class="flex-box-between">
        <text class="label mb-10">
          {{ `${Number(order.advertiseType) === 1 ? "付" : "收"}款人` }}
        </text>
        <view class="flex-box">
          <text class="value mr-5">
            {{
              Number(order.advertiseType) !== 1
                ? order.sellBankUserName
                : order.buyBankUserName
            }}
          </text>
          <u-image
            @click="
              handleCopy(
                Number(order.advertiseType) !== 1
                  ? order.sellBankUserName
                  : order.buyBankUserName
              )
            "
            src="/static/icons/copy.svg"
            width="20px"
            height="20px"
          ></u-image>
        </view>
      </view>
      <view class="flex-box-between">
        <text class="label mb-10">
          {{ `${Number(order.advertiseType) === 1 ? "付" : "收"}款银行` }}
        </text>
        <text class="value">
          {{
            Number(order.advertiseType) !== 1
              ? order.sellBankName
              : order.buyBankName
          }}
        </text>
      </view>
      <view class="flex-box-between">
        <text class="label">
          {{ `${Number(order.advertiseType) === 1 ? "付" : "收"}款卡号` }}
        </text>
        <view class="flex-box">
          <text class="value mr-5">
            {{
              Number(order.advertiseType) !== 1
                ? order.sellBankNo
                : order.buyBankCardNo
            }}
          </text>
          <u-image
            @click="
              handleCopy(
                order.advertiseType !== '1'
                  ? order.sellBankNo
                  : order.buyBankCardNo
              )
            "
            src="/static/icons/copy.svg"
            width="20px"
            height="20px"
          ></u-image>
        </view>
      </view>
    </view>
    <view class="show-trade flex-box">
      <u-image
        width="24px"
        height="24px"
        src="/static/icons/bank.svg"
      ></u-image>
      <text class="label ml-10">
        {{ `我方${Number(order.advertiseType) === 1 ? "收" : "付"}款信息` }}
      </text>
    </view>
    <view class="sell-view view-order">
      <view class="flex-box-between">
        <text class="label mb-10">
          {{ Number(order.advertiseType) === 1 ? "收" : "付" }}款人
        </text>
        <text class="value">
          {{
            Number(order.advertiseType) === 1
              ? order.sellBankUserName
              : order.buyBankUserName
          }}
        </text>
      </view>
      <view class="flex-box-between">
        <text class="label mb-10">
          {{ Number(order.advertiseType) === 1 ? "收" : "付" }}款银行
        </text>
        <text class="value">
          {{
            Number(order.advertiseType) === 1
              ? order.sellBankName
              : order.buyBankName
          }}
        </text>
      </view>
      <view class="flex-box-between">
        <text class="label">银行卡号</text>
        <text class="value">
          {{
            Number(order.advertiseType) === 1
              ? order.sellBankNo
              : order.buyBankCardNo
          }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "order-details",
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleCopy(value) {
      uni.setClipboardData({
        data: value,
        success: () => {
          // console.log("success", value);
          // this.showToast({
          //   type: "success",
          //   message: "复制成功",
          //   iconUrl: "https://cdn.uviewui.com/uview/demo/toast/error.png",
          // });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.order-details {
  .view-order {
    padding: 15px 20px;
    background: #fff;
  }

  .show-trade {
    padding: 10px 16px;
  }
}
</style>
