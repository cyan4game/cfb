<template>
  <view class="menu-box">
    <view class="flex-box-between">
      <view class="menu-but flex-box">
        <view
          class="menu-list"
          :class="{ 'menu-list-active': current === item.key }"
          v-for="(item, index) in topMenuList"
          :key="index"
          @click="changeMenu(item)"
        >
          {{ item.label }}
        </view>
      </view>
      <u-image
        src="/static/icons/record.svg"
        width="24px"
        height="24px"
        @click="pageTo"
      ></u-image>
    </view>
    <!-- <view class="coin-tabs">
      <u-tabs
        lineWidth="50"
        lineHeight="6rpx"
        lineColor="#505bde"
        :activeStyle="{
          color: '#505bde',
          fontSize: '14px',
        }"
        :inactiveStyle="{
          color: '#999999',
        }"
        itemStyle="width:55px;font-size:14px;box-sizing:border-box;padding:5px 0;"
        :list="currencyList"
        @click="changeCurrency"
      ></u-tabs>
    </view> -->
  </view>
</template>

<script>
import { getCurrency } from "../../../api/api";

export default {
  name: "order-header",
  props: {
    topMenuList: {
      type: Array,
      required: true,
    },
    current: {
      type: String,
      required: true,
    },
    isTrade: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currencyList: [], // 币种合集
    };
  },
  created() {
    this.getCurrency();
  },
  methods: {
    // 获取币种列表
    getCurrency() {
      getCurrency().then((res) => {
        if (res.code.toString() === "0") {
          this.currencyList = res.data.map((item) => {
            return { name: item };
          });
          this.changeCurrency(this.currencyList[0]);
        }
      });
    },
    changeCurrency(val) {
      this.$emit("changeCurrency", val);
      // console.log(val);
    },
    changeMenu(item) {
      this.$emit("changeMenu", item.key);
      this.$emit("update:current", item.key);
    },
    pageTo() {
      this.router({
        url: "pages/myOrder/index",
        params: {
          current: this.current,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-box {
  padding: 15px 16px;
  background: #fff;
  width: 100%;
  box-sizing: border-box;

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
</style>
