<!-- 详情 -->
<template>
  <view class="info-page-bg order-info">
    <view class="info-page-content content-box">
      <view class="title">{{ orderStatusMap[item.orderStatus] || "--" }}</view>

      <!-- 
        申诉中-订单正在申诉中请您耐心等待
        待付款—倒计时-订单正在付款中请您耐心等待
        收款待确认-订单已付款请确认
        订单超时-订单已超时请重新发起订单
        交易取消-交易已取消
        申诉处理中-订单正在申诉中请您耐心等待
        申诉成功—收款失败-系统已重新开始为您处理订单
        申诉失败—收款成功-根据提供的申诉资料判定您已收款成功
        驳回-您的申诉已被驳回
      -->
      <view class="info"
        >
        <!-- 待付款 -->
        <text v-if="item.orderStatus == 2">倒计时 </text>
        {{ orderStatusTipMap[item.orderStatus] }}
        <!-- 成功 -->
        <text v-if="item.orderStatus == 0">{{ orderTypeMap[item.orderType] }}{{ item.buyAmount }}{{ item.buyCoin }}</text>
        </view
      >

      <!-- <view class="box">
          <view class="avatar"></view>
          <view class="content">
              <view class="name">Picker</view>
              <view>C2C订单消息]订单已完成</view>
          </view>
          <view class="btn">聊天</view>
      </view> -->

      <view class="subtitle">
        <coin-icon
          style="margin-right: 16rpx; width: 50rpx; height: 50rpx"
          :coin="item.buyCoin"
        />
        <text>{{ orderTypeMap[item.orderType] }}{{ item.buyCoin }}</text>
      </view>

      <view class="container" style="border-bottom: 1px solid #dfdfdf">
        <view class="info-item">
          <view class="item-name">汇率</view>
          <view class="item-box">{{ item.exchange }}:1</view>
        </view>
        <view class="info-item">
          <view class="item-name">数量</view>
          <view class="item-box">{{ item.buyAmount }}{{ item.buyCoin }}</view>
        </view>
        <view class="info-item">
          <view class="item-name">金额</view>
          <view class="item-box">
            <text>￥{{ item.payAmount }}</text>
            <u-image
              @click="copy(item.payAmount)"
              class="copy"
              src="/static/images/funds/copy.png"
              width="26rpx"
              height="31rpx"
            ></u-image>
          </view>
        </view>
      </view>

      <view class="container" style="border-bottom: 1px solid #dfdfdf">
        <view class="info-item">
          <view class="item-name">收款方式</view>
          <view class="item-box bank">{{
            payWayMap[item.payWay] || "--"
          }}</view>
        </view>
        <view class="info-item">
          <view class="item-name">收款账号</view>
          <view class="item-box">{{ item.gatherNo }}</view>
        </view>
      </view>

      <view class="container">
        <view class="info-item">
          <view class="item-name">订单编号</view>
          <view class="item-box">
            <text>{{ item.orderNo }}</text>
            <u-image
              @click="copy(item.orderNo)"
              class="copy"
              src="/static/images/funds/copy.png"
              width="26rpx"
              height="31rpx"
            ></u-image>
          </view>
        </view>
        <view class="info-item">
          <view class="item-name">交易时间</view>
          <view class="item-box">{{ getTimestr(item.dealTime) }}</view>
        </view>
      </view>

      <view class="btns">
        <!-- 申诉中 -->
        <template v-if="item.orderStatus == 1">
          <view class="submit">撤销申诉</view>
        </template>
        <!-- 待付款 -->
        <template v-if="item.orderStatus == 2">
          <view class="btn">取消交易</view>
          <view class="submit">确认付款</view>
        </template>
        <!-- 收款待确认 -->
        <template v-if="item.orderStatus == 3">
          <view class="btn" @click="appeal">申诉</view>
          <view class="submit">确认收款</view>
        </template>
        <!-- 申诉处理中 -->
        <template v-if="item.orderStatus == 6">
          <view class="submit">撤销申诉</view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import { orderTypeMap, orderStatusMap, orderStatusTipMap } from "./map.js";
import storage from "@/utils/storage";
import { getTimestr } from "@/utils/time";
import { copyTxt } from "@/utils/utils";

const payWayMap = {
  1: "银行卡",
  2: "支付宝",
  3: "微信",
};

export default {
  name: "orderInfo",
  data() {
    return {
      orderStatusTipMap,
      payWayMap,
      orderStatusMap,
      orderTypeMap,
      item: {},
    };
  },
  onLoad() {
    this.item = storage.get("curr-order") || {};
  },
  methods: {
    getTimestr,
    // 去申诉
    appeal() {
      uni.navigateTo({
        url: "/pages/appeal/index",
      });
    },
    // 复制
    copy(txt) {
      copyTxt(txt);
      uni.showToast({
        title: "复制成功",
        icon: "none",
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.order-info {
  color: #38363b;
  font-size: 28rpx;
  .content-box {
    border-top-right-radius: 6rpx;
    border-top-left-radius: 6rpx;
    overflow: auto;
  }
  .title {
    color: #38363b;
    font-size: 40rpx;
    margin-bottom: 27rpx;
  }
  .info {
    color: #38363b;
    font-size: 28rpx;
    margin-bottom: 38rpx;
  }
  .box {
    min-height: 158rpx;
    border-radius: 10rpx;
    background-color: #f0f0f0;
    margin-bottom: 60rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 27rpx;
    .avatar {
      background: #dee1e9;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 20rpx;
    }
    .btn {
      padding: 0 40rpx;
      height: 55rpx;
      background-color: #0d1115;
      color: #fff;
      font-size: 26rpx;
      border-radius: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 20rpx;
    }
    .content {
      flex: 1;
      color: #343635;
      font-size: 24rpx;
      .name {
        font-size: 28rpx;
        margin-bottom: 4rpx;
      }
    }
  }
  .subtitle {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .coin {
      margin-right: 16rpx;
    }
  }
  .container {
    padding: 44rpx 0 0 0;
    .info-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 44rpx;
      color: #7a7a7a;
      .item-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: #3c3c3c;
        .copy {
          margin-left: 24rpx;
        }
      }
      .bank {
        border-left: 1px solid #2ea984;
        padding-left: 20rpx;
        line-height: 20rpx;
      }
    }
  }
  .btns {
    margin: 80rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
      box-sizing: border-box;
      height: 96rpx;
      flex: 1;
      margin-right: 30rpx;
      border: 1px solid #38363b;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #38363b;
      font-size: 32rpx;
      border-radius: 6rpx;
    }
    .submit {
      box-sizing: border-box;
      border-radius: 6rpx;
      flex: 2;
      height: 96rpx;
      background-color: #449367;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 32rpx;
    }
  }
}
</style>
