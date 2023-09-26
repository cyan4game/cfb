<template>
  <view class="address-view">
    <notice-navbar back title="地址簿" rightText="添加新地址" @rightClick="onAdd"></notice-navbar>
    <coinList
      @change="changeCoin"
      :bookList="bookList"
      v-model="coin"
      :coinList="coinList"
      :getBook="getBook"
    />
  </view>
</template>

<script>
import noticeNavbar from "@/components/notice-navbar";
import coinList from "./components/coin-list";
import {getAddressBookList, getCurrency} from "@/api/api";

export default {
  name: "index",
  components: {coinList, noticeNavbar},
  data() {
    return {
      bookList: [],
      coinList: [],
      coin: "",
    };
  },
  async onPullDownRefresh() {
    this.getCurrency();
    await this.getBook();
    uni.stopPullDownRefresh();
  },
  onLoad({coin}) {
    if (coin) this.coin = coin;
  },
  onShow() {
    this.getCurrency();
    this.getBook();
  },
  methods: {
    onAdd() {
      this.router("pages/addAddress/index");
    },
    getBook() {
      return new Promise((resolve) => {
        const params = {};
        if (this.coin) params.coin = this.coin;
        getAddressBookList(params).then((res) => {
          if (res.code.toString() === '0') {
            this.bookList = res.data;
          }
          resolve();
        });
      });
    },
    getCurrency() {
      getCurrency().then((res) => {
        if (res.code.toString() === '0') {
          this.coinList = res.data;
        }
      });
    },
    changeCoin() {
      this.getBook();
    },
  },
};
</script>

<style lang="scss" scoped>
.address-view {
  height: 100%;
}
</style>
