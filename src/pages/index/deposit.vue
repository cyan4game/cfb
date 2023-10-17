<!-- 充币 -->
<template>
  <view class="page-deposit">
    <u-navbar
      :safeAreaInsetTop="false"
      :title="'充值'"
      @leftClick="() => $routers.back()"
    />
    <!-- 浮标 -->
    <!-- <u-image class="right-icon" style="right:130rpx" src="/static/images/index/icon-help.png" width="42rpx" height="42rpx"></u-image>
        <u-image class="right-icon" src="/static/images/index/icon-his.png" width="45rpx" height="42rpx"></u-image> -->

    <!-- 币种 -->
    <view class="coin-box" @click="() => $refs.coinSelect.open()">
      <coin-icon class="icon" :coin="currency" />
      <view class="coin">{{ currency }}</view>
      <u-image
        class="right"
        src="/static/images/index/more.png"
        width="16rpx"
        height="9rpx"
      ></u-image>
    </view>
    <view class="line"></view>
    <view class="qr-box" v-if="address">
      <tki-qrcode
        @result="result"
        :key="'out'"
        ref="qrcode"
        :size="340"
        :val="address"
      />
      <img class="qrcode-img" v-if="qrImg" :src="qrImg" alt="" />
    </view>
    <!-- <view class="btns" v-if="address">
      <view class="btn" @click="saveCode">保存至相册</view>
      <view class="btn btn2" @click="openDialog">分享地址</view>
    </view> -->
    <view class="save-tip">长按保存二维码</view>
    <view class="box">
      <view class="item" v-if="address">
        <text>收款地址</text>
      </view>
      <view class="address" v-if="address">
        <view style="flex1; word-break: break-all">{{ address }}</view>
        <u-image
          @click="copy(address)"
          class="right"
          src="/static/images/mine/copy.png"
          width="26rpx"
          height="31rpx"
        ></u-image>
      </view>
      <view class="line" v-if="address"></view>

      <!-- 详情 -->
      <view style="height: 30rpx"></view>
      <view class="tip"
        >1. 该地址仅支持
        {{ currency }}
        收款，请勿用于其他币种，否则会导致资产丢失并不可找回。</view
      >
      <view class="tip"
        >2.
        请使用TRC20（TRON）协议进行转入，使用其他协议转入会导致资产丢失并不可找回。</view
      >
      <view class="tip"
        >3. 您的充值地址不会经常改变，可截图保存并重复充值。</view
      >
    </view>

    <!-- 海报弹窗 -->
    <uni-popup ref="popup">
      <view class="share-dialog" :class="{ 'saving-dialog': saving }">
        <view class="share-title">
          <coin-icon style="width: 42rpx; height: 42rpx; margin-right: 20rpx" />
          <text>充值二维码</text>
        </view>
        <view class="box" :class="{ fullwin: fullwin }" ref="box">
          <view class="box-title">{{ userInfo.nickname || "--" }}</view>
          <view class="box-coin">资产类型：{{ chain }}-{{ currency }}</view>
          <view class="qr-box2" v-if="address">
            <tki-qrcode :key="'in'" ref="qrcode2" :size="340" :val="address" />
          </view>
        </view>
        <view class="box-line"></view>
        <view class="box-tip">
          <view
            >1. 该地址仅支持
            {{ currency }} 收款，请勿用于其他币种，否则会导致资产丢
            失并不可找回。</view
          >
          <view
            >2.
            请使用TRC20（TRON）协议进行转入，使用其他协议转入会导致资产丢失并不可找回。</view
          >
          <view>3. 您的充值地址不会经常改变，可截图保存并重复充值。</view>
        </view>
        <view class="box-btns">
          <view class="box-btn" @click="() => $refs.popup.close()">取消</view>
          <view class="box-btn active-btn" @click="share">分享</view>
        </view>
        <view class="share-title" style="margin-bottom: 0; margin-top: 36rpx">
          <coin-icon style="width: 42rpx; height: 42rpx; margin-right: 20rpx" />
          <text style="font-size: 26rpx">财富宝—你的数字资产管理专家</text>
        </view>
      </view>
    </uni-popup>

    <!-- 币种选择 -->
    <coin-select-inner ref="coinSelect" :coin="currency" :width="'690rpx'" @select="selectCoin" :top="'calc(214rpx + env(safe-area-inset-top))'" :left="'30rpx'" />
  </view>
</template>

<script>
import { copyTxt, savePic } from "@/utils/utils";
import storage from "@/utils/storage";
import { getWalletAddress } from "@/api/api";

export default {
  name: "deposit",
  data() {
    return {
      saving: false, // 是否保存截图种  h5保存中的时候要把内容挪出屏幕外
      fullwin: false,
      currency: "USDT",
      chain: "TRC20",
      userInfo: {},
      address: "",
      qrImg: "", // 二维码图片
    };
  },
  onShow() {
    this.userInfo = storage.get("userInfo") || {};
  },
  mounted() {
    this.getAddress();
    // this.$refs.qrcode._makeCode();
  },
  methods: {
    result(val) {
      this.qrImg = val;
    },
    // 查询钱包地址
    getAddress() {
      uni.showLoading({
        title: "",
        mask: true,
      });
      getWalletAddress(this.currency, this.chain)
        .then((res) => {
          if (res.code == 200) {
            this.address = res.data;
            setTimeout(() => {
              this.$refs.qrcode._makeCode();
            }, 100);
          } else {
            this.address = "";
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    // 选择币种
    selectCoin(item) {
      this.$refs.coinSelect.close();
      this.address = "";
      this.qrImg = "";
      this.currency = item.coin;
      this.chain = item.chain;
      this.getAddress();
    },
    // 复制
    copy(txt) {
      copyTxt(txt);
      uni.showToast({
        title: "复制成功",
        icon: "none",
        duration: 2000,
      });
    },
    openDialog() {
      this.fullwin = false;
      this.$refs.popup.open();
      setTimeout(() => {
        this.$refs.qrcode2._makeCode();
      }, 300);
    },
    // 保存二维码
    saveCode() {
      // #ifdef H5
      this.saving = true;
      // #endif
      this.openDialog();
      setTimeout(() => {
        this.cut();
      }, 600);
    },
    // 截屏
    cut() {
      // #ifdef H5
      uni.showLoading({
        title: "",
        mask: false,
      });
      setTimeout(() => {
        this.saving = false;
        uni.hideLoading();
      }, 2000);
      const box = this.$refs.box.$el;
      try {
        html2canvas(box).then((canvas) => {
          Canvas2Image.saveAsImage(
            canvas,
            canvas.width,
            canvas.height,
            "png",
            "qrcode"
          );
          this.$refs.popup.close();
        });
      } catch {
        uni.showToast({
          title: "保存失败，请手动截屏",
          icon: "none",
          duration: 2000,
        });
      }
      // #endif

      // #ifdef APP-PLUS
      this.appCut("save");
      // #endif
    },
    // 分享
    share() {
      // #ifdef H5
      // 如果支持share方法就调用share，如果不支持就尝试复制图片，如果不能复制图片就直接复制地址
      uni.showLoading({
        title: "处理中",
        mask: true,
      });
      copyTxt(this.address);
      const box = this.$refs.box.$el;
      html2canvas(box)
        .then(async (canvas) => {
          try {
            canvas.toBlob(async (blob) => {
              // 如果浏览器支持分享
              if (navigator.share) {
                navigator.share({
                  title: (this.userInfo.nickname || "--") + "的充值二维码",
                  text: this.address,
                  files: [
                    new File([blob], "image.jpg", { type: "image/jpeg" }),
                  ],
                });
                uni.hideLoading();
              } else {
                // 如果不支持分享则复制到粘贴板
                try {
                  if (window.ClipboardItem) {
                    const data = [
                      new ClipboardItem({
                        "image/png": blob,
                      }),
                    ];
                    navigator.clipboard
                      .write(data)
                      .then(
                        () => {
                          uni.hideLoading();
                          uni.showToast({
                            title: "已复制到粘贴板，快去分享吧！",
                            icon: "none",
                            duration: 3000,
                          });
                        },
                        () => {
                          uni.hideLoading();
                          uni.showToast({
                            title: "浏览器不支持分享，请手动截屏",
                            icon: "none",
                            duration: 3000,
                          });
                        }
                      )
                      .catch(() => {
                        uni.hideLoading();
                        uni.showToast({
                          title: "操作失败，请手动截屏",
                          icon: "none",
                          duration: 3000,
                        });
                      });
                  } else {
                    uni.hideLoading();
                    uni.showToast({
                      title: "已复制地址，快去分享吧",
                      icon: "none",
                      duration: 3000,
                    });
                  }
                } catch {
                  uni.hideLoading();
                  uni.showToast({
                    title: "已复制地址，快去分享吧",
                    icon: "none",
                    duration: 3000,
                  });
                }
              }
            });
          } catch {
            uni.hideLoading();
            uni.showToast({
              title: "截屏失败，请手动截屏",
              icon: "none",
              duration: 3000,
            });
          }
        })
        .catch(() => {
          uni.hideLoading();
          uni.showToast({
            title: "浏览器不支持截屏，请手动截屏",
            icon: "none",
            duration: 3000,
          });
        });
      // #endif
      // #ifdef APP-PLUS
      this.appCut("share");
      // #endif
    },
    // app端截屏并保存或分享
    appCut(type = "save") {
      // 将盒子放大到整个屏幕
      this.fullwin = true;
      setTimeout(() => {
        // save-保存  share-分享
        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        let ws = page.$getAppWebview();
        let bitmap = new plus.nativeObj.Bitmap("drawScreen");
        // 将webview内容绘制到Bitmap对象中
        ws.draw(
          bitmap,
          () => {
            // 保存图片到本地
            bitmap.save(
              "_doc/share.jpg",
              {
                overwrite: true,
              },
              (res) => {
                if (type == "save") {
                  // 保存
                  this.$refs.popup.close();
                  uni.saveImageToPhotosAlbum({
                    filePath: res.target,
                    success: () => {
                      bitmap.clear(); //销毁Bitmap图片
                      uni.showToast({
                        title: "保存成功",
                        icon: "none",
                        duration: 3000,
                      });
                    },
                    fail: () => {
                      uni.showToast({
                        title: "保存图片失败，请手动截屏",
                        icon: "none",
                        duration: 3000,
                      });
                    },
                  });
                } else {
                  // 分享
                  this.$refs.popup.close();
                  uni.share({
                    type: 2,
                    imageUrl: res.target,
                    complete: () => {
                      this.$refs.popup.close();
                    },
                  });
                }
              },
              (error) => {
                bitmap.clear(); // 清除Bitmap对象
                uni.showToast({
                  title: "保存失败，请手动截屏",
                  icon: "none",
                  duration: 3000,
                });
              }
            );
          },
          (error) => {
            uni.showToast({
              title: "截屏失败，请手动截屏",
              icon: "none",
              duration: 3000,
            });
          },
          {
            check: true, // 设置为检测白屏
          }
        );
      }, 200);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-deposit {
  padding: 140rpx 30rpx 53rpx 30rpx;
  box-sizing: border-box;
  .right-icon {
    position: fixed;
    top: 26rpx;
    right: 40rpx;
    z-index: 999;
  }

  .coin-box {
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    color: #454545;
    font-size: 26rpx;
    padding: 0 30rpx;
    background-color: #f1f1f1;
    border-radius: 6rpx;
    margin-bottom: 44rpx;

    .icon {
      margin-right: 22rpx;
      width: 40rpx;
      height: 40rpx;
    }

    .coin {
      flex: 1;
    }
  }

  .chain-box {
    height: 72rpx;
    background-color: #f0f0f0;
    padding: 0 45rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #343635;
    font-size: 26rpx;
  }

  .line {
    margin: 0 auto;
    border-bottom: 1px dashed #888888;
    width: 580rpx;
  }

  .address {
    color: #3b3b3b;
    font-size: 26rpx;
    margin-bottom: 25rpx;
    display: flex;
    justify-content: space-between;
    padding: 0 14rpx 0 20rpx;
    align-items: center;
  }

  .box {
    padding: 20rpx 35rpx 0 35rpx;
  }
  .qr-box {
    width: 380rpx;
    height: 380rpx;
    margin: 33rpx auto 27rpx auto;
    box-sizing: border-box;
    padding: 20rpx;
    position: relative;
    .qrcode-img {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 99;
      top: 0;
      left: 0;
    }
  }
  .save-tip {
    font-size: 24rpx;
    text-align: center;
    padding-bottom: 20rpx;
    color: #696969;
  }
  .qr-box2 {
    width: 380rpx;
    height: 380rpx;
    box-sizing: border-box;
    padding: 20rpx;
    border: 1px dashed #888888;
  }

  .btns {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 59rpx;
    .btn {
      font-size: 28rpx;
      box-sizing: border-box;
      color: #449367;
      height: 56rpx;
      width: 153rpx;
      border: 1rpx solid #38363b;
      border-radius: 6rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 25rpx;
      font-size: 24rpx;
    }
    .btn2 {
      background-color: #449367;
      color: #f9f9f9;
      border: none;
    }
    .split {
      margin: 0 33rpx;
      height: 38rpx;
      width: 1px;
      background-color: #2f2f2e;
    }
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #696969;
    font-size: 26rpx;
    margin-bottom: 26rpx;
    padding-left: 26rpx;

    .val {
      color: #3c3c3c;
    }
  }

  .tip {
    margin-top: 10rpx;
    color: #696969;
    font-size: 23rpx;
  }
}
.share-dialog {
  font-weight: 400;
  width: 710rpx;
  background-color: #fff;
  box-sizing: border-box;
  padding: 40rpx 30rpx;
  border-radius: 6rpx;
  .share-title {
    display: flex;
    align-items: center;
    color: #323232;
    font-size: 36rpx;
    margin-bottom: 36rpx;
  }
  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    margin: 0 60rpx;
    .box-title {
      color: #323232;
      font-size: 36rpx;
      margin-bottom: 22rpx;
      font-weight: 500;
    }
    .box-coin {
      color: #323232;
      font-size: 26rpx;
      margin-bottom: 26rpx;
    }
    .qr-box2 {
      margin-bottom: 30rpx;
    }
  }
  .fullwin {
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    margin: 0 !important;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
  }
  .box-line {
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed #888;
    margin-bottom: 28rpx;
  }
  .box-tip {
    color: #3c3c3c;
    font-size: 18rpx;
    padding: 0 20rpx;
    margin-bottom: 28rpx;
  }
  .box-btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .box-btn {
      box-sizing: border-box;
      width: 312rpx;
      height: 99rpx;
      color: #38363b;
      justify-content: center;
      display: flex;
      align-items: center;
      font-size: 34rpx;
      border: 1px solid #38363b;
    }
    .active-btn {
      background-color: #449367;
      color: #fff;
      border: none;
      border-radius: 6rpx;
    }
  }
}
.saving-dialog {
  position: absolute;
  left: 1000rpx;
  top: 5000rpx;
}
</style>
