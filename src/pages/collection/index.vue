<!-- 收款方式 -->
<template>
  <view class="info-page-bg self-body page-collection-list">
    <u-navbar
      :safeAreaInsetTop="true"
      :title="'收款方式'"
      @leftClick="() => $routers.back()"
    />
    <view class="self-status-bar"></view>
    <view class="info-page-content content-box">
      <!-- 银行卡 -->
      <view
        class="item"
        @click="jump('/pages/collection/bank', 'bankCardStatus')"
      >
        <u-image
          class="icon"
          src="@/static/images/mine/icon-bank.png"
          width="41rpx"
          height="41rpx"
        ></u-image>
        <view>银行卡</view>
        <view class="info info-ed" v-if="!openStaus.bankCardStatus">关闭</view>
        <view class="info" v-else :class="{ 'info-ed': status.bank }">{{
          status.bank ? "已绑定" : "未绑定"
        }}</view>
        <u-image
          class="right"
          src="@/static/images/mine/right.png"
          width="15rpx"
          height="29rpx"
        ></u-image>
      </view>

      <!-- 数字人民币 -->
      <view class="item" @click="jump('/pages/collection/digt', 'cnyStatus')">
        <u-image
          class="icon"
          src="@/static/images/mine/icon-digt.png"
          width="41rpx"
          height="41rpx"
          style="margin-right: 21rpx"
        ></u-image>
        <view>数字人民币</view>
        <view class="info info-ed" v-if="!openStaus.cnyStatus">关闭</view>
        <view class="info" v-else :class="{ 'info-ed': status.digt }">{{
          status.digt ? "已绑定" : "未绑定"
        }}</view>
        <u-image
          class="right"
          src="@/static/images/mine/right.png"
          width="15rpx"
          height="29rpx"
        ></u-image>
      </view>

      <!-- 支付宝 -->
      <view
        class="item"
        @click="jump('/pages/collection/alipay', 'aliPayStatus')"
      >
        <u-image
          class="icon"
          src="@/static/images/mine/icon-alipay.png"
          width="41rpx"
          height="41rpx"
        ></u-image>
        <view>支付宝</view>
        <view class="info info-ed" v-if="!openStaus.aliPayStatus">关闭</view>
        <view class="info" v-else :class="{ 'info-ed': status.alipay }">{{
          status.alipay ? "已绑定" : "未绑定"
        }}</view>
        <u-image
          class="right"
          src="@/static/images/mine/right.png"
          width="15rpx"
          height="29rpx"
        ></u-image>
      </view>

      <!-- 微信 -->
      <view
        class="item"
        @click="jump('/pages/collection/wechat', 'weixinPayStatus')"
      >
        <u-image
          class="icon"
          src="@/static/images/mine/icon-wechat.png"
          width="41rpx"
          height="41rpx"
        ></u-image>
        <view>微信</view>
        <view class="info info-ed" v-if="!openStaus.weixinPayStatus">关闭</view>
        <view class="info" v-else :class="{ 'info-ed': status.wechat }">{{
          status.wechat ? "已绑定" : "未绑定"
        }}</view>
        <u-image
          class="right"
          src="@/static/images/mine/right.png"
          width="15rpx"
          height="29rpx"
        ></u-image>
      </view>
    </view>

    <!-- 未绑定身份信息的提示 -->
    <confirm-dialog
      ref="idDialog"
      :title="'提示'"
      :content="'请先完成实名认证'"
      :borderBtn="'取消'"
      :btn="'去认证'"
      :btnHandle="btnHandle"
    />
  </view>
</template>

<script>
import { queryPayBindInfo } from "@/api/api";
import storage from "@/utils/storage";

// payType	支付方式类型 1支付宝 2微信 3银行卡 4数字人民币
export default {
  name: "collectionList",
  data() {
    return {
      userInfo: {},
      list: [],
      openStaus: {
        // 开放状态
        bankCardStatus: true,
        weixinPayStatus: true,
        aliPayStatus: true,
        cnyStatus: true,
      },
      status: {}, // 状态 wechat  alipay   bank

      idenInfo: {}, // 认证信息
    };
  },
  onShow() {
    this.userInfo = storage.get("userInfo") || {};
    this.idenInfo = storage.get("idenInfo") || {};
    this.checkStatus();
    this.openStaus.bankCardStatus = this.userInfo.bankCardStatus;
    this.openStaus.weixinPayStatus = this.userInfo.weixinPayStatus;
    this.openStaus.aliPayStatus = this.userInfo.aliPayStatus;
    this.openStaus.cnyStatus = this.userInfo.cnyStatus;
  },
  methods: {
    btnHandle() {
      this.$refs.idDialog.close();
      uni.navigateTo({
        url: "/pages/identification/index",
      });
    },
    // 跳转
    jump(name, status) {
      if (!this.openStaus[status])
        return uni.showToast({
          title: "该支付方式已关闭",
          icon: "none",
          duration: 2000,
        });
      // if (this.idenInfo.certificationType <= 1) return this.$refs.idDialog.open();
      uni.navigateTo({
        url: name,
      });
    },
    // 检测绑定状态
    checkStatus() {
      const paywayMap = storage.get("paywayMap");
      if (paywayMap) {
        this.status = paywayMap;
      }
      queryPayBindInfo().then((res) => {
        if (res.code == 200 && res.data && res.data.length) {
          this.status = {
            alipay: res.data.some((item) => item.payType == 1),
            wechat: res.data.some((item) => item.payType == 2),
            bank: res.data.some((item) => item.payType == 3),
            digt: res.data.some((item) => item.payType == 4),
          };
          storage.set("paywayMap", this.status);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.page-collection-list {
  .content-box {
    .item {
      height: 136rpx;
      border-bottom: 1px solid #cecece;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #454545;
      font-size: 32rpx;
      .icon {
        margin-right: 29rpx;
      }
      .info {
        color: #e02f2f;
        font-size: 28rpx;
        flex: 1;
        text-align: right;
      }
      .info-ed {
        color: #999;
      }
      .right {
        margin-left: 32rpx;
      }
    }
  }
}
</style>
