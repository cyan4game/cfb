<template>
  <view class="auth-view">
    <!--    验证未通过-->
    <view class="show-name flex-box" v-show="!identityInfo.face">
      <text>用户名 : </text>
      <text>{{ user.username }}</text>
    </view>
    <view class="advanced-view">
      <view v-show="!identityInfo.face">
        <view class="tips">使用KYC金融级标准规格 </view>
        <view class="tips">20秒即可提升帐户安全性 </view>
        <view class="show-advance flex-box">
          <u-image
            src="/static/icons/advance.svg"
            width="165px"
            height="165px"
          ></u-image>
        </view>
        <view class="tips fs-16">登入安全性升级！ </view>
        <view class="tips">
          完成人脸识别可享有
          <text class="is-blue">$0.00 otc</text> 及转帐功能，并可以透
          过人脸辨识进行快速又安全的交易，省去助记词验证
          的麻烦，为了提升您的使用权益与效益，请同意进行 下一步。
        </view>
        <u-button class="login-button" :disabled="isDisabled" @click="submit">
          {{ loading ? "正在初始化..." : "下一步" }}
        </u-button>
        <view class="contact is-blue" @click="pageTo('pages/customer/index')"
          >联系客服</view
        >
      </view>
      <!--验证通过-->
      <view class="is-success" v-show="identityInfo.face">
        <view class="flex-box is-center">
          <u-image
            src="/static/icons/success.svg"
            width="60px"
            height="60px"
          ></u-image>
        </view>
        <view class="flex-box is-center tips-text">人脸识别成功</view>
        <view class="flex-box is-center fs-14">感谢您已完成人脸识别！</view>
        <u-button class="login-button" @click="back">确定</u-button>
      </view>
    </view>
  </view>
</template>

<script>
import noticeNavbar from "@/components/notice-navbar/index";
import { mapActions, mapGetters, mapState } from "vuex";
import { initH5FaceIdInfo, faceIdentity } from "../../api/api";

export default {
  name: "advanced",
  components: { noticeNavbar },
  data() {
    return {
      initInfo: {},
      loading: false,
    };
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    ...mapState("user", ["identityInfo"]),
    user() {
      return this.userInfo.userInfo || {}
    },
    isDisabled() {
      return !(!!this.initInfo.optimalDomain && !this.loading);
    },
  },
  async onPullDownRefresh() {
    await this.initH5FaceIdInfo();
    this.GET_IDENTITY_INFO();
    uni.stopPullDownRefresh();
  },
  onShow() {
    this.initH5FaceIdInfo();
    this.GET_IDENTITY_INFO();
  },
  onLoad(option) {
    const { code } = option;
    if (code == 0) this.faceIdentity(option);
    // if(code==3003)
    // console.log(option, 890890);
  },
  methods: {
    ...mapActions("user", ["GET_IDENTITY_INFO"]),
    submit() {
      const {
        nonce,
        h5faceId,
        orderNo,
        userId,
        sign,
        optimalDomain,
        webankAppId,
      } = this.initInfo;
      let version = "1.0.0",
        from = "browser",
        redirectType = "1";
      let authUrl = "";

      // #ifdef H5
      const url = encodeURIComponent(window.location.href);
      authUrl = `https://${optimalDomain}/api/web/login?webankAppId=${webankAppId}&userId=${userId}&version=${version}&nonce=${nonce}&orderNo=${orderNo}&h5faceId=${h5faceId}&url=${url}&sign=${sign}&from=${from}&redirectType=${redirectType}`;
      this.replaceUrl(authUrl);
      // this.pageToView(authUrl);
      // #endif
      // #ifdef APP-PLUS
      let params = {
        path: `https://${optimalDomain}/api/web/login?`,
        webankAppId,
        nonce,
        h5faceId,
        orderNo,
        userId,
        sign,
        version,
        from,
        redirectType,
      };
      this.pageToView(params);
      // #endif
    },
    initH5FaceIdInfo() {
      this.loading = true;
      return new Promise((resolve) => {
        initH5FaceIdInfo().then((res) => {
          if (res.code.toString() === '0') {
            this.initInfo = res.data;
          }
          this.loading = false;
          resolve();
        });
      });
    },
    // h5方式 直接url替换
    replaceUrl(authUrl) {
      window.location.href = authUrl;
    },
    // app方式
    pageToView(params) {
      this.router({
        url: "pages/authentication/faceAuth",
        params: { ...params },
      });
    },
    pageTo(url) {
      this.router(url);
    },
    // faceIdentity 人脸验证通过后的回调
    faceIdentity(option) {
      faceIdentity(option).then((res) => {
        if (res.code.toString() === '0') {
          this.GET_IDENTITY_INFO(); // 调用成功后 在获取一次
        }
      });
    },
    back() {
      this.router({ url: "/pages/authentication/index" });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style";
.advanced-view {
  margin-top: 6px;
  padding: 20px;
  background: #fff;
  .show-advance {
    margin: 30px auto 34px;
    justify-content: center;
  }
  .fs-16 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  .is-blue {
    color: #0277ff;
  }
  .contact {
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
  }
}
.is-success {
  background: #fff;
}
.tips-text {
  font-size: 17px;
  margin: 20px 0;
  text-align: center;
  color: #63b72e;
}
.fs-14 {
  font-size: 14px;
  color: #333;
}
</style>
