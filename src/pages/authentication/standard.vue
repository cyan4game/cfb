<template>
  <view class="auth-view">
    <noticeNavbar title="基础认证">
      <template #left>
        <u-image
          src="/static/icons/back.svg"
          width="24px"
          height="24px"
        ></u-image>
      </template>
      <template #right>
        <u-image
          @click="pageTo('pages/customer/index')"
          src="/static/icons/customer.svg"
          width="24px"
          height="24px"
        ></u-image>
      </template>
    </noticeNavbar>
    <u-sticky>
      <view class="show-name flex-box">
        <text>用户名 : </text>
        <text>{{ user.username }}</text>
      </view>
    </u-sticky>
    <view class="auth-upload-content">
      <view class="scroll-page">
        <view class="tips mb-20">通过方可提高otc与转帐交易</view>
        <view class="show-upload">
          <u-upload
            :fileList="fileList1"
            :previewFullImage="true"
            height="120px"
            width="315px"
            @delete="deletePic"
            @afterRead="afterRead"
            name="1"
            :maxCount="1"
          >
            <view class="show-custom">
              <u-image
                src="/static/icons/handle.svg"
                width="100px"
                height="65px"
              ></u-image>
              <view class="handle-upload">上传手持身份证</view>
            </view>
          </u-upload>
        </view>
        <view class="show-upload">
          <u-upload
            :fileList="fileList2"
            :previewFullImage="true"
            height="120px"
            width="315px"
            @delete="deletePic"
            @afterRead="afterRead"
            name="2"
            :maxCount="1"
          >
            <view class="show-custom">
              <u-image
                src="/static/icons/front.svg"
                width="100px"
                height="65px"
              ></u-image>
              <view class="handle-upload">上传身份证「正面」</view>
            </view>
          </u-upload>
        </view>
        <view class="show-upload">
          <u-upload
            :fileList="fileList3"
            :previewFullImage="true"
            height="120px"
            width="315px"
            @delete="deletePic"
            @afterRead="afterRead"
            name="3"
            :maxCount="1"
          >
            <view class="show-custom">
              <u-image
                src="/static/icons/back-upload.svg"
                width="100px"
                height="65px"
              ></u-image>
              <view class="handle-upload">上传身份证「反面」</view>
            </view>
          </u-upload>
        </view>
        <view class="tips fs-12">
          上传格式限定JPG、JPEG或PNG，大小不能超过5MB
        </view>
        <view class="tips fs-12">
          请确保上传的身分证清晰易读，与证件原件一致
        </view>
        <u-button style="margin-top: 10px" class="login-button" @click="submit" :disabled="disabled">
          提交
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import noticeNavbar from "@/components/notice-navbar/index";
import { mapGetters, mapState } from "vuex";
import { seniorIdentity } from "../../api/api";

export default {
  name: "standard",
  components: { noticeNavbar },
  data() {
    return {
      fileList1: [],
      fileList2: [],
      fileList3: [],
    };
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    ...mapState("user", ["identityInfo"]),
    user() {
      return this.userInfo.userInfo || {}
    },
    disabled() {
      return !(
        !!this.fileList1.length &&
        !!this.fileList2.length &&
        !!this.fileList3.length
      );
    },
  },
  methods: {
    // 删除图片
    deletePic(event) {
      this[`fileList${event.name}`].splice(event.index, 1);
    },
    async afterRead(event, list, name) {
      let lists = [].concat(event.file);
      let fileListLen = this[`fileList${event.name}`].length;
      lists.map((item) => {
        this[`fileList${event.name}`].push({
          ...item,
          status: "uploading",
          message: "上传中",
        });
      });
      for (let i = 0; i < lists.length; i++) {
        const result = await this.uploadFilePromise(lists[i].url);
        let item = this[`fileList${event.name}`][fileListLen];
        this[`fileList${event.name}`].splice(
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
      console.log(this.fileList1, this.fileList2, this.fileList3);
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
      const params = {
        identityCardImgInHand: this.fileList1[0].url, // 手持身份证照片
        identityCardImgFront: this.fileList2[0].url, // 正面
        identityCardImgReverse: this.fileList3[0].url,
      };
      seniorIdentity(params).then((res) => {
        if (res.code.toString() === '0') {
          this.router({ type: "back" });
        }
      });
    },
    pageTo(url) {
      this.router(url);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style";
.auth-upload-content {
  flex: 1;
  background: #fff;
  //min-height: 100%;
  box-sizing: border-box;
  position: relative;

  .scroll-page {
    padding: 20px;
    width: 100%;
    //height: 100%;
    box-sizing: border-box;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .show-upload {
    border: 1px dashed #cccccc;
    border-radius: 10px;
    //width: 335px;
    //height: 130px;
    padding: 0;
    margin-bottom: 15px;
  }
}

.show-custom {
  margin: 20px 0 15px;
}

.fs-12 {
  font-size: 12px;
  line-height: 20px;
}

::v-deep {
  .u-upload__wrap {
    justify-content: center;
  }
}
</style>
