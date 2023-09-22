<template>
  <view class="auth-view">
    <noticeNavbar back title="身份认证">
      <template #right>
        <u-image
          @click="pageTo('/pages/customer/index')"
          src="/static/icons/customer.svg"
          width="24px"
          height="24px"
        ></u-image>
      </template>
    </noticeNavbar>
    <view class="scroll-view" :style="{ height: `${listHeight}px` }">
      <view class="show-name flex-box">
        <text>用户名 :</text>
        <text>{{ user.username }}</text>
      </view>
      <view class="auth-content">
        <view
          class="auth-content-list"
          :class="{ 'is-auth': identityInfo.real }"
        >
          <!--         v-if="!identityInfo.real"-->
          <view
            class="to-auth"
            v-if="!identityInfo.real"
            @click="pageTo('/pages/authentication/baseAuth')"
            >去认证</view
          >
          <view class="flex-box">
            <text class="auth-label">基础认证</text>
            <text
              v-if="returnStatus('real').class"
              class="auth-status"
              :class="[returnStatus('real').class]"
            >
              {{ returnStatus("real").text }}
            </text>
          </view>
          <!--展示身份信息-->
          <view
            class="show-info"
            v-if="identityInfo.realBO && identityInfo.real"
          >
            <view class="flex-box">
              <text class="flex-label">证件姓名</text>
              <text class="flex-value">{{ identityInfo.realBO.realName }}</text>
            </view>
            <view class="flex-box">
              <text class="flex-label">身份证号</text>
              <text class="flex-value">{{ identityInfo.realBO.idNumber }}</text>
            </view>
          </view>
          <view class="tips-text" v-if="!identityInfo.real">
            <text>完成基础认证 (姓名+身分证号)</text>
            <view>方可进行OTC及转帐交易额度：</view>
          </view>
          <showLimit :config="config" :returnLimit="returnLimit" type="real" />
        </view>
        <view class="flex-box show-next">
          <u-image
            width="50px"
            height="28px"
            src="/static/icons/down.svg"
          ></u-image>
        </view>
        <view :class="{ 'auth-content-list': true, 'is-auth': identityInfo.senior }">
          <view
            class="to-auth"
            @click="pageTo('/pages/authentication/standard')"
            v-if="!identityInfo.senior && identityInfo.real"
          >
            去认证
          </view>
          <view class="flex-box">
            <text class="auth-label">标准认证</text>
            <text
              v-if="returnStatus('senior').class"
              class="auth-status"
              :class="[returnStatus('senior').class]"
            >
              {{ returnStatus("senior").text }}
            </text>
          </view>
          <view class="tips-text">
            <text>完成标准认证 (身分证正反面照片+手持身份证)</text>
            <view>方可提高OTC及转帐交易额度</view>
          </view>
          <showLimit
            :config="config"
            :returnLimit="returnLimit"
            type="senior"
          />
        </view>
        <view class="flex-box show-next">
          <u-image
            width="50px"
            height="28px"
            src="/static/icons/down.svg"
          ></u-image>
        </view>
        <view
          :class="{ 'auth-content-list': true, 'is-auth': identityInfo.face }"
        >
          <view
            class="to-auth"
            @click="pageTo('/pages/authentication/advanced')"
            v-if="!identityInfo.face && identityInfo.senior"
          >
            去认证
          </view>
          <view class="flex-box">
            <text class="auth-label">高级认证</text>
            <text
              :class="['auth-status', returnStatus('face', 'faceStatus').class]"
            >
              {{ returnStatus("face", "faceStatus").text }}
            </text>
          </view>
          <view class="tips-text">
            <text>完成高级认证 (人脸辨识)</text>
            <view>方可提高OTC及转帐交易额度</view>
          </view>
          <showLimit :config="config" :returnLimit="returnLimit" type="face" />
        </view>
      </view>
    </view>
    <!--    <view class="auth-content">-->
    <!--      <view class="content">-->
    <!--    -->
    <!--      </view>-->
    <!--    </view>-->
  </view>
</template>

<script>
import noticeNavbar from "@/components/notice-navbar/index";
import { mapActions, mapGetters, mapState } from "vuex";
import showLimit from "./components/show-limit";

export default {
  name: "index",
  components: { noticeNavbar, showLimit },
  data() {
    return {
      listHeight: "",
    };
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    ...mapState("user", ["identityInfo", "configData"]),
    user() {
      return this.userInfo.userInfo || {}
    },
    config() {
      let obj = {};
      this.configData.forEach((item) => {
        obj[item.cfgKeyName] = item.cfgKeyValue;
      });
      return obj;
    },
  },
  onShow() {
    this.GET_IDENTITY_INFO();
    this.GET_GLOBAL_CONFIG();
    uni.getSystemInfo({
      complete: (info) => {
        this.listHeight = info.windowHeight - 55;
        // console.log(this.x);
        // console.log(info);
      },
    });
  },
  async onPullDownRefresh() {
    await this.GET_IDENTITY_INFO();
    this.GET_GLOBAL_CONFIG();
    uni.stopPullDownRefresh();
  },
  methods: {
    ...mapActions("user", ["GET_IDENTITY_INFO", "GET_GLOBAL_CONFIG"]),
    returnStatus(type, auditStatus = "auditStatus") {
      // 高级认证状态0未认证 1已认证 2认证失败
      const statusList = {
        0: { text: "未认证", class: "un-auth" },
        1: { text: "已认证", class: "is-auth" },
        2: { text: "认证中", class: "is-apply" },
        3: { text: "认证失败", class: "is-fail" },
      };
      const flag = this.identityInfo[type];
      const status = this.identityInfo[auditStatus];
      let show = {
        class: "",
        text: "",
      };
      if (flag) {
        show = {
          class: "is-auth",
          text: "已认证",
        };
      } else {
        if (status) show = statusList[status];
      }
      return show;
    },
    // 返回限额
    returnLimit(type) {
      const { real, senior, face } = this.identityInfo;
      const unAuth = {
        time: "APP_USER_OTC_UNAUTH_TRANSACTION_SINGLE",
        day: "APP_USER_OTC_UNAUTH_TRANSACTION_DAY",
        month: "APP_USER_OTC_UNAUTH_TRANSACTION_MONTH",
        transTime: "APP_USER_OTC_UNAUTH_TRANSFER_SINGLE",
        transDay: "APP_USER_OTC_UNAUTH_TRANSFERS_DAY",
        transMonth: "APP_USER_OTC_UNAUTH_TRANSFERS_MONTH",
      };
      const info = {
        real: {
          time: "APP_USER_OTC_BASIC_REAL_TRANSACTION_SINGLE",
          day: "APP_USER_OTC_BASIC_REAL_TRANSACTION_DAY",
          month: "APP_USER_OTC_BASIC_REAL_TRANSACTION_MONTH",
          transTime: "APP_USER_OTC_BASIC_REAL_TRANSFER_SINGLE",
          transDay: "APP_USER_OTC_BASIC_REAL_TRANSFER_DAY",
          transMonth: "APP_USER_OTC_BASIC_REAL_TRANSFER_MONTH",
        },
        senior: {
          time: "APP_USER_OTC_REAL_TRANSACTION_SINGLE",
          day: "APP_USER_OTC_REAL_TRANSACTION_DAY",
          month: "APP_USER_OTC_REAL_TRANSACTION_MONTH",
          transTime: "APP_USER_OTC_REAL_TRANSFER_SINGLE",
          transDay: "APP_USER_OTC_REAL_TRANSFER_DAY",
          transMonth: "APP_USER_OTC_REAL_TRANSFER_MONTH",
        },
        face: {
          time: "APP_USER_OTC_SENIOR_TRANSACTION_SINGLE",
          day: "APP_USER_OTC_SENIOR_TRANSACTION_DAY",
          month: "APP_USER_OTC_SENIOR_TRANSACTION_MONTH",
          transTime: "APP_USER_OTC_SENIOR_TRANSFER_SINGLE",
          transDay: "APP_USER_OTC_SENIOR_TRANSFER_DAY",
          transMonth: "APP_USER_OTC_SENIOR_TRANSFER_MONTH",
        },
      };
      const config = this.config;
      let obj = {};
      if (type === "real") {
        if (real) obj = info.real;
        else obj = unAuth;
      }
      if (type === "senior") {
        if (real) {
          if (senior) obj = info.senior;
          else obj = info.real;
        } else obj = unAuth;
      }
      if (type === "face") {
        if (real) {
          if (senior) {
            if (face) obj = info.face;
            else obj = info.senior;
          } else obj = info.real;
        } else obj = unAuth;
      }
      return obj;
    },
    pageTo(url) {
      // uni.$u.route(url);
      uni.navigateTo({ url });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "style";
</style>
