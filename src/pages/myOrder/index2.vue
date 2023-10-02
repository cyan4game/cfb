<template>
  <view class="trade-view">
    <view class="menu-content">
      <view class="menu-but flex-box">
        <view
          class="menu-list"
          :class="{ 'menu-list-active': current === item.key }"
          v-for="(item, index) in currencyList"
          :key="index"
          @click="changeMenu(item)"
        >
          {{ item.label }}
        </view>
      </view>
    </view>
    <view class="trade-header">
      <!-- <u-tabs
        lineWidth="50rpx"
        lineHeight="6rpx"
        lineColor="#505bde"
        :current="current"
        :activeStyle="{
          color: '#505bde',
          fontSize: '14px',
        }"
        :inactiveStyle="{
          color: '#999999',
        }"
        itemStyle="font-size:14px;box-sizing:border-box;padding:5px 10px;"
        :list="currencyList"
        @click="changeCurrency"
      ></u-tabs> -->
      <view class="flex-box status-list" @touchstart.stop>
        <view
          class="menu-list"
          :class="{ 'menu-list-active': status === item.key }"
          v-for="(item, index) in statusList"
          :key="index"
          @click="changeStatusMenu(item)"
        >
          {{ item.name }}
        </view>
      </view>
    </view>
    <view class="view-content">
      <view class="view-full-scroll" v-if="isShow">
        <u-list class="full-list" height="100%" @scrolltolower="loadMore">
          <u-list-item v-for="(item, index) in dataList" :key="index">
            <tradeItem :current="current" :count="count" :item="item" />
          </u-list-item>
          <u-loadmore v-show="dataList.length > 10" :status="loadStatus" />
        </u-list>
      </view>
    </view>
  </view>
</template>

<script>
import { postBar, orderStatus } from "../../utils/data";
import { getMyOrders, queryTrade } from "../../api/api";
import tradeItem from "./components/trade-item";
import { debounce } from "../../utils/debounce";
import { mapGetters } from "vuex";
import time from "../../mixins/time";

export default {
  name: "index",
  components: { tradeItem },
  mixins: [time],
  data() {
    return {
      current: "1",
      currencyList: [
        { label: "购买单", key: "1" },
        { label: "出售单", key: "0" },
      ],
      orderStatus: [],
      status: "",
      page: {
        currentPage: 1,
        pageSize: 20,
      },
      dataList: [],
      loadStatus: "loadmore",
      pages: 1,
      isLoad: false,
      isShow: true,
    };
  },
  onLoad({ current }) {
    this.current = current || "1";
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    statusList() {
      return orderStatus;
    },
  },
  watch: {
    count(val) {
      let count = 0;
      this.dataList.forEach((item) => {
        if (item.status === "1" || item.status === "2") {
          if (val < +item.expireDate) {
            count++;
          } else {
            this.debounceFn();
          }
        }
      });
      if (count === 0) {
        this.closeTimer();
      }
    },
  },
  onShow() {
    this.getData();
    this.debounceFn = debounce(this.getData, 60000);
  },
  async onPullDownRefresh() {
    this.page.currentPage = 1;
    await this.getData();
    // setTimeout(() => {
    uni.stopPullDownRefresh();
    // }, 1000);
  },
  methods: {
    changeCurrency({ value }) {
      this.isShow = false;
      this.dataList = [];
      this.$nextTick(() => {
        this.isShow = true;
        // this.dataList = [];
        this.page.currentPage = 1;
        this.current = value;
        this.status = "";
        this.getData();
      });
    },
    changeMenu(item) {
      this.current = item.key;
      this.getData();
    },
    changeStatusMenu(item) {
      this.status = item.key;
      this.getData();
    },
    getData() {
      return new Promise(async (resolve) => {
        if (this.current === 0) {
          await this.getTrade();
        } else {
          await this.getPost();
        }
        resolve();
      });
    },
    getPost() {
      const params = {
        status: this.status,
        ...this.page,
      };
      this.closeTimer(); // 请求我的发布 关闭订单倒计时
      return new Promise((resolve) => {
        queryTrade(params)
          .then((res) => {
            if (res.code.toString() === "0" && res.data) {
              if (this.isLoad) {
                this.dataList = this.dataList.concat(...res.data.rows);
              } else {
                this.dataList = [...res.data.rows];
              }
            } else {
              this.dataList = [];
            }
            this.isLoad = false;
            resolve();
          })
          .catch(() => {
            this.isLoad = false;
          });
      });
    },
    // 获取订单列表
    getTrade() {
      const params = {
        status: this.status,
        ...this.page,
      };
      return new Promise((resolve) => {
        getMyOrders(params)
          .then((res) => {
            if (res.code.toString() === "0" && res.data) {
              if (this.isLoad) {
                this.dataList = this.dataList.concat(
                  this.returnTrade(res.data.rows)
                );
              } else {
                this.dataList = res.data.rows;
              }
              this.startTimer();
            } else {
              this.dataList = [];
            }
            this.isLoad = false;
            resolve();
          })
          .catch(() => {
            this.isLoad = false;
          });
      });
    },
    // 加载更多
    async loadMore() {
      if (this.page.currentPage > this.pages) {
        this.loadStatus = "nomore";
      } else {
        this.isLoad = true;
        this.page.currentPage++;
        this.loadStatus = "loading";
        await this.getData();
        if (this.page.currentPage > this.pages) {
          this.loadStatus = "nomore";
        } else {
          this.loadStatus = "loadmore";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.trade-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  .menu-content {
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: flex-start;
    padding: 15px 0 0 15px;
    .menu-but {
      border-radius: 5px;
      border: 1px solid #5157e6;
      .menu-list {
        font-size: 14px;
        color: #505bde;
        padding: 5px 25px;
        &-active {
          background: #505bde;
          color: #fff;
        }
      }
    }
  }
  .trade-header {
    width: 100%;
    background: #fff;
    padding: 0 15px 0;

    .status-list {
      flex-basis: 88px;
      flex-shrink: 0;
      white-space: nowrap;
      overflow-x: scroll;
      padding: 0 15px 16px 0;
    }

    .menu-list {
      font-size: 14px;
      color: #999999;
      padding: 5px 10px;
      margin-top: 15px;

      &-active {
        background: #505bde;
        border-radius: 3px;
        color: #fff;
      }
    }
  }

  .view-content {
    flex: 1;
    position: relative;

    .view-full-scroll {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      box-sizing: border-box;
      padding: 20rpx 20rpx 0;
    }
  }
}
</style>
