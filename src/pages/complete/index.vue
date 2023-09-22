<template>
  <view class="complete-view">
    <u-image
      class="flex-box"
      width="60px"
      height="60px"
      src="/static/icons/success.svg"
    ></u-image>
    <view class="show-label">{{ showList.label }}</view>
    <view class="show-main-tip" v-show="showList.mainTip">{{
      showList.mainTip
    }}</view>
    <u-button
      class="login-button"
      @click="pageTo(showList.mainRoute, showList.mainTab)"
      type="primary"
      :text="showList.mainButton"
    ></u-button>
    <u-button
      v-show="showList.subTab"
      class="sub-button"
      @click="pageTo(showList.sunRoute, false, showList.orderSn)"
      plain
      type="primary"
      :text="showList.subButton"
    ></u-button>
    <view
      class="back-text"
      @click="pageTo(showList.linkRoute, false, showList.orderSn)"
      >{{ showList.linkText }}</view
    >
  </view>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      typeList: [
        {
          label: "挂单发布成功",
          key: "isPost",
          mainButton: "返回首页",
          mainRoute: "pages/index/index",
          mainTab: true,
          subButton: "再发布一笔",
          subTab: true,
          sunRoute: "pages/post/index",
          linkText: "查看交易记录",
          linkRoute: "pages/tradeRecord/index",
          title: "",
        },
        {
          label: "您已完成付款",
          key: "isBuy",
          mainTip: "请耐心等待卖家确认收款, 并放币",
          mainButton: "返回首页",
          mainRoute: "pages/index/index",
          mainTab: true,
          subTab: false,
          linkText: "查看订单详情",
          linkRoute: "pages/tradeDetails/index",
          title: "购买-",
          orderSn: "",
        },
        {
          label: "您已完成放币",
          key: "isSell",
          mainButton: "返回首页",
          mainRoute: "pages/index/index",
          mainTab: true,
          subTab: false,
          linkText: "查看订单详情",
          linkRoute: "pages/tradeDetails/index",
          title: "完成",
          orderSn: "",
        },

        {
          label: "申诉提交成功",
          key: "appeal",
          mainButton: "返回首页",
          mainRoute: "pages/index/index",
          mainTab: true,
          subTab: true,
          subButton: "申诉详情",
          sunRoute: "pages/tradeDetails/index",
          linkText: "查看交易记录",
          linkRoute: "pages/tradeRecord/index",
          title: "申诉成功",
          orderSn: "",
        },
      ],
      type: "isPost",
    };
  },
  onLoad({ type, orderSn, coinUnit }) {
    if (type) this.type = type;
    if (orderSn) this.showList.orderSn = orderSn;
    if (coinUnit) this.showList.title += coinUnit;
    uni.setNavigationBarTitle({
      title: this.showList.title,
    });
  },
  computed: {
    showList() {
      const obj = this.typeList.find((item) => item.key === this.type);
      return obj;
    },
  },
  mounted() {
    var a = document.getElementsByClassName("uni-page-head-hd")[0];
    a.style.display = "none";
  },
  methods: {
    pageTo(url, mainTab, orderSn) {
      // console.log(url);
      this.router({
        url: url,
        type: mainTab ? "switchTab" : "redirectTo",
        params: {
          id: orderSn ? orderSn : "",
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.complete-view {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
  .show-label {
    margin: 20px 0 50px;
    font-size: 17px;
    color: #63b72e;
    text-align: center;
  }
  .login-button {
    background: #505bde;
    border-color: #505bde;
    margin-top: 30px;
  }
  .sub-button {
    margin-top: 20px;
    border-color: #505bde;
    color: #505bde;
  }
  .back-text {
    font-size: 14px;
    color: #0277ff;
    margin-top: 20px;
    text-align: center;
  }
  .show-main-tip {
    margin: 0 0 31px;
    text-align: center;
    font-size: 14px;
    ccolor: #333333;
  }
}
</style>
