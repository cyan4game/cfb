<!-- 收款方式-数字人民币 -->
<template>
  <view class="info-page-bg self-body page-collection-alipay">
    <u-navbar
      :safeAreaInsetTop="true"
      :title="'数字人民币'"
      @leftClick="() => $routers.back()"
    />
    <view class="self-status-bar"></view>

    <view class="info-page-content content-box">
      <view class="item">
        <text>姓名</text>
        <input
          :disabled="form.id && !editing"
          class="item-ipt"
          placeholder="请输入姓名"
          type="text"
          v-model.trim="form.idName"
        />
      </view>

      <view class="item">
        <text>钱包编号</text>
        <input
          :disabled="form.id && !editing"
          class="item-ipt"
          placeholder="请输入数字人民币钱包编号"
          type="text"
          v-model.trim="form.accountName"
        />
      </view>

      <!-- 上传 -->
      <view class="upload" @click="handleClick" v-if="!form.qrCode">
        <u-image
          class="right"
          src="@/static/images/mine/pic.png"
          width="84rpx"
          height="84rpx"
        ></u-image>
        <view class="upload-info">
          <view style="color: #757575; font-size: 28rpx">上传图片</view>
          <view>请上传收款二维码</view>
        </view>
      </view>

      <view class="qrcode" v-if="form.qrCode" @click="handleClick">
        <u-image :src="form.qrCode" width="670rpx" height="670rpx"></u-image>
      </view>

      <view style="height: 240rpx"></view>
    </view>

    <u-button
      v-if="!form.id"
      @click="submit"
      :disabled="!(form.idName && form.accountName && form.qrCode) || loading"
      class="info-page-btn btn"
      type="primary"
      text="确定"
    ></u-button>

    <!-- form.id 已经绑定了 -->
    <view class="btns" v-if="form.id">
      <u-button
        v-if="!editing"
        @click="editing = true"
        class="btn2"
        type="primary"
        text="编辑"
      ></u-button>

      <u-button
        v-if="editing"
        @click="editing = false"
        class="btn1"
        type="info"
        text="取消"
      ></u-button>
      <u-button
        v-if="editing"
        @click="submit"
        :disabled="!(form.idName && form.accountName && form.qrCode) || loading"
        class="btn2"
        type="primary"
        text="修改"
      ></u-button>
    </view>
  </view>
</template>

<script>
import storage from "@/utils/storage";
import { _upload, memberPayModelUpdate, queryPayBindInfo } from "@/api/api";

export default {
  name: "collectionAlipay",
  data() {
    return {
      editing: false,
      loading: false,
      userInfo: {},
      idenInfo: {},
      form: {
        payType: 4,
        idName: "", // 真实姓名
        accountName: "", // 账号 银行卡是卡号；微信是微信号；数字人民币是数字人民币账号；云闪付是
        qrCode: "", // 支付二维码地址或者银行卡号，默认为空
      },
    };
  },
  onShow() {
    this.userInfo = storage.get("userInfo") || {};
    this.idenInfo = storage.get("idenInfo") || {};
    this.form.idName = this.idenInfo.idName;
    this.getInfo();
  },
  methods: {
    // 获取绑定详情
    getInfo() {
      uni.showLoading({
        title: "",
        mask: true,
      });
      queryPayBindInfo({
        payType: this.form.payType,
      })
        .then((res) => {
          if (res.code == 200 && res.data) {
            const target = res.data.find(
              (item) => item.payType == this.form.payType
            );
            if (target) {
              this.form.id = target.id;
              this.form.idName = target.username;
              this.form.accountName = target.account;
              this.form.qrCode = target.qrCode;
            }
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    // 提交
    submit() {
      this.loading = true;
      memberPayModelUpdate({
        // ...this.form,
        id: this.form.id || null,
        account: this.form.accountName,
        username: this.form.idName,
        payType: this.form.payType,
        qrCode: this.form.qrCode,
      })
        .then((res) => {
          if (res.code == 200) {
            uni.showToast({
              title: "绑定成功",
              icon: "none",
              duration: 2000,
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 500);
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        });
    },
    handleClick() {
      if (this.form.id && !this.editing) return;
      this.chooseFile();
    },
    // 选择文件
    chooseFile() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.uploadImg(res.tempFiles[0]);
        },
      });
    },
    // 上传文件
    uploadImg(file) {
      uni.showLoading({
        title: "",
        mask: true,
      });
      _upload(
        file,
        (res) => {
          try {
            const datas = JSON.parse(res.data);
            if (datas.code == 200) {
              // 上传成功
              setTimeout(() => {
                this.form.qrCode = datas.data;
              }, 200);
            } else {
              uni.showToast({
                title: "上传失败，请重试",
                icon: "none",
                duration: 2000,
              });
            }
          } catch {
            uni.showToast({
              title: "上传失败",
              icon: "none",
              duration: 2000,
            });
          }
        },
        () => {
          uni.showToast({
            title: "网络异常，请重试",
            icon: "none",
            duration: 2000,
          });
        },
        () => {
          uni.hideLoading();
        }
      );
    },
  },
};
</script>

<style scoped lang="scss">
.page-collection-alipay {
  .content-box {
    height: 100%;
    overflow-y: auto;
    .item {
      height: 134rpx;
      border-bottom: 1px solid #cecece;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #454545;
      font-size: 32rpx;
      padding-left: 40rpx;
      .item-ipt {
        flex: 1;
        margin-left: 40rpx;
        font-size: 28rpx;
      }
    }
    .upload {
      width: 670rpx;
      height: 218rpx;
      padding: 0 75rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-top: 65rpx;
      color: #454545;
      font-size: 32rpx;
      border-radius: 6rpx;
      border: 1px solid #747474;
      box-sizing: border-box;
      .upload-info {
        margin-left: 74rpx;
      }
    }
    .qrcode {
      width: 670rpx;
      height: 670rpx;
      background-color: #e4e4e4;
      margin-top: 65rpx;
    }
  }
  .btn {
    position: fixed;
    bottom: 60rpx;
    font-size: 28rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 60rpx;
    font-size: 28rpx;
    width: 100%;
    box-sizing: border-box;
    padding: 0 40rpx;
    .btn1 {
      flex: 1;
      height: 96rpx;
      margin-right: 40rpx;
    }
    .btn2 {
      flex: 1;
      height: 96rpx;
      background-color: #449367;
      border-radius: 6rpx;
      color: #fff;
      border: none;
    }
  }
}
</style>
