<template>
  <view class="mine-menu">
    <view class="top-menu flex-box-between">
      <view class="view-item" @click="pageTo(item)" v-for="(item, i) in topList" :key="i">
        <u-image width="58px" height="58px" :src="item.icon"></u-image>
        <view class="label">{{ item.label }}</view>
      </view>
    </view>
    <view class="bottom-menu">
      <view class="flex-box-between" @click="pageTo(item)" v-for="(item, i) in bottomList" :key="i">
        <u-image width="24px" height="24px" :src="item.icon"></u-image>
        <view class="show-label">{{ item.label }}</view>
        <u-image width="24px" height="24px" src="@/static/icons/right.svg"></u-image>
      </view>
    </view>
    <view @click="show=true" class="log-out bottom-menu flex-box-between">
      <u-image width="24px" height="24px" src="@/static/icons/logout.svg"></u-image>
      <view class="show-label">退出</view>
      <u-image width="24px" height="24px" src="@/static/icons/right.svg"></u-image>
    </view>
    <bs-dialog :show="show" title="登出" content="是否确定退出？" @cancel="show=false" @confirm="onLogout"></bs-dialog>
  </view>
</template>

<script>
import customModal from "@/components/custom-modal/index.vue"
import bsDialog from "@/components/bs-dialog/index.vue"

export default {
  name: "mine-menu",
  components: {customModal, bsDialog},
  data () {
    return {
      show: false,
      topList: [
        {
          label: "用户账变",
          icon: require("@/static/icons/book.svg"),
          router: "pages/changeRecord/index"
        },
        {
          label: "支付订单",
          icon: require("@/static/icons/order.svg"),
          router: "pages/payOrder/index"
        },
        {
          label: "支付管理",
          icon: require("@/static/icons/pay.svg"),
          router: "pages/bank/index"
        },
        {
          label: "地址簿",
          icon: require("@/static/icons/qr.svg"),
          router: "pages/coinAddress/index"
        }
      ],
      bottomList: [
        {
          label: "安全中心",
          icon: require("@/static/icons/safe.svg"),
          router: "pages/safety/index"
        },
        {
          label: "在线客服",
          icon: require("@/static/icons/cus.svg"),
          router: "pages/customer/meiqia"
        },
        {
          label: "帮助中心",
          icon: require("@/static/icons/help.svg"),
          router: "pages/helpInfo/index"
        },
        {
          label: "设置",
          icon: require("@/static/icons/set.svg"),
          router: "pages/setting/index"
        }
      ]
    }
  },
  methods: {
    pageTo ({router}) {
      if (router) this.router(router)
    },
    onLogout () {
      this.show = false
      this.$store.dispatch("user/LOG_OUT").then(res => {
        if (res.code.toString() === "0") {
          this.router("pages/login/index")
        }
      }).catch(_ => {
        console.error(_)
        this.router("pages/login/index")
      })
    }
  }
}
</script>

<style lang="scss">
.mine-menu {
  .top-menu {
    padding: 50px 10px 20px;
    background: #fff;

    .view-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }

  .bottom-menu {
    margin-top: 6px;
    padding: 0 16px;
    background: #fff;
  }

  .show-label {
    margin: 0 10px;
    border-bottom: 1px solid #f8f8f8;
    flex: 1;
    padding: 19px 0;
    font-size: 16px;
    color: #333333;
  }

  .log-out {
    margin: 6px 0 20px;
  }
}
</style>
