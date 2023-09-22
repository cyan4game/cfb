<template>
  <view class="appeal-page">
    <view class="flex-box appeal-tip">
      <u-image
        width="24px"
        height="24px"
        src="/static/icons/tips.svg"
      ></u-image>
      <text class="tip-text">请备注申诉原因，上传图片作为仲裁依据</text>
    </view>
    <view class="show-label flex-box">
      <u-image
        width="24px"
        height="24px"
        src="/static/icons/message.svg"
      ></u-image>
      <text class="label ml-5">申诉原因</text>
    </view>
    <view class="show-input mb-20">
      <u-textarea
        class="remark-text"
        v-model="remark"
        placeholder="ex: 付款金额错误, 未收到付款"
      ></u-textarea>
    </view>

    <view class="show-label flex-box">
      <u-image
        width="24px"
        height="24px"
        src="/static/icons/img.svg"
      ></u-image>
      <text class="label ml-5">上传图片</text>
    </view>
    <u-upload
      :fileList="fileList"
      @afterRead="afterRead"
      @beforeRead="beforeRead"
      @delete="deletePic"
      name="5"
      multiple
      :maxCount="3"
      :previewFullImage="true"
    ></u-upload>
    <u-button
      @click="submit"
      :disabled="disabled"
      class="submit-appeal login-button"
      type="primary"
      text="提交申诉信息"
    ></u-button>
  </view>
</template>

<script>
import { appeal } from "../../api/api";
import { mapGetters } from "vuex";

export default {
  name: "index",
  data() {
    return {
      remark: "",
      fileList: [],
      orderSn: "",
    };
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    disabled() {
      return this.remark.length < 2;
    },
  },
  onLoad(option) {
    this.orderSn = option.id;
  },
  methods: {
    // 删除图片
    deletePic(event) {
      this.fileList.splice(event.index, 1);
    },
    beforeRead(event) {
      console.log("beforeRead", event);
    },
    async afterRead(event, list, name) {
      // console.log(event, list, name, this.fileList, "event");
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      let lists = [].concat(event.file);
      let fileListLen = this.fileList.length;
      lists.map((item) => {
        this.fileList.push({
          ...item,
          status: "uploading",
          message: "上传中",
        });
      });
      for (let i = 0; i < lists.length; i++) {
        const result = await this.uploadFilePromise(lists[i].url);
        // console.log(result, "result");
        let item = this.fileList[fileListLen];
        this.fileList.splice(
          fileListLen,
          1,
          Object.assign(item, {
            status: "success",
            message: "",
            url: result,
          })
        );
        fileListLen++;
      }
      // console.log(this.fileList);
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
    submit() {
      if (this.disabled) return;
      let list = [];
      this.fileList.forEach((item) => {
        list.push(item.url);
      });
      const params = {
        initiatorId: this.userInfo.userInfo.id,
        orderSn: this.orderSn,
        remark: this.remark,
        appealId: "0",
        imgUrls: list.join(","),
      };
      appeal(params).then((res) => {
        if (res.code.toString() === '0') {
          this.router({
            url: "pages/complete/index",
            params: { type: "appeal", orderSn: this.orderSn },
          });
          this.remark = "";
          this.fileList = [];
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.appeal-page {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
  .appeal-tip {
    border-radius: 10px;
    background: #ffe6e6;
    padding: 8px 10px;
    margin-bottom: 22px;
    .tip-text {
      font-size: 14px;
      color: #ef3c3c;
      margin-left: 10px;
    }
  }
  .show-label {
    margin-bottom: 12px;
  }
  .show-input {
    border-bottom: 1px solid #ddd;
  }
  .login-button {
    background: #505bde;
    border-color: #505bde;
    margin-top: 30px;
  }
  .u-button--disabled {
    background: #cccccc 0% 0% no-repeat padding-box;
    border: none;
    opacity: 1;
  }
}
</style>
