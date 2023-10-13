<!-- 认证第一步-身份号码表单 -->
<template>
  <view class="info-page-bg self-body page-iden-1">
    <u-navbar
      :safeAreaInsetTop="false"
      :title="'实名认证'"
      @leftClick="() => $routers.back()"
    />
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
      <view class="item" @click="selectFile">
        <view class="img">
          <u-image
            class="pic"
            v-if="!file.path"
            src="/static/images/mine/iden-3.png"
            width="100%"
            height="100%"
          ></u-image>
          <u-image
            mode="fit"
            class="pic"
            v-if="file.path"
            :src="file.path"
            width="100%"
            height="100%"
          ></u-image>
        </view>
        <view>人像照片</view>
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
      },
      file: {},
    };
  },
  computed: {
    disabled() {
      return this.loading || !(this.form.realName && this.form.idCard);
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
    this.form.realName = this.idenInfo.realName || "";
    this.form.idCard = this.idenInfo.idCard || "";
  },
  methods: {
    // 判断并提交
    async submit() {
      const params = this.form;
      this.loading = true;
      const rs = await this.uploadItem(this.file);
      if (!rs) return (this.loading = false);
      standardCertification({
        idCard: params.idCard,
        idName: params.realName,
        faceContrastPictureUrl: rs,
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
    // 选择照片
    selectFile() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.file = res.tempFiles[0];
        },
      });
    },
    // 上传文件
    uploadItem(file) {
      return new Promise((resolve) => {
        uni.showLoading({
          title: "上传中",
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
