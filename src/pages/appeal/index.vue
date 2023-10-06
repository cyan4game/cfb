<!-- 申述 -->
<template>
  <view class="info-page-bg page-appeal">
    <!-- 表单 -->
    <view class="info-page-content content-box">
      <!-- 订单编号 -->
      <view class="form-item">
        <view class="item-title">订单编号</view>
        <view class="item-content">
          <input v-model.trim="form.id" disabled type="text" class="ipt" />
        </view>
      </view>
      <!-- 订单金额 -->
      <view class="form-item">
        <view class="item-title">订单金额</view>
        <view class="item-content">
          <input v-model.trim="form.amount" disabled type="text" class="ipt" />
        </view>
      </view>

      <!-- 问题描述 -->
      <view class="form-item">
        <view class="item-title">问题描述</view>
        <view class="item-content" style="padding: 20rpx 40rpx">
          <textarea
            class="ipt"
            placeholder="请输入问题描述"
            v-model="form.text"
            auto-height
          />
        </view>
      </view>

      <view class="form-item">
        <view class="item-title" style="margin-bottom: 0">上传图片凭证</view>
        <view class="tip"
          >图片支持png、jpg格式，单张图片最大5M,至少上传3张,最多9张图片</view
        >

        <view class="upload-box">
          <view
            class="upload-item"
            v-for="(item, i) in imgList"
            :key="i"
            @click="deleteItem(i)"
          >
            <u-image
              class="img"
              :src="item.path"
              width="100%"
              height="100%"
            ></u-image>
            <!-- 状态 -->
            <view class="err-status" v-if="item.uploadError">上传失败</view>
          </view>
          <view
            class="upload-item upload"
            @click="selectFile"
            v-show="imgList.length < 9"
          >
            <u-image
              class="icon"
              src="/static/images/home/img.png"
              width="72rpx"
              height="72rpx"
            ></u-image>
          </view>
        </view>
      </view>

      <view class="form-item">
        <view class="item-title" style="margin-bottom: 0">上传视频凭证</view>
        <view class="tip"
          >打开手机录屏打开您所选择的收款软件找到订单打开详情 视频最大100M</view
        >
        <view class="upload-box">
          <view
            v-show="videoFile.name"
            @click="selectVideo"
            class="upload-item"
          >
            {{ videoFile.name }}
            <!-- <image :src="videoFile + '?x-oss-process=video/snapshot,t_0,f_jpg'"></image> -->
            <!-- 状态 -->
            <!-- <view class="err-status" v-if="item.uploadError">上传失败</view> -->
          </view>
          <view
            class="upload-item upload"
            @click="selectVideo"
            v-show="!videoFile.name"
          >
            <u-image
              class="icon"
              src="/static/images/home/video.png"
              width="100rpx"
              height="74rpx"
            ></u-image>
          </view>
        </view>
      </view>
    </view>

    <!-- 按钮 -->
    <view class="btn" @click="submit" :class="{ 'disabled-btn': disabled }"
      >提交</view
    >
  </view>
</template>

<script>
import { withdraw } from "@/api/api";
import storage from "@/utils/storage";
import { isValidTRONAddress } from "@/utils/utils";

const accepts = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
];

export default {
  name: "appeal",
  data() {
    return {
      form: {
        id: "3453453453464523423423", // 订单编号
        amount: "￥6544", // 订单金额
        text: "", // 问题描述
        imgUrls: [],
        video: "",
      },
      loading: false,
      userInfo: {},

      imgList: [],
      videoFile: {},
    };
  },
  computed: {
    disabled() {
      return this.loading;
    },
  },
  onLoad(data) {
    this.userInfo = storage.get("userInfo") || {};
  },
  methods: {
    // 确认删除
    deleteItem(i) {
      this.activeIndex = i;
      this.$refs.confirmDialog.open();
    },
    // 选择视频
    selectVideo() {
      uni.chooseVideo({
        count: 1,
        success: (res) => {
          this.videoFile = res.tempFile;
          console.error(res.tempFile);
        },
      });
    },
    // 选择图片文件
    selectFile() {
      uni.chooseImage({
        count: 9 - this.imgList.length,
        success: (res) => {
          let errMsg = false;
          res.tempFiles.forEach((item) => {
            if (!accepts.includes(item.type)) {
              errMsg = "只支持jpg 、png、gif、bmp格式的图片";
            }
            if (item.size > 2 * 1024 * 1024) {
              errMsg = "单张最大2M";
            }
          });
          if (errMsg)
            return uni.showToast({
              title: "errMsg",
              icon: "none",
              duration: 2000,
            });
          this.imgList.push(...res.tempFiles);
        },
      });
    },
    // 提交
    submit() {
      if (this.disabled) return;
      this.$refs.popup.open();
    },
    successHandle(codes) {
      this.loading = true;
      withdraw({
        ...this.form,
        // ...codes,
      })
        .then((res) => {
          if (res.code == 200) {
            uni.showToast({
              title: "转账成功",
              icon: "none",
              duration: 2000,
            });
            this.form.toAddress = "";
            this.form.amount = "";
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.page-appeal {
  .content-box {
    color: #757575;
    font-size: 28rpx;
    padding-bottom: 100rpx;
    overflow-y: auto;

    .form-item {
      margin-bottom: 41rpx;

      .item-title {
        color: #7a7a7a;
        font-size: 26rpx;
        margin-bottom: 34rpx;
      }

      .item-content {
        background-color: #f1f1f1;
        border-radius: 6rpx;
        min-height: 72rpx;
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 40rpx;
        font-size: 26rpx;
        color: #7a7a7a;

        .ipt {
          flex: 1;
          margin-right: 20rpx;
          font-size: 28rpx;
        }
      }

      .item-tip {
        color: #dc2727;
        font-size: 24rpx;
        margin-top: 20rpx;
      }
      .tip {
        font-size: 24rpx;
        margin-top: 10rpx;
      }
    }
    .upload-box {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin: 40rpx 0;

      .upload-item {
        width: 200rpx;
        height: 200rpx;
        margin: 0 24rpx 24rpx 0;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        background-color: #f1f1f1;
        position: relative;

        .err-status {
          position: absolute;
          bottom: 10rpx;
          right: 10rpx;
          font-size: 24rpx;
          color: #eb3131;
        }

        &:nth-child(3n) {
          margin-right: 0;
        }

        .img {
          width: 100%;
          height: 100%;
        }
      }

      .upload {
        font-size: 28rpx;
        color: #433f48;

        .icon {
          font-size: 100rpx;
          line-height: 90rpx;
          font-weight: 200;
        }
      }
    }
  }

  .btn {
    width: 451rpx;
    height: 96rpx;
    background-color: #449367;
    color: #fff;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 60rpx;
  }

  .disabled-btn {
    background-color: #f1f1f1;
    color: #757575;
  }
}
.sure-box {
  width: 100%;
  height: 600rpx;
  background-color: #fff;

  .title {
    height: 120rpx;
    padding: 0 37rpx 0 63rpx;
    color: #38363b;
    font-size: 36rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dfdfdf;

    .close {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      background-color: #eeeeee;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      color: #888;
    }
  }
  .sure-item {
    height: 70rpx;
    border-bottom: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26rpx;
    .sure-val {
      margin-left: 20rpx;
    }
  }

  .submit {
    background: #449367;
    border-color: #449367;
    width: 451rpx;
    height: 96rpx;
    margin: 40rpx auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 26rpx;
  }
}
</style>
