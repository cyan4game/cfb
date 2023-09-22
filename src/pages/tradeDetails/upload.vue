<template>
  <view class="upload-page">
    <view class="upload-label">上传付款凭证</view>
    <view class="upload-tips"
      >该订单为卖方要求,<br />您必须上传您的{{
        isVoucher ? "视频" : "图片"
      }}付款凭证,以证明付款真实性</view
    >
    <u-upload
      :accept="isVoucher ? 'video' : 'image'"
      :fileList="fileList"
      :previewFullImage="true"
      height="170px"
      width="335px"
      @delete="deletePic"
      @afterRead="afterRead"
      name="1"
      :maxCount="1"
    >
      <view class="show--upload">
        上传{{ isVoucher ? "视频" : "图片" }}凭证
      </view>
    </u-upload>
    <u-button
      class="login-button"
      :disabled="!fileList.length"
      @click="submit"
      type="primary"
      text="提交"
    ></u-button>
  </view>
</template>

<script>
import { getVoucher, uploadVoucher } from "../../api/api";

export default {
  name: "upload",
  data() {
    return {
      isVoucher: false, // true上传视频 false 上传图片
      fileList: [],
      orderSn: "",
      coinUnit: "",
    };
  },
  onShow() {
    this.checkVoucher();
  },
  onLoad({ orderSn, coinUnit }) {
    this.orderSn = orderSn;
    this.coinUnit = coinUnit;
  },
  methods: {
    checkVoucher() {
      getVoucher().then((res) => {
        if (res.code.toString() === '0') {
          this.isVoucher = res.data;
        }
      });
    },
    async afterRead(event) {
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      let lists = [].concat(event.file);
      let fileListLen = this.fileList.length;
      lists.map((item) => {
        this.fileList.push({
          ...item,
          // status: "uploading",
          // message: "上传中",
        });
      });
    },
    uploadFilePromise(url) {
      return new Promise((resolve, reject) => {
        let a = uni.uploadFile({
          url: "/uploadFile", // 仅为示例，非真实的接口地址
          filePath: url,
          name: "file",
          formData: {
            user: "test",
          },
          success: (res) => {
            // setTimeout(() => {
            resolve(JSON.parse(res.data).downloadLink);
            // }, 1000);
          },
        });
      });
    },
    // 删除图片
    deletePic(event) {
      this[`fileList`].splice(event.index, 1);
    },
    async submit() {
      const file = this.fileList[0].url;
      const image = await this.uploadFilePromise(file);
      if (image) {
        const params = {
          orderSn: this.orderSn,
          paymentVoucher: image,
        };
        uploadVoucher(params).then((res) => {
          if (res.code.toString() === '0') {
            this.router({
              url: "pages/complete/index",
              params: {
                type: "isBuy",
                orderSn: this.orderSn,
                coinUnit: this.coinUnit,
              },
            });
          }
        });
      }
      // this.fileList.forEach((item) => {
      //   console.log(item);
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-page {
  height: 100%;
  background: #fff;
  padding: 20px;
  .upload-label {
    font-size: 16px;
    color: #333;
    margin-bottom: 7px;
  }
  .upload-tips {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
  }
  .show--upload {
    height: 175px;
    width: 100%;
    border: 1px dashed #cccccc;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #999;
    box-sizing: border-box;
  }
}
::v-deep {
  .u-upload__wrap {
    width: 100%;
    box-sizing: border-box;
    > uni-view {
      width: 100%;
    }
  }
}
</style>
