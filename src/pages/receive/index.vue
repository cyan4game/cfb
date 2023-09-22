<template>
  <view class="page">
    <!-- <view class="page-top">
      <u-tabs
        :activeStyle="{color: '#515ad7'}"
        lineColor="#515ad7"
        :list="currencyList"
        keyName="coinStr"
        @change="onCurrencyClick">
      </u-tabs>
      <view class="page-top-select" v-if="currency && currency.subTransferCoinInfo.length">
        <view
          :class="{'page-top-select-item': true, 'page-top-select-item-active': currencySubIndex === i}"
          v-for="(v, i) in currency.subTransferCoinInfo"
          :key="i"
          @click="currencySubIndex = i"
        >
          <text class="page-top-select-item-text">{{ v.coinStr.split('_')[1] }}</text>
        </view>
      </view>
    </view> -->
    <view class="page-body">
      <view class="page-body-box">
        <u-text
          size="32rpx"
          align="center"
          color="#505bde"
          bold
          :text="'扫二维码, 转入 ' + ((currency && currency.name) || '')"
        ></u-text>
        <qrcode
          class="page-body-qrcode"
          size="145"
          ref="qrcode"
          canvas-id="qrcode"
          :value="(dataMap[target] && dataMap[target].address) || ''"
        ></qrcode>
        <!--        <u-image-->
        <!--          width="290rpx"-->
        <!--          height="290rpx"-->
        <!--          :showMenuByLongpress="false"-->
        <!--          loadingIcon=""-->
        <!--          errorIcon=""-->
        <!--          bgColor="#ffffff"-->
        <!--          class="page-body-qrcode"-->
        <!--          :src="dataMap[target] ? 'data:image/jpeg;base64,' + dataMap[target].qrcode : ''"-->
        <!--        ></u-image>-->
        <u-text
          align="center"
          size="28rpx"
          color="#666666"
          text="收款地址"
        ></u-text>
        <u-text
          margin="20rpx 0 60rpx 0"
          class="page-body-address"
          size="28rpx"
          align="center"
          color="#0277ff"
          :text="dataMap[target] && dataMap[target].address"
        ></u-text>
      </view>
      <u-button
        class="page-body-btn"
        :disabled="!dataMap[target]"
        @click="handleCopy(dataMap[target] && dataMap[target].address)"
        color="#505bde"
        type="primary"
        text="复制地址"
      ></u-button>
      <u-button
        class="page-body-btn-boder"
        :disabled="!dataMap[target]"
        @click="saveQR"
        text="保存收款码"
      ></u-button>
      <!--      <u-button-->
      <!--        class="page-body-btn"-->
      <!--        color="#505bde"-->
      <!--        :plain="true"-->
      <!--        type="default"-->
      <!--        text="重新整理"-->
      <!--      ></u-button>-->
    </view>
  </view>
</template>

<script>
import qrcode from "../../common/uQRCode/components/u-qrcode/u-qrcode.vue";
import { getMemberTransferInfo, getQrcode } from "@/api/api";
import { getTransferCoinInfo } from "../../api/api";

export default {
  components: {
    qrcode,
  },
  data() {
    return {
      currencyIndex: 0,
      currencySubIndex: 0,
      currencyList: [],
      dataMap: {},
      qrcode: "",
    };
  },
  computed: {
    target() {
      return this.currencySub
        ? this.currencySub.name
        : this.currency
        ? this.currency.name
        : "";
    },
    currencySub() {
      return (
        this.currency &&
        this.currency.subTransferCoinInfo[this.currencySubIndex]
      );
    },
    currency() {
      return this.currencyList[this.currencyIndex];
    },
  },
  watch: {
    currencyIndex() {
      this.currencySubIndex = 0;
      this.$forceUpdate();
      this.getQrcode();
    },
    currencySubIndex() {
      this.getQrcode();
    },
  },
  created() {
    this.getCurrency().then((res) => {
      this.getQrcode();
    });
  },
  methods: {
    onCurrencyClick({ index, item }) {
      this.currencyIndex = index;
    },
    getQrcode() {
      const that = this;
      const coin = that.currencySub
        ? that.currencySub.coinName
        : that.currency
        ? that.currency.coinName
        : "";
      const target = this.target;
      if (coin) {
        uni.showLoading({
          title: "加载中...",
          mask: true,
        });
        this.dataMap[target] = undefined;
        getQrcode({ coin })
          .then((res) => {
            uni.hideLoading();
            if (res.code.toString() === "0") {
              this.dataMap[target] = res.data;
              this.$forceUpdate();
            }
          })
          .catch((_) => {
            console.error(_);
            uni.hideLoading();
          });
      }
    },
    /**
     * 获取币种列表
     * @returns {Promise<unknown>}
     */
    getCurrency() {
      return new Promise((resolve, reject) => {
        uni.showLoading({
          title: "加载中...",
          mask: true,
        });
        getTransferCoinInfo()
          .then((res) => {
            uni.hideLoading();
            if (res.code.toString() === "0") {
              let currencyList = JSON.parse(JSON.stringify(res.data));
              currencyList.forEach((item) => {
                if (!item.subTransferCoinInfo) item.subTransferCoinInfo = [];
              });
              // currencyList = currencyList.filter(item => {
              //   item.subTransferCoinInfo = item.subTransferCoinInfo.filter(v => v.switchStatus)
              //   return item.switchStatus
              // })
              if (currencyList.length) {
                this.currencyList = currencyList;
                resolve(res);
              } else {
                reject();
              }
            } else reject();
          })
          .catch((_) => {
            console.error(_);
            uni.hideLoading();
            reject();
          });
      });
    },
    handleCopy(data) {
      uni.setClipboardData({
        showToast: true,
        data,
      });
    },
    // 获取授权判断是否授权相册
    // #ifndef H5
    getSaveImg(qrcode) {
      let that = this;
      uni.getSetting({
        success: (res) => {
          console.log(res);
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            uni.showModal({
              title: "警告",
              content: "检测到您没您未授权相册权限,点击确定获取授权。",
              success: function (res) {
                if (res.confirm) {
                  uni.authorize({
                    scope: "scope.writePhotosAlbum",
                    success() {
                      // 用户已经同意
                      that.saveImgToAlbum(qrcode);
                    },
                    fail(err) {
                      console.log("用户拒绝授权相册");
                    },
                  });
                }
              },
            });
          } else {
            that.saveImgToAlbum(qrcode);
          }
        },
        fail: () => {
          console.log("点击了拒绝");
        },
      });
    },
    // 保存二维码图片到相册
    saveImgToAlbum(qrcode) {
      const fileManager = uni.getFileSystemManager();
      fileManager.writeFile({
        filePath: wx.env.USER_DATA_PATH + "/qrcode.jpg", // 指定图片的临时路径
        data: qrcode, // 要写入的文本或二进制数据
        encoding: "base64", // 指定写入文件的字符编码
        success: (res) => {
          console.log("写入文件成功", res);
          console.log(wx.env.USER_DATA_PATH + "/qrcode.jpg");
          uni.saveImageToPhotosAlbum({
            // 保存图片到相册
            filePath: wx.env.USER_DATA_PATH + "/qrcode.jpg",
            success: function (res) {
              console.log("保存成功", res);
              uni.showToast({
                title: "保存成功",
              });
            },
            fail: function (err) {
              console.log("保存失败", err);
            },
          });
        },
        file: (err) => {
          console.log("写入文件失败", err);
        },
      });
    },
    // #endif
    saveQR() {
      // #ifndef H5
      this.getSaveImg();
      // #endif
      this.$refs.qrcode.save((e) => {
        console.log(e);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100%;
  display: flex;
  flex-direction: column;

  &-top {
    background-color: #ffffff;

    &-select {
      height: 60rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 20rpx 14rpx;

      &-item {
        background-color: transparent;
        border-radius: 6rpx;
        width: 130rpx;
        height: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease;

        &-text {
          font-size: 28rpx;
          color: #999999;
          transition: all 0.3s ease;
        }

        &-active {
          background-color: #505bde;

          .page-top-select-item-text {
            color: #ffffff;
          }
        }
      }
    }
  }

  &-body {
    margin-top: 12rpx;
    background-color: #ffffff;
    padding: 44rpx 80rpx 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    flex: 1;

    &-box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
    }

    &-qrcode {
      width: 290rpx;
      height: 290rpx;
      display: block;
      margin: 20rpx 0;
    }

    &-address {
      width: 500rpx;
      line-height: 40rpx;
      word-break: break-all;
      text-align: center;
      min-height: 80rpx;
      display: block;
    }

    &-btn {
      width: 100%;
      display: block;
      margin-bottom: 40rpx;
    }
    &-btn-boder {
      color: #505bde;
      border: 1px solid #5157e6;
    }
  }
}
</style>
