<template>
  <view class="trade-details">
    <u-sticky offsetTop="0" customNavHeight="0">
      <notice-navbar customer title="交易详情"/>
    </u-sticky>
    <top-details :expireTime="expireTime" :order="order"></top-details>
    <view class="show-tab" v-if="order.appeal">
      <u-tabs
        lineWidth="50rpx"
        lineHeight="6rpx"
        lineColor="#505bde"
        :current="current"
        :activeStyle="{
          color: '#505bde',
          fontSize: '14px'
        }"
        :inactiveStyle="{
          color: '#999999'
        }"
        itemStyle="font-size:14px;box-sizing:border-box;padding:5px 10px;"
        :list="currencyList"
        @click="changeCurrency"
      ></u-tabs>
    </view>
    <order-details v-show="current === 0" :order="order"></order-details>
    <order-edit :getDetail="getDetail" :order="order"></order-edit>
    <view class="view-appeal">
      <view class="view-model">
        <appeal-info :appealInfo="order" v-show="current === 1"></appeal-info>
      </view>
    </view>
  </view>
</template>
<script>
import topDetails from "./components/top-details";
import orderDetails from "./components/order-details";
import orderEdit from "./components/order-edit";
import appealInfo from "./components/appeal-info";
import { getDetail } from "../../api/api";
import { mapGetters, mapActions } from "vuex";
import time from "../../mixins/time";
import noticeNavbar from "@/components/notice-navbar";

export default {
  mixins: [time],
  components: { topDetails, orderDetails, orderEdit, appealInfo, noticeNavbar },
  data() {
    return {
      orderSn: "",
      countdown: 0,
      order: {}, // 订单详情
      currencyList: [
        { name: "交易信息", value: 0 },
        { name: "申诉信息", value: 1 },
      ],
      current: 0,
    };
  },
  onLoad({ id }) {
    this.orderSn = id;
    this.getDetail();
  },
  onPullDownRefresh() {
    this.getDetail();
  },
  onBackPress() {
    uni.redirectTo({
      url: "pages/tradeRecord/index",
      params: { isTrade: true },
    });
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    expireTime() {
      const count = this.countdown - this.count;
      if (count <= 0) this.closeTimer();
      return count > 0 ? count : 0;
    },
  },
  methods: {
    ...mapActions("order", ["GET_AUTO_ORDER_INFO"]),
    getDetail() {
      const {
        userInfo: { id },
      } = this.userInfo;
      getDetail({ orderSn: this.orderSn }).then((res) => {
        if (res.code.toString() === '0' && res.data) {
          const { buyMemberId, expireDate, status } = res.data;
          if (status === "2" || status === "1") this.startTimer();
          this.countdown = expireDate;
          this.order = {
            ...res.data,
            advertiseType: id === buyMemberId ? "0" : "1",
          };
        }
        uni.stopPullDownRefresh();
      });
    },
    changeCurrency(val) {
      this.current = val.value;
    },
  },
};
</script>
<style lang="scss">
.trade-details {
  height: 100%;
  display: flex;
  flex-direction: column;
  //padding: 20px 0;

  .show-tab {
    padding: 16px;
    background: #fff;
    border-bottom: 1px solid #f8f8f8;
  }

  .view-appeal {
    flex: 1;
    position: relative;

    .view-model {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
    }
  }
}
</style>
