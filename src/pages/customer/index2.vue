<template>
  <view class="show-customer">
    <view @click="openMeiQiaChatView" class="customer-list flex-box-between">
      <view class="flex-box">
        <u-image width="40px" height="40px" src="/static/images/meiqia.png"></u-image>
        <text class="cus-label">网页客服</text>
      </view>
      <u-text
        size="14"
        align="right"
        :iconStyle="{ color: '#999' }"
        color="#505bde"
        suffixIcon="arrow-right"
        text="立即联系"
      ></u-text>
    </view>
    <view
      @click="openUrl(item)"
      class="customer-list flex-box-between"
      v-for="(item, index) in customerList"
      :key="index"
    >
      <view class="flex-box">
        <u-image
          width="40px"
          height="40px"
          :src="returnUrl(item.accountType)"
        ></u-image>
        <text class="cus-label">{{ item.accountTypeName }}</text>
      </view>
      <u-text
        size="14"
        align="right"
        :iconStyle="{ color: '#999' }"
        color="#505bde"
        suffixIcon="arrow-right"
        text="立即联系"
      ></u-text>
    </view>
  </view>
</template>

<script>
import { getCustomerList } from "../../api/api";
// #ifdef APP-PLUS
const MeiQia = uni.requireNativePlugin("MeiQia-ChatPlugin");
// #endif
export default {
  name: "index",
  data() {
    return {
      customerList: [],
      accountType: [
        // 1QQ 2skype 3telegram
        { label: "QQ", key: "1", url: "/static/common/qq.svg" },
        { label: "skype", key: "2", url: "/static/common/skype.svg" },
        {
          label: "telegram",
          key: "3",
          url: "/static/common/telegram.svg",
        },
      ],
    };
  },
  created() {
    this.getCustomerList();
  },
  methods: {
    openMeiQiaChatView() {
      // // #ifdef APP-PLUS
      // MeiQia.initChatViewManger();
      // MeiQia.configChatViewStyle({
      //   "navBarBackgroundColor": "rgb(80, 91, 222)", // 设置导航栏的背景色；
      //   "navBarTitleTxtColor": "#ffffff", // 设置导航栏上的 title 的颜色；
      //   "enableShowClientAvatar": true, // 是否支持当前用户头像的显示
      // });
      // MeiQia.showMeiQiaChatView();
      // // #endif
      // // #ifdef H5
      // this.openUrl({ accountUrl: 'https://chatlink.mstatik.com/widget/standalone.html?eid=070fd279148125c1796c0bbb30697df1' })
      // // #endif
      this.page()
    },
    page() {
      uni.$u.route('/pages/customer/meiqia')
    },
    open() {
      this.$refs.popup.open('top')
    },
    getCustomerList() {
      getCustomerList().then((res) => {
        if (res.code.toString() === '0') {
          // this.customerList = res.data;
        }
      });
    },
    returnUrl(accountType) {
      let url = "";
      try {
        url = this.accountType.find((item) => item.key === accountType).url;
      } catch (e) {
        console.log(e);
      }
      return url;
    },
    openUrl({ accountUrl }) {
      if (accountUrl) {
        const tempWindow = window.open();
        tempWindow.location.href = accountUrl;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.show-customer {
  padding: 10px;
  .web {
    height: 500px;
  }
  .customer-list {
    padding: 15px;
    border-radius: 10px;
    background: #fff;
    margin-bottom: 6px;
    .cus-label {
      font-size: 16px;
      color: #333333;
      margin-left: 16px;
    }
  }
}
</style>
