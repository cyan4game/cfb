<template>
  <movable-area class="movable-area">
    <movable-view
      @click="handlePost"
      class="movable-btn"
      :x="x"
      :y="y"
      direction="all"
    >
      <u-image width="60px" height="60px" src="/static/icons/add.svg"></u-image>
    </movable-view>
    <view class="index-content">
      <notice-navbar :back="false" title="交易"></notice-navbar>
      <order-header
        isTrade
        @changeCurrency="changeCurrency"
        :current.sync="current"
        @changeMenu="changeMenu"
        :topMenuList="topMenuList"
      ></order-header>
      <!--    过滤组件-->
      <filter-component @changeFilter="changeFilter"></filter-component>
      <!--    订单列表-->
      <order-list
        :loadMore.sync="loadMore"
        :getTrade="getTrade"
        :tradeList="tradeList"
        :current="current"
        :page.sync="page"
        :pages="pages"
      ></order-list>
    </view>
  </movable-area>
</template>

<script>
import noticeNavbar from "@/components/notice-navbar/index";
import filterComponent from "./components/filter-component";
import orderHeader from "./components/order-header";
import orderList from "./components/order-list";
import {
  getTradeList,
  getCurrency,
  querySysAdvertiseList,
} from "../../api/api";
import { mapActions } from "vuex";

export default {
  name: "index",
  components: { noticeNavbar, filterComponent, orderList, orderHeader },
  data() {
    return {
      topMenuList: [
        { label: "购买", key: "1", value: "buy", isRequest: true },
        { label: "出售", key: "0", value: "sell", isRequest: true },
        // { label: "信誉出售", key: "3", value: "reputation", isRequest: false },
      ],
      current: "1",
      currency: "",
      x: 0,
      y: 0,
      page: 1,
      pageSize: 20,
      tradeList: [], // 订单列表
      pages: 1,
      loadMore: false,
    };
  },
  onReady() {
    uni.getSystemInfo({
      complete: (info) => {
        this.y = info.windowHeight - 10 - 60;
        this.x = info.windowWidth - 10 - 60;
      },
    });
  },
  async onShow() {
    if (getApp().globalData.switchTranType)
      this.current = getApp().globalData.switchTranType;
    await this.getCurrency();
    this.getTrade();
    this.GET_AUTO_ORDER_INFO();
    this.GET_BANK_LIST();
  },
  async onPullDownRefresh() {
    this.page = 1;
    await this.getTrade();
    // setTimeout(() => {
    uni.stopPullDownRefresh();
    // }, 1000);
  },
  methods: {
    ...mapActions("order", ["GET_AUTO_ORDER_INFO"]),
    ...mapActions("user", ["GET_BANK_LIST"]),
    // 获取币种列表
    getCurrency() {
      return new Promise((resolve, reject) => {
        getCurrency().then((res) => {
          if (res.code.toString() === "0" && res.data) {
            this.currency = res.data[0];
          }
          resolve();
        });
      });
    },
    changeFilter(item) {
      const { current, label } = item;
      const params = {};
      if (current === "coin") {
        switch (label) {
          case "0":
            params.minAmount = 0;
            params.maxAmount = 1000;
            break;
          case "1":
            params.minAmount = 1000;
            params.maxAmount = 5000;
            break;
          case "2":
            params.minAmount = 5000;
            params.maxAmount = 10000;
            break;
          case "3":
            params.minAmount = 10000;
            params.maxAmount = 20000;
            break;
          case "4":
            params.minAmount = 20000;
            params.maxAmount = 50000;
            break;
          case "5":
            params.minAmount = 50000;
            break;
        }
      } else if (current === "sort") {
        params.sortType = label;
      }
      this.getTrade(params);
    },
    changeCurrency(val) {
      this.currency = val.name;
      this.page = 1;
      this.getTrade();
    },
    changeMenu(val) {
      this.current = val;
      this.page = 1;
      this.getTrade();
    },
    handlePost() {
      this.router("pages/post/index");
    },
    async getTrade(data = {}) {
      let fastOrder = [];
      if (!this.loadMore) {
        const res = await querySysAdvertiseList({
          advertiseType: this.current,
          coinUnit: this.currency,
        });
        if (res.code == 0 && res.data) fastOrder = res.data;
      }
      return new Promise((resolve, reject) => {
        const params = {
          currentPage: this.page,
          pageSize: this.pageSize,
          advertiseType: this.current,
          coinUnit: this.currency,
          ...data,
        };
        getTradeList(params)
          .then((res) => {
            if (res.code.toString() === "0") {
              if (res.data) {
                if (this.loadMore) {
                  this.tradeList = this.tradeList.concat(
                    this.addId(res.data.rows)
                  );
                } else this.tradeList = this.addId(res.data.rows);
                this.pages = +res.data.pages;
              } else this.tradeList = [];
            }
            if (fastOrder && fastOrder.length)
              this.tradeList = fastOrder.concat(this.tradeList);
            resolve();
            this.loadMore = false;
          })
          .catch(() => {
            this.loadMore = false;
            reject();
          });
      });
    },
    addId(list) {
      return [...list].map((item) => {
        item.loading = false;
        return item;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.index-content {
  height: 100%;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
}
.coin-tabs {
  margin: 10px 0;
}
.movable-area {
  height: 100%;
  width: 100%;

  .movable-btn {
    width: 60px;
    height: 60px;
    font-size: 12px;
    //background-color: #4cd964;
    border-radius: 59%;
    text-align: center;
    line-height: 60px;
    color: #fff;
    font-weight: bold;
    z-index: 900;
  }
}
</style>
