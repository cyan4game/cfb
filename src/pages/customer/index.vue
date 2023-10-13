<!-- 客服 -->
<template>
  <view class="info-page-bg self-body page-customer">
    <u-navbar :safeAreaInsetTop="false" :title="'在线客服'" @leftClick="() => $routers.back()" />
    <view class="info-page-content content-box">
      <view class="top"
        >您好，很抱歉我们暂时无法为您提供服务，如需帮助，
        请留言，我们将尽快联系并解决您的问题
      </view>
      <view class="title"> 电话<text class="red">*</text> </view>
      <view class="ipt">
        <u-text
          :text="form.countryCode"
          color="#505bde"
          suffixIcon="arrow-down"
          @click="showAreaCode = true"
          :iconStyle="{
            fontSize: '14px',
            color: '#505bde',
          }"
        ></u-text>
        <input
          class="input"
          type="text"
          v-model="form.phoneNumber"
          placeholder="请输入"
        />
      </view>
      <view class="title"> 留言内容<text class="red">*</text> </view>
      <textarea
        v-model="form.content"
        class="ipt textarea"
        auto-height
        placeholder="请输入"
      />

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
          v-show="imgList.length < 5"
        >
          <view class="icon">+</view>
          <text>上传图片</text>
        </view>
      </view>
      <view class="top"
        >支持jpg 、png、gif、bmp格式的图片，可上传5张， 单张最大2M
      </view>
    </view>

    <u-button
      @click="submit"
      :disabled="disabled"
      class="btn"
      type="primary"
      text="提交"
    ></u-button>

    <!-- 删除弹窗确认 -->
    <confirm-dialog
      :key="'del'"
      ref="confirmDialog"
      :title="'删除图片'"
      :btn="'删除'"
      :content="'确认删除该图片吗?'"
      :borderBtn="'取消'"
      :btnHandle="handleDelete"
    />

    <!-- 上传异常弹窗确认 -->
    <confirm-dialog
      :key="'sure'"
      ref="sureDialog"
      :title="'上传失败'"
      :btn="'提交'"
      :content="'有图片上传失败，是否直接提交?'"
      :borderBtn="'重新上传'"
      :btnHandle="sureSubmit"
    />

    <!-- 区号 -->
    <u-picker
      @confirm="handleAreaCodeConfirm"
      @cancel="() => (showAreaCode = false)"
      @close="() => (showAreaCode = false)"
      :closeOnClickOverlay="true"
      :show="showAreaCode"
      :columns="areaCode"
    ></u-picker>
  </view>
</template>

<script>
import { _upload, complaintMessage } from "@/api/api";
import { AREA_CODE } from "@/config/api";
const accepts = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
];

export default {
  name: "pageCustomer",
  data() {
    return {
      areaCode: AREA_CODE,
      showAreaCode: false,

      loading: false,
      form: {
        countryCode: "+86",
        phoneNumber: "",
        content: "",
        imgUrls: [],
      },
      imgList: [],

      activeIndex: "",
    };
  },
  computed: {
    disabled() {
      return (
        !(this.form.phoneNumber && this.form.content && this.imgList.length) ||
        this.loading
      );
    },
  },
  methods: {
    handleAreaCodeConfirm(e) {
      this.form.countryCode = "+" + e.value[0].split("+")[1];
      this.showAreaCode = false;
    },
    // 确认删除
    deleteItem(i) {
      this.activeIndex = i;
      this.$refs.confirmDialog.open();
    },
    // 确认移除
    handleDelete() {
      this.$refs.confirmDialog.close();
      this.imgList.splice(this.activeIndex, 1);
    },
    // 提交
    async submit() {
      await this.upload();
      this.form.imgUrls = this.imgList
        .filter((item) => item.uploadUrl)
        .map((item) => item.uploadUrl);
      if (this.form.imgUrls.length != this.imgList.length)
        return this.$refs.sureDialog.open();
      this.sureSubmit();
    },
    // 提交最终表单数据
    sureSubmit() {
      this.$refs.sureDialog.close();
      uni.showLoading({
        title: "",
        mask: true,
      });
      complaintMessage(this.form)
        .then((res) => {
          if (res.code == 200) {
            uni.showToast({
              title: "提交成功",
              icon: "none",
              duration: 2000,
            });
            this.resetForm();
            setTimeout(() => {
              uni.navigateBack();
            }, 1000);
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    // 重置表单
    resetForm() {
      this.form = {
        countryCode: "+86",
        phoneNumber: "",
        content: "",
        imgUrls: [],
      };
      this.imgList = [];
      this.activeIndex = "";
    },
    // 上传
    async upload() {
      const uploadItem = (file) => {
        return new Promise((resolve) => {
          uni.showLoading({
            title: "上传中",
            mask: true,
          });
          _upload(
            file,
            (res) => {
              try {
                const datas = JSON.parse(res.data);
                if (datas.code == 200) {
                  resolve(datas.data);
                } else {
                  uni.showToast({
                    title: "上传失败，请重试",
                    icon: "none",
                    duration: 2000,
                  });
                  resolve(false);
                }
              } catch {
                uni.showToast({
                  title: "上传失败",
                  icon: "none",
                  duration: 2000,
                });
                resolve(false);
              }
            },
            () => {
              uni.showToast({
                title: "网络异常，请重试",
                icon: "none",
                duration: 2000,
              });
              resolve(false);
            },
            () => {
              uni.hideLoading();
            }
          );
        });
      };

      for (let i = 0; i < this.imgList.length; i++) {
        const item = this.imgList[i];
        if (item.uploaded) continue; // 已经上传过了
        const rs = await uploadItem(item);
        if (rs) {
          item.uploadUrl = rs;
        } else {
          item.uploadError = true;
        }
      }
    },
    // 选择文件
    selectFile() {
      uni.chooseImage({
        count: 5 - this.imgList.length,
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
  },
};
</script>

<style lang="scss" scoped>
.page-customer {
  .content-box {
    font-size: 26rpx;
    color: #433f48;
    padding-bottom: 150rpx;

    .top {
      padding: 0 44rpx 80rpx 44rpx;
    }

    .title {
      color: #7a7a7a;
      font-size: 28rpx;
      margin-bottom: 34rpx;

      .red {
        color: #eb3131;
      }
    }

    .ipt {
      border-radius: 6rpx;
      min-height: 72rpx;
      background-color: #f1f1f1;
      padding: 0 40rpx;
      margin-bottom: 40rpx;
      font-size: 28rpx;
      color: #433f48;
      display: flex;
      align-items: center;
      .input {
        flex: 3;
        font-size: 28rpx;
      }
    }

    .textarea {
      padding: 20rpx 40rpx;
      min-height: 200rpx;
    }

    .upload-box {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin-bottom: 40rpx;

      .upload-item {
        width: 216rpx;
        height: 216rpx;
        margin: 0 20rpx 20rpx 0;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        background-color: #f1f1f1;
        border: 1px dashed #999;
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
    border-radius: 6rpx;
    color: #fff;
    font-size: 30rpx;
    position: fixed;
    bottom: 80rpx;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
