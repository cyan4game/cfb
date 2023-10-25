<!-- 认证第一步-身份号码表单 -->
<template>
  <view class="info-page-bg self-body page-iden-1">
    <u-navbar
      :safeAreaInsetTop="true"
      :title="'实名认证'"
      @leftClick="() => $routers.back()"
    />
    <view class="self-status-bar"></view>
    <view class="info-page-content content-box">
      <view class="title">姓名</view>
      <view class="box">
        <input
          v-model="form.realName"
          class="ipt"
          type="text"
          placeholder="请输入绑定的真实姓名"
        />
      </view>
      <view class="tip" v-show="!nameOk">请输入合法姓名</view>
      <view class="title" style="margin-top: 41rpx">身份证号</view>
      <view class="box">
        <input
          v-model="form.idCard"
          class="ipt"
          type="text"
          placeholder="请输入身份证号账号"
        />
      </view>
      <view class="tip" v-show="!idOk">请输入正确的身份证号码</view>

      <!-- 上传图片 -->
      <!-- 正面 -->
      <view class="item">
        <view class="img" @click="selectFile('idCardFrontImage')">
          <u-image
            class="pic"
            v-if="!files.idCardFrontImage.path"
            src="/static/images/mine/iden-1.png"
            width="100%"
            height="100%"
          ></u-image>
          <u-image
            mode="fit"
            class="pic"
            v-if="files.idCardFrontImage.path"
            :src="files.idCardFrontImage.path"
            width="100%"
            height="100%"
          ></u-image>
        </view>
        <view class="txt">身份证正面照</view>
      </view>

      <!--反面 -->
      <view class="item">
        <view class="img" @click="selectFile('idCardBackImage')">
          <u-image
            class="pic"
            v-if="!files.idCardBackImage.path"
            src="/static/images/mine/iden-2.png"
            width="100%"
            height="100%"
          ></u-image>
          <u-image
            mode="fit"
            class="pic"
            v-if="files.idCardBackImage.path"
            :src="files.idCardBackImage.path"
            width="100%"
            height="100%"
          ></u-image>
        </view>
        <view class="txt">身份证反面照</view>
      </view>

      <!-- 手持 -->
      <view class="item">
        <view class="img" @click="selectFile('idCardHand')">
          <u-image
            class="pic"
            v-if="!files.idCardHand.path"
            src="/static/images/mine/iden-3.png"
            width="100%"
            height="100%"
          ></u-image>
          <u-image
            mode="fit"
            class="pic"
            v-if="files.idCardHand.path"
            :src="files.idCardHand.path"
            width="100%"
            height="100%"
          ></u-image>
        </view>
        <view class="txt">人像面照片</view>
      </view>
    </view>

    <u-button
      type="primary"
      :disabled="disabled"
      class="btn"
      :text="'提交'"
      @click="submit"
    ></u-button>
  </view>
</template>

<script>
import { standardCertification, _upload } from "@/api/api";
import storage from "@/utils/storage";
import { idReg, nameReg } from "@/utils/utils";

export default {
  name: "iden-step1",
  data() {
    return {
      idenInfo: {},

      loading: false,
      form: {
        realName: "",
        idCard: "",
        type: 0,
        idCardFrontImage: "",
        idCardBackImage: "",
        idCardHand: "",
      },
      files: {
        idCardFrontImage: {
          path: "",
        },
        idCardBackImage: {
          path: "",
        },
        idCardHand: {
          path: "",
        },
      },
    };
  },
  computed: {
    disabled() {
      return (
        this.loading ||
        !(
          this.form.realName &&
          this.form.idCard &&
          this.files.idCardFrontImage.path &&
          this.files.idCardBackImage.path &&
          this.files.idCardHand.path
        )
      );
    },
    nameOk() {
      if (!this.form.realName) return true;
      return nameReg(this.form.realName);
    },
    idOk() {
      if (!this.form.idCard) return true;
      return idReg(this.form.idCard);
    },
  },
  onLoad() {
    this.idenInfo = storage.get("idenInfo") || {};
    console.error("??", this.idenInfo);
    this.form.realName = this.idenInfo.realName || "";
    this.form.idCard = this.idenInfo.idCard || "";
    this.form.realName = this.idenInfo.idName;
    this.files.idCardFrontImage.path = this.form.idCardFrontImage =
      this.idenInfo.idCardFrontPictureUrl;
    this.files.idCardBackImage.path = this.form.idCardBackImage =
      this.idenInfo.idCardBackPictureUrl;
    this.files.idCardHand.path = this.form.idCardHand =
      this.idenInfo.faceContrastPictureUrl;
  },
  methods: {
    // 判断并提交
    async submit() {
      if (!this.form.idCardFrontImage) {
        this.form.idCardFrontImage = await this.uploadItem(
          this.files.idCardFrontImage
        );
      }
      if (!this.form.idCardBackImage) {
        this.form.idCardBackImage = await this.uploadItem(
          this.files.idCardBackImage
        );
      }
      if (!this.form.idCardHand) {
        this.form.idCardHand = await this.uploadItem(this.files.idCardHand);
      }
      if (
        !this.form.idCardFrontImage ||
        !this.form.idCardBackImage ||
        !this.form.idCardHand
      )
        return uni.showToast({
          title: "上传失败，请重新提交",
          icon: "none",
          duration: 2000,
        });
      const params = this.form;
      this.loading = true;
      standardCertification({
        idCard: params.idCard,
        idName: params.realName,
        idCardFrontPictureUrl: this.form.idCardFrontImage,
        idCardBackPictureUrl: this.form.idCardBackImage,
        faceContrastPictureUrl: this.form.idCardHand,
      })
        .then((res) => {
          if (res.code == 200) {
            uni.showToast({
              title: "资料提交成功",
              icon: "none",
              duration: 2000,
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1000);
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        });
    },
    // 选择文件
    selectFile(key) {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.files[key] = res.tempFiles[0];
        },
      });
    },
    // 上传文件
    uploadItem(file) {
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
    },
  },
};
</script>

<style lang="scss" scoped>
.page-iden-1 {
  .content-box {
    padding-bottom: 200rpx;
    .title {
      font-size: 26rpx;
      color: #7a7a7a;
      margin-bottom: 35rpx;
    }
    .box {
      height: 72rpx;
      background-color: #f1f1f1;
      border-radius: 6rpx;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 42rpx;
      // margin-bottom: 41rpx;
      flex-wrap: wrap;
      .ipt {
        flex: 1;
        font-size: 26rpx;
        color: #433f48;
      }
    }
    .item {
      background-color: #f1f1f1;
      border-radius: 6rpx;
      height: 218rpx;
      margin-bottom: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-size: 26rpx;
      margin-top: 40rpx;
      .txt {
        width: 200rpx;
      }

      .img {
        width: 166rpx;
        height: 113rpx;
        margin-right: 68rpx;
        border: 1px dashed #999;

        .pic {
          width: 100%;
          height: 100%;
        }
      }
    }
    .tip {
      width: 100%;
      color: #e63c3c;
      font-size: 24rpx;
      margin-top: 4rpx;
    }
  }
  .btn {
    width: 451rpx;
    height: 96rpx;
    background-color: #449367;
    display: flex;
    align-items: center;
    border-radius: 6rpx;
    position: fixed;
    left: 50%;
    bottom: 80rpx;
    transform: translateX(-50%);
    font-size: 30rpx;
    color: #fff;
  }
}
</style>
