<!-- 详情 -->
<template>
  <view class="info-page-bg self-body order-info">
    <u-navbar
      :safeAreaInsetTop="true"
      :title="'订单详情'"
      @leftClick="() => $routers.back()"
    />
    <view class="self-status-bar"></view>
    <view class="info-page-content content-box">
      <view class="title">
        <text>{{
          getOrderStatusMap(item.orderType)[item.orderStatus] || "--"
        }}</text>
        <text class="money" v-if="item.orderStatus == 2"
          >￥{{ item.payAmount }}</text
        >
      </view>

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
      <view class="info">
        <!-- 待付款 -->
        <!-- <text v-if="item.orderStatus == 2">倒计时 </text> -->
        {{ orderStatusTipMap[item.orderStatus] }}
        <!-- 成功 -->
        <text v-if="item.orderStatus == 0"
          >{{ orderTypeMap[item.orderType] }} {{ item.buyAmount }}
          {{ item.buyCoin || item.payCoin || "CFB" }}</text
        >
      </view>

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
          :coin="item.buyCoin || item.payCoin || 'CFB'"
        />
        <text
          >{{ orderTypeMap[item.orderType]
          }}{{ item.buyCoin || item.payCoin || "CFB" }}</text
        >
      </view>

      <view class="container" style="border-bottom: 1px solid #dfdfdf">
        <view class="info-item">
          <view class="item-name">汇率</view>
          <view class="item-box">{{ item.exchange || "1" }}:1</view>
        </view>
        <view class="info-item">
          <view class="item-name">数量</view>
          <view
            class="item-box"
            :style="{ color: item.orderStatus == 2 ? '#449367' : '' }"
            >{{ item.buyAmount
            }}{{ item.buyCoin || item.payCoin || "CFB" }}</view
          >
        </view>
        <view class="info-item" v-if="item.orderStatus != 2">
          <view class="item-name">金额</view>
          <view class="item-box" :style="{ color: '#449367' }"
            >￥{{ item.payAmount }}</view
          >
        </view>
      </view>

      <view
        class="container"
        style="border-bottom: 1px solid #dfdfdf; padding: 84rpx 0 43rpx 0"
      >
        <text>收款信息</text>
        <view
          v-if="item.orderStatus == 2 && item.buyUserId == userInfo.id"
          style="color: #ff4040; margin-top: 8rpx"
          >请使用您本人的支付宝向以下账号转账，如使用其他姓名转账会导致购买失败！</view
        >
      </view>

      <view class="container" style="border-bottom: 1px solid #dfdfdf">
        <view class="info-item">
          <view class="item-name">收款方式</view>
          <view class="item-box">
            <u-image
              v-if="payWayIcons[item.payWay]"
              style="margin-right: 10rpx"
              :src="payWayIcons[item.payWay]"
              width="31rpx"
              height="31rpx"
            ></u-image>
            <text>{{ paywayMap[item.payWay] }}</text>
          </view>
        </view>
        <view class="info-item">
          <view class="item-name">收款人姓名</view>
          <view class="item-box">
            <text>{{ item.gatherUserName }}</text>
            <u-image
              v-if="item.gatherUserName"
              @click="copy(item.gatherUserName)"
              class="copy"
              src="/static/images/funds/copy.png"
              width="26rpx"
              height="31rpx"
            ></u-image>
          </view>
        </view>
        <view class="info-item">
          <view class="item-name">收款账号</view>
          <view class="item-box">
            <text>{{ item.gatherNo }}</text>
            <u-image
              v-if="item.gatherNo"
              @click="copy(item.gatherNo)"
              class="copy"
              src="/static/images/funds/copy.png"
              width="26rpx"
              height="31rpx"
            ></u-image>
          </view>
        </view>
        <view
          class="info-item"
          v-if="[2, 3, 4].includes(item.payWay) && item.orderStatus == 2"
        >
          <view class="item-name">收款二维码</view>
          <view class="item-box" @click="showQRcode = true">
            <text style="color: #f71919">查看二维码</text>
          </view>
        </view>
      </view>

      <view class="container">
        <view class="info-item">
          <view class="item-name">订单编号</view>
          <view class="item-box">
            <text>{{ item.orderNo }}</text>
            <u-image
              v-if="item.orderNo"
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
          <!-- CFB-739 -->
          <view class="item-box">{{ getTimestr(item.createDate) }}</view>
        </view>
        <!-- 终态才有结束时间 -->
        <view
          class="info-item"
          v-if="[0, 4, 5, 7, 8, 9].includes(item.orderStatus)"
        >
          <view class="item-name">交易结束时间</view>
          <view class="item-box">{{ getTimestr(item.finishTime) }}</view>
        </view>
      </view>
      <view
        class="tip-box"
        v-if="item.orderStatus == 2 && item.buyUserId == userInfo.id"
      >
        <u-image
          class="icon"
          src="/static/images/mine/warnning.png"
          width="32rpx"
          height="32rpx"
        ></u-image>
        <text
          >转账完成后，请点击下方【确认付款】按钮，如果
          未点击该按钮，15分钟后订单会自动失败，您的资金也会有损失的风险</text
        >
      </view>

      <view class="btns">
        <!-- 申诉中 -->
        <template v-if="item.orderStatus == 1">
          <view class="submit" @click="() => $refs.appealCancel.open()"
            >撤销申诉</view
          >
        </template>
        <!-- 待付款/待收款 -->
        <template v-if="item.orderStatus == 2">
          <view class="btn" @click="() => $refs.orderCancel.open()"
            >取消交易</view
          >
          <!-- 购买才有此按钮 -->
          <view
            v-if="item.buyUserId == userInfo.id"
            class="submit"
            @click="() => $refs.uploadDialog.open()"
            >确认付款</view
          >
        </template>
        <!-- 已付款/收款待确认 -->
        <template v-if="item.orderStatus == 3">
          <view class="btn" @click="appeal">申诉</view>
          <!-- 卖家才有此按钮 -->
          <view
            v-if="item.sellUserId == userInfo.id"
            class="submit"
            @click="() => $refs.sureGet.open()"
            >确认收款</view
          >
        </template>
        <!-- 申诉处理中 -->
        <template v-if="item.orderStatus == 6">
          <view class="submit" @click="() => $refs.appealCancel.open()"
            >撤销申诉</view
          >
        </template>
      </view>
    </view>

    <!-- 确认收款确认 -->
    <confirm-dialog
      ref="sureGet"
      :key="'sure-get'"
      :title="'确认收款'"
      :btn="'确认收款'"
      :content="'你已经成功收款了吗？'"
      :borderBtn="'取消'"
      :btnHandle="sureGetHandle"
    />
    <!-- 取消交易确认 -->
    <confirm-dialog
      ref="orderCancel"
      :key="'order-cancel'"
      :title="'取消交易'"
      :btn="'取消交易'"
      :content="'确认取消交易吗？'"
      :borderBtn="'关闭'"
      :btnHandle="orderCancelHandle"
    />
    <!-- 撤销申诉确认 -->
    <confirm-dialog
      ref="appealCancel"
      :key="'appeal-cancel'"
      :title="'撤销申诉'"
      :btn="'撤销申诉'"
      :content="'确认撤销申诉吗？'"
      :borderBtn="'取消'"
      :btnHandle="appealCancelHandle"
    />
    <!-- 提交凭证弹窗 -->
    <upload-dialog @success="submitPic" ref="uploadDialog" />
    <!-- 二维码弹窗 -->
    <view class="qrcode-dialog" v-if="showQRcode" @click="showQRcode = false">
      <u-image
        mode="contain"
        class="qrcode-img"
        :src="item.gatherQR"
        width="100%"
      ></u-image>
    </view>
  </view>
</template>

<script>
import { orderTypeMap, getOrderStatusMap, orderStatusTipMap } from "./map.js";
import { paywayMap, payWayIcons } from "@/utils/dataMap.js";
import storage from "@/utils/storage";
import { getTimestr } from "@/utils/time";
import { copyTxt } from "@/utils/utils";
import {
  pageOtcMyOrder,
  confirmCollect,
  orderCancel,
  confirmPay,
} from "@/api/api";

export default {
  name: "orderInfo",
  data() {
    return {
      userInfo: {},
      payWayIcons,
      orderStatusTipMap,
      paywayMap,
      orderTypeMap,
      item: {},
      showQRcode: false,
    };
  },
  onShow() {
    this.userInfo = storage.get("userInfo") || {};
    this.item = storage.get("curr-order") || {};
    setTimeout(() => {
      this.getInfo();
    }, 0);
  },
  methods: {
    getOrderStatusMap,
    getTimestr,
    // 获取订单详情
    getInfo() {
      if (!this.item.id) return;
      pageOtcMyOrder({
        id: this.item.id,
        orderId: this.item.id,
        pageNo: 1,
        pageSize: 1,
      }).then((res) => {
        if (
          res.code == 200 &&
          res.data &&
          res.data.list &&
          res.data.list.length
        ) {
          this.item = res.data.list[0];
          storage.set("curr-order", this.item);
        }
      });
    },
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
    // 确认收款
    sureGetHandle() {
      uni.showLoading({
        title: "",
        mask: true,
      });
      confirmCollect({
        orderId: this.item.id,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$refs.sureGet.close();
            uni.showToast({
              title: "操作成功",
              icon: "none",
              duration: 2000,
            });
            this.getInfo();
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    // 取消申诉
    appealCancelHandle() {
      this.$refs.appealCancel.close();
    },
    // 取消交易
    orderCancelHandle() {
      uni.showLoading({
        title: "",
        mask: true,
      });
      orderCancel({
        orderId: this.item.id,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$refs.orderCancel.close();
            uni.showToast({
              title: "操作成功",
              icon: "none",
              duration: 2000,
            });
            this.getInfo();
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    // 确认付款
    submitPic(pic) {
      uni.showLoading({
        title: "",
        mask: true,
      });
      confirmPay({
        orderId: this.item.id,
        paymentVoucher: pic,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$refs.uploadDialog.close();
            uni.showToast({
              title: "操作成功",
              icon: "none",
              duration: 2000,
            });
            this.getInfo();
          }
        })
        .finally(() => {
          uni.hideLoading();
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
    padding: 74rpx 60rpx 200rpx 60rpx;
    overflow: auto;
  }
  .title {
    color: #38363b;
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 28rpx;
    display: flex;
    position: relative;
    justify-content: space-between;
    .money {
      position: relative;
      top: 30rpx;
    }
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
  .tip-box {
    margin-top: 80rpx;
    background-color: #f1f1f1;
    padding: 27rpx 20rpx 20rpx 80rpx;
    border-radius: 4rpx;
    color: #444242;
    font-size: 26rpx;
    line-height: 40rpx;
    position: relative;
    .icon {
      position: absolute;
      left: 30rpx;
      top: 30rpx;
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
      font-size: 26rpx;
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
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    width: 630rpx;
    bottom: 60rpx;
    z-index: 99;
    left: 50%;
    transform: translateX(-50%);
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
      flex: 1;
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

.qrcode-dialog {
  position: fixed;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .qrcode-img {
    width: 100%;
    background-color: #fff;
    padding: 24rpx;
    box-sizing: border-box;
  }
}
</style>
