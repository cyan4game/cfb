<template>
  <view class="first-set-google-auth">
    <view v-if="!showGoogleAuth">
      <u-text
        size="16"
        align="center"
        margin="30px 0 0 0"
        text="您需要确保您已经安装了谷歌身份验证器APP"
      ></u-text>
      <u-text
        margin="20px 0"
        size="20"
        color="#505bde"
        align="center"
        text="Google Authenticator"
      ></u-text>
      <view class="text-tips">
        <text class="text-tips-text"
          >如果您是大陆用户，您可能无法在手机自带应用市场获取到此应用，您可以从其他地方下载安装</text
        >
      </view>
      <u-button
        @click="submit"
        class="login-button"
        type="primary"
        text="下一步"
      ></u-button>
      <u-text
        margin="20px 0"
        @click="handleSkip"
        align="center"
        color="#0277FF"
        size="16"
        text="跳过"
      ></u-text>
    </view>
    <view v-else>
      <view class="error-tips">
        <text class="error-tips-text"
          >非常重要：
          请备份以下32位秘钥。并保存在您认为安全的地方。在手机丢失/谷歌身份验证器被异常卸载的情况下，您可以通过此秘钥回复。</text
        >
      </view>

      <view class="img-container">
        <u-text
          margin="0px 0 35px 0"
          align="center"
          color="#505bde"
          text="请将以下秘钥复制到您的谷歌验证器"
        ></u-text>
        <!--        <uqrcode :size="200" ref="uQRCode" text="uQRCode 3.0"></uqrcode>-->
        <uqrcode
          v-if="googleInfo.secret"
          :size="200"
          ref="uQRCode"
          :text="googleInfo.secret"
        ></uqrcode>
        <!--        <uqrcode></uqrcode>-->
        <!--        <u&#45;&#45;image width="160" height="160" mode="aspectFit" src="https://cdn.uviewui.com/uview/album/1.jpg" :fade="true" duration="450"></u&#45;&#45;image>-->
        <u-text
          margin="10px 0"
          size="12"
          color="#0000BF"
          align="center"
          :text="googleInfo.secret"
        ></u-text>
        <u-button
          class="copy-button login-button"
          @click="handleCopy(googleInfo.secret)"
          type="primary"
          text="复制"
        ></u-button>
      </view>
      <u-text
        margin="30px 0 20px"
        color="#505bde"
        size="16"
        align="center"
        text="谷歌验证码"
      ></u-text>
      <u-code-input
        :dot="true"
        class="input"
        v-model="googleCode"
        :maxlength="6"
      ></u-code-input>
      <u-button
        @click="finish"
        type="primary"
        :disabled="disabled"
        text="完成"
      ></u-button>
      <!--      <u&#45;&#45;text-->
      <!--        margin="20px 0"-->
      <!--        @click="showGoogleAuth = false"-->
      <!--        align="center"-->
      <!--        color="#aaa"-->
      <!--        text="返回"-->
      <!--      ></u&#45;&#45;text>-->
    </view>
  </view>
</template>

<script>
import { googleQR, googleAuth } from "../../config/api";
import uqrcode from "../../common/Sansnn-uQRCode/components/uqrcode/uqrcode.vue";
export default {
  data() {
    return {
      showGoogleAuth: false,
      googleCode: "",
      googleInfo: {},
    };
  },
  components: {
    uqrcode,
  },
  onLoad() {},
  computed: {
    disabled() {
      return this.googleCode.length < 6;
    },
  },
  mounted() {
    var a = document.getElementsByClassName("uni-page-head-hd")[0];
    a.style.display = "none";
  },
  methods: {
    submit() {
      this.showGoogleAuth = true;
      googleQR().then(({ message, data }) => {
        if (data) this.googleInfo = data;
        console.log(message);
        if (message === "已绑定验证码") {
          setTimeout(() => {
            uni.$u.route({
              type: "switchTab",
              url: "pages/index/index",
            });
          }, 10000000);
        }
      });
    },
    handleCopy(value) {
      uni.setClipboardData({
        data: value,
        success: function () {
          console.log("success");
        },
      });
    },
    finish() {
      if (this.disabled) return;
      googleAuth({ codes: this.googleCode }).then(({ code, message }) => {
        if (code === "0") {
          setTimeout(() => {
            uni.$u.route({
              type: "switchTab",
              url: "pages/index/index",
            });
          }, 1000);
        } else {
          this.googleCode = "";
        }
      });
    },
    handleSkip() {
      uni.$u.route({
        type: "switchTab",
        url: "pages/index/index",
      });
    },
  },
};
</script>

<style lang="scss">
.first-set-google-auth {
  height: 100%;
  box-sizing: border-box;
  background: #fff;
  padding: 20px 20px;
  .img-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    //.copy-button {
    //  width: 100px;
    //}
  }
  .input {
    //margin: 10px 0 20px 0;
    margin-bottom: 50px;
    display: flex;
    justify-content: center;
  }
  .info1 {
    margin: 10px 0;
  }
}
.text-tips {
  padding: 10px;
  background: #f7f7f7;
  margin-bottom: 50px;
  &-text {
    border-radius: 10px;
    font-size: 14px;
    color: #666;
  }
}
.login-button {
  background: #505bde;
  border-color: #505bde;
  margin-top: 30px;
}
.error-tips {
  background: #ffe6e6 0% 0% no-repeat padding-box;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  &-text {
    color: #ef3c3c;
    font-size: 14px;
  }
}
.u-button--disabled {
  background: #cccccc 0% 0% no-repeat padding-box;
  border: none;
  opacity: 1;
}
</style>
