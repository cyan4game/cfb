<template>
  <view class="content index-content">
    <u-sticky class="top-box" offsetTop="0" customNavHeight="0" bgColor="">
      <notice-navbar :back="false" title="财富宝钱包"></notice-navbar>
      <user-balance></user-balance>
    </u-sticky>
    <!-- <index-notice ref="notice"></index-notice> -->
    <!-- <index-teach></index-teach> -->
    <top-menu>
      <index-banner />
    </top-menu>

    <!-- 待处理订单，提醒弹窗 -->
    <custom-modal
      :confirm="handleConfirm"
      isCenter
      title="提醒"
      message=""
      confirmText="去支付"
      cancelText="取消订单"
      :show.sync="showTip"
    >
      <template slot="suffix">
        <view class="order-tip">
          <view class="warning flex-box">
            <u-image
              class="icon"
              src="/static/icons/img_warn.svg"
              width="15px"
              height="15px"
            ></u-image>
            您有待处理订单，请尽快处理！
          </view>
          <view class="order-tip-item">
            <view class="title flex-box-between">
              <text class="label">单号：109578773</text>
              <text class="value">14:59 待付款</text>
            </view>
            <view class="flex-box-between">
              <text class="label">应付金额</text>
              <text class="value">100 RMB</text>
            </view>
            <view class="flex-box-between">
              <text class="label">订单类型</text>
              <text class="value">付款单</text>
            </view>
          </view>
          <view class="order-tip-item">
            <view class="title flex-box-between">
              <text class="label">卖方收款信息</text>
            </view>
            <view class="flex-box-between">
              <text class="label">收款人</text>
              <view class="value flex-box"
                >王小明
                <u-image
                  :showLoading="true"
                  src="/static/icons/icon_copy.svg"
                  width="20px"
                  height="20px"
                  @click="handleCopy('王小明')"
                ></u-image
              ></view>
            </view>
            <view class="flex-box-between">
              <text class="label">收款银行</text>
              <text class="value">上海银行</text>
            </view>
            <view class="flex-box-between">
              <text class="label">收款卡号</text>
              <view class="value flex-box"
                >1234*****7890
                <u-image
                  :showLoading="true"
                  src="/static/icons/icon_copy.svg"
                  width="20px"
                  height="20px"
                  @click="handleCopy('1234*****7890')"
                ></u-image
              ></view>
            </view>
          </view>
          <view class="order-tip-item">
            <view class="title flex-box-between">
              <text class="label">我方付款信息</text>
            </view>

            <view class="flex-box-between">
              <text class="label">中国银行</text>
              <text class="label">张三</text>
              <text class="value">1234*****7890</text>
            </view>
            <view class="bottom-tip">
              请务必使用该银行卡付款，否则造成损失，平台概不负责。
            </view>
          </view>
        </view>
      </template>
    </custom-modal>
  </view>
</template>

<script>
import customModal from "@/components/custom-modal/index.vue";
import noticeNavbar from "../../components/notice-navbar/index";
// import { importComponent } from "../../utils/import.component";
// const locales = require.context(
//   "./components",
//   false,
//   /[A-Za-z0-9-_,\s]+\.vue$/i
// );
// const component = importComponent(locales);
import topMenu from "./components/top-menu.vue";
import userBalance from "./components/user-balance.vue";
import indexBanner from "./components/index-banner.vue";
import indexNotice from "./components/index-notice.vue";
import indexTeach from "./components/index-teach.vue";
import { mapActions } from "vuex";

export default {
  components: {
    noticeNavbar,
    topMenu,
    userBalance,
    indexBanner,
    indexNotice,
    indexTeach,
    customModal,
  },
  data() {
    return {
      showTip: false,
      task: NaN,
      span: 10 * 1000,
    };
  },
  onShow() {
    this.GET_MEMBER_ASSETS();
    this.$nextTick(() => {
      this.$refs.notice && this.$refs.notice.refreshMessage();
    });
  },
  created() {
    // this.refreshMessage()
    this.task = setInterval(() => {
      this.$refs.notice && this.$refs.notice.refreshMessage();
    }, this.span);
  },
  beforeDestroy() {
    this.task && clearInterval(this.task);
  },
  onPullDownRefresh() {
    this.GET_MEMBER_ASSETS()
      .then((res) => {
        uni.stopPullDownRefresh();
      })
      .catch((_) => {
        uni.stopPullDownRefresh();
      });
  },
  methods: {
    ...mapActions("user", ["GET_MEMBER_ASSETS"]),
    handleConfirm() {},
    handleCopy(value) {
      uni.setClipboardData({
        data: value,
        success: () => {},
      });
    },
  },
};
</script>

<style lang="scss">
.index-content {
  min-height: 100%;
  // padding-bottom: 100rpx;
  box-sizing: border-box;
  background: #fff;
  .top-box {
    overflow: hidden;
    background: #505bde !important;
  }
}
.order-tip {
  display: flex;
  flex-direction: column;
  .warning {
    background: #ffe8e8;
    border-radius: 5px;
    font-size: 12px;
    color: #f25151;
    padding: 10px;
    .icon {
      margin-right: 5px;
    }
  }
  &-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    .flex-box-between {
      margin-top: 10px;
    }
    .label,
    .value {
      font-size: 14px;
      color: #666666;
    }
    .title {
      .label {
        font-size: 16px;
        font-weight: 600;
        color: #333333;
      }
      .value {
        color: #f25151;
      }
    }
    .bottom-tip {
      color: #f25151;
      font-size: 12px;
      margin: 10px 0;
    }
  }
}
</style>
