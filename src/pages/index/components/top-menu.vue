<template>
  <view class="top-menu">
    <view class="button-list flex-box">
      <u-button
        type="primary"
        color="#0277FF"
        @click="goNavigateTo('/pages/trade/index', '1')"
      >
        <u-image
          class="menu-icon"
          src="/static/icons/icon_recharge.svg"
          width="24px"
          height="24px"
        ></u-image>
        立刻充值
      </u-button>
      <u-button
        type="primary"
        color="#0DB4A0"
        @click="goNavigateTo('/pages/trade/index', '0')"
      >
        <u-image
          class="menu-icon"
          src="/static/icons/icon_withdraw.svg"
          width="24px"
          height="24px"
        ></u-image>
        立刻提现
      </u-button>
    </view>
    <view class="menu-list flex-box">
      <view
        class="menu-item flex-box"
        @click="pageTo(item)"
        v-for="(item, index) in menuList"
        :key="index"
      >
        <u-image
          class="menu-icon"
          :showLoading="true"
          :src="item.img"
          width="40px"
          height="40px"
        ></u-image>
        <text class="menu-text">{{ item.label }}</text>
      </view>
    </view>
    <slot />
    <u-modal :show="showPayDialog" title="快捷支付" @confirm="onPayToAmount">
      <view class="pay-box">
        <view class="pay-label">
          <text class="pay-label-text"
            >您正在使用即时到账支付功能\n请输入支付数量：</text
          >
        </view>
        <view class="pay-amount">
          <u-input
            class="pay-amount-input"
            border="surround"
            type="digit"
            placeholder="请输入支付数量"
            v-model.number="payAmount"
          >
            <text class="pay-amount-currency" slot="suffix">{{
              payCurrency
            }}</text>
          </u-input>
        </view>
        <view class="pay-tip">
          <u-alert
            v-if="payError"
            type="error"
            showIcon
            :description="payError"
          ></u-alert>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import { checkQrAddressType, getScanCodeOrder } from "../../../api/api";
// #ifdef H5
import QrcodeDecoder from "qrcode-decoder/dist";

/**
 * 获取文件地址函数
 * @param file
 * @returns {null}
 */
function getObjectURL(file) {
  let url;
  if (window.createObjectURL !== undefined) {
    // basic
    url = window.createObjectURL(file);
  } else if (window.URL !== undefined) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL !== undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}

/**
 * 解码，输出：中文
 * @param str
 * @returns {string}
 */
function decodeStr(str) {
  let out, i, len, c;
  let char2, char3;
  out = "";
  len = str.length;
  i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1);
        break;
      case 12:
      case 13:
        // 110x xxxx 10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx 10xx xxxx 10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        );
        break;
    }
  }
  return out;
}

// #endif

export default {
  name: "top-menu",
  data() {
    return {
      showPayDialog: false,
      payAmount: "",
      payError: "",
      payCurrency: "USDT",
      menuList: [
        {
          label: "我的订单",
          key: "received",
          router: "pages/myOrder/index",
          img: require("@/static/icons/icon_order.svg"),
        },
        {
          label: "我的挂单",
          key: "post",
          router: "pages/tradeRecord/index",
          img: require("@/static/icons/icon_pending_order.svg"),
        },
        {
          label: "收币",
          key: "received",
          router: "pages/receive/index",
          img: require("@/static/icons/icon_collect_coins.svg"),
        },
        {
          label: "扫一扫",
          key: "scan",
          router: "pages/scan",
          img: require("@/static/icons/icon_scan_code.svg"),
        },
        {
          label: "帮助",
          key: "scan",
          router: "pages/helpInfo/details",
          img: require("@/static/icons/icon_help.svg"),
        },
        {
          label: "客服",
          key: "scan",
          router: "pages/customer/index",
          img: require("@/static/icons/icon_customer_service.svg"),
        },
        // {
        //   label: "转账",
        //   key: "transfer",
        //   router: "pages/transfer/index",
        //   img: require("@/static/icons/received.svg"),
        // },
      ],
    };
  },
  watch: {
    payAmount() {
      this.checkAmount();
    },
  },
  methods: {
    checkAmount() {
      const amount = Number(this.payAmount);
      if (isNaN(amount) || amount <= 0) {
        this.payError = "请输入支付数量";
      } else {
        this.payError = "";
      }
    },
    onPayToAmount() {
      this.checkAmount();
      if (!this.payError) {
        getScanCodeOrder({
          address: this.payAddress,
          coinName: this.payCurrency,
          payNumber: this.payAmount,
        }).then((res) => {
          if (res.code.toString() === "0") {
            // coinName: "TRX"
            // orderState: "PENDING"
            // payNumber: "15.37490000"
            // payTime: "2022-07-15 15:42:02"
            // rate: "0.45530510"
            // receiveName: "roman0630"
            // scanCodeOrderNo: "p_202207151536241002336"
            uni.navigateTo({
              url:
                "/pages/payment/index?" +
                Object.keys(res.data.model)
                  .map((key) => `${key}=${res.data.model[key]}`)
                  .join("&"),
            });

            this.payAmount = "";
            this.payCurrency = "";
            this.payAddress = "";
            this.payError = "";
            this.showPayDialog = false;
          } else {
            if (res.message === "订单不存在") {
              this.payError = "虚拟币数量输入错误,请仔细核对!";
            } else {
              this.payError = res.message;
            }
          }
        });
      }
    },
    goNavigateTo(url, t) {
      getApp().globalData.switchTranType = t || "";
      uni.switchTab({
        url,
      });
    },
    /**
     * 检查扫码内容
     * @param address
     */
    checkAddress(address) {
      checkQrAddressType({ address }).then((res) => {
        if (res.code.toString() === "0" && res.data) {
          res.data.coinType = res.data.coinType || "";
          switch (Number(res.data.type)) {
            case 0:
              // 转账地址
              uni.navigateTo({
                url: `/pages/transfer/index?address=${address}&currency=${res.data.coinType.toUpperCase()}`,
              });
              break;
            case 1:
              // 收银台充值
              this.payCurrency = res.data.coinType;
              this.payAddress = address;
              this.payError = "";
              this.showPayDialog = true;
              break;
          }
        }
      });
    },
    pageTo({ router }) {
      if (router === "pages/scan") {
        this.scanCode().then((code) => {
          this.checkAddress(code);
        });
      } else if (router) {
        this.router({ url: router });
      }
    },
    scanCode() {
      return new Promise((resolve, reject) => {
        // #ifndef H5
        this.scanCodeApp(resolve, reject);
        // #endif
        // #ifdef H5
        this.scanCodeH5(resolve, reject);
        // #endif
      });
    },
    // #ifndef H5
    scanCodeApp(resolve, reject) {
      uni.scanCode({
        scanType: ["qrCode"],
        success: (res) => {
          console.error(JSON.stringify(res));
          if (res.result) {
            resolve(res.result);
          }
        },
        fail: (e) => {
          console.error(JSON.stringify(e));
        },
      });
    },
    // #endif
    // #ifdef H5
    scanCodeH5(resolve, reject) {
      uni.chooseImage({
        count: 1,
        success: (imgRes) => {
          const qr = new QrcodeDecoder();
          qr.decodeFromImage(getObjectURL(imgRes.tempFiles[0])).then((res) => {
            resolve(res.data);
          });
        },
      });
    },
    // #endif
  },
};
</script>

<style lang="scss">
.top-menu {
  background: #ffffff;
  border-radius: 10px 10px 0px 0px;
  padding: 5px 0 0 0;
  margin-top: -10px;
  position: relative;
  z-index: 971;
  .button-list {
    margin: 11px 16px 0 16px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    .u-button {
      height: 44px;
      margin-right: 9px;
      border-radius: 5px;
      font-size: 16px;
      &:last-child {
        margin-right: 0;
      }
      .menu-icon {
        margin-right: 10px;
      }
    }
  }
  .menu-list {
    flex-wrap: wrap;
    margin: 20px 0 12px 0;
    .menu-item {
      width: 33.33%;
      flex-direction: column;
      margin-bottom: 30px;

      .menu-icon {
        width: 40px;
      }

      .menu-text {
        font-size: 14px;
        color: #333333;
        margin-top: 5px;
      }
    }
  }
}

.pay-box {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;
  width: 100%;
}

.pay-label {
  width: 100%;
  text-align: left;

  &-text {
    color: #333333;
    font-size: 28rpx;
  }
}

.pay-amount {
  margin-top: 32rpx;

  &-input {
    border: 1px solid #dddddd;
    box-sizing: border-box;
  }

  &-currency {
    font-size: 28rpx;
    font-weight: bold;
    color: #333333;
  }
}

.pay-tip {
  margin-top: 20rpx;
  min-height: 70rpx;
}

::v-deep .u-modal__content {
  padding-bottom: 20rpx;
}
</style>
