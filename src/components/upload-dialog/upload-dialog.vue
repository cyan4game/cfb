<!-- 上传凭证弹窗 -->
<!-- 确认弹窗 -->
<template>
  <uni-popup
    ref="popup"
    type="center"
    :is-mask-click="false"
    :mask-click="false"
  >
    <view class="tip-dialog-content">
      <view class="close" @click="close">×</view>
      <view class="title">上传图片凭证</view>
      <view class="upload-box" @click="chooseFile">
        <u-image
          v-if="!this.file"
          class="right"
          src="@/static/images/home/img2.png"
          width="72rpx"
          height="72rpx"
        ></u-image>
        <u-image
          v-if="this.file"
          :src="this.file.path"
          width="250rpx"
          height="250rpx"
        ></u-image>
      </view>
      <view class="tip">图片支持png、jpg格式，单张图片最大2M</view>
      <view class="btns">
        <view
          class="btn"
          :class="{ 'disabled-btn': !this.file }"
          @click="upload"
          >提交</view
        >
      </view>
    </view>
  </uni-popup>
</template>

<script>
import { _upload } from "@/api/api";
export default {
  name: "UploadDialog",
  props: {
    btnHandle: {
      // 主按钮回调
      type: Function,
    },
  },
  data() {
    return {
      file: "",
      img: "",
    };
  },
  methods: {
    open() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    // 选择文件
    chooseFile() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.img = "";
          this.file = res.tempFiles[0];
        },
      });
    },
    // 上传文件
    upload() {
      if (!this.file) return;
      if (this.img) return this.$emit("success", this.img);
      uni.showLoading({
        title: "",
      });
      _upload(
        this.file,
        (res) => {
          try {
            const datas = JSON.parse(res.data);
            if (datas.code == 200) {
              // 上传成功
              this.img = datas.data;
              this.$emit("success", this.img);
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

<style lang="scss">
.tip-dialog-content {
  width: 630rpx;
  border-radius: 12rpx;
  background-color: #fff;
  box-sizing: border-box;
  padding: 60rpx 56rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .tip {
    color: #433f48;
    font-size: 20rpx;
    margin-bottom: 66rpx;
  }
  .upload-box {
    width: 250rpx;
    height: 250rpx;
    background-color: #f1f1f1;
    margin: 70rpx auto 20rpx auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title {
    font-size: 36rpx;
    color: #323232;
    font-weight: 500;
    text-align: center;
  }
  .content {
    font-size: 34rpx;
    color: #323232;
    font-weight: 400;
    text-align: left;
    width: 100%;
    margin: 60rpx 0 40rpx 0;
    text-align: center;
  }
  .btns {
    display: flex;
    align-items: center;
    width: 100%;
    .btn:nth-child(2) {
      margin-left: 20rpx;
    }
  }
  .btn {
    flex: 1;
    height: 100rpx;
    background-color: #449367;
    color: #fff;
    font-weight: 400;
    font-size: 34rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12rpx;
    margin-top: 23rpx;
    box-sizing: border-box;
  }
  .disabled-btn {
    background-color: #f1f1f1;
    color: #38363b;
  }
  .border-btn {
    border: 1px solid #38363b;
    background-color: #fff;
    color: #38363b;
  }
  .close {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    background-color: #eee;
    border-radius: 50%;
    overflow: hidden;
    top: 60rpx;
    right: 40rpx;
    color: #888888;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }
}
</style>
