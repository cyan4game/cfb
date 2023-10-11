<!-- 修改昵称 -->
<template>
  <view class="info-page-bg self-body page-setting">
    <u-navbar :title="'修改昵称'" @leftClick="() => $router.back()" />

    <view class="info-page-content page-content">
      <!-- 内容 -->
      <view class="content-box">
        <input
          class="input"
          maxlength="20"
          type="text"
          v-model.trim="userInfo.nickname"
          placeholder="输入昵称"
        />
        <view class="count">{{ (userInfo.nickname || "").length }}/20</view>

        <view class="tip-box"
          >您的昵称将对其他用户可见，您今年还有{{
            userInfo.nicknameYearUpdateLastCount
          }}次机会修改认证商 家后不能修改昵称。</view
        >
        <view class="tip-box"
          >创建昵称时，请勿使用不雅用词、财富宝官方名称和其他交易
          平台上的名称</view
        >
      </view>
    </view>

    <!-- 退出登录 -->
    <view
      class="submit"
      :class="{
        'disabled-btn':
          !userInfo.nickname || !userInfo.nicknameYearUpdateLastCount,
      }"
      @click="submit"
      >提交</view
    >
  </view>
</template>

<script>
import { nicknameSettings } from "@/api/api";
import storage from "@/utils/storage";
import { updatUserInfo } from "@/utils/utils";

export default {
  data() {
    return {
      loading: false,
      userInfo: {},
    };
  },
  created() {
    this.userInfo = storage.get("userInfo") || {};
  },
  methods: {
    // 提交
    submit() {
      if (!this.userInfo.nickname) return;
      uni.showLoading({
        title: "",
      });
      nicknameSettings({ nickname: this.userInfo.nickname })
        .then((res) => {
          if (res.code == 200) {
            storage.set("userInfo", this.userInfo);
            updatUserInfo();
            uni.showToast({
              title: "修改成功",
              icon: "none",
              duration: 2000,
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 500);
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-setting {
  height: 100%;
  .page-content {
    padding: 0;
  }
  .content-box {
    border-radius: 22rpx;
    background-color: #fff;
    width: 100%;
    height: 200rpx;
    position: relative;
    box-sizing: border-box;
    padding: 60rpx 40rpx 10rpx 40rpx;
    .input {
      background-color: #f1f1f1;
      height: 72rpx;
      border-radius: 6rpx;
      box-sizing: border-box;
      padding: 0 40rpx;
      color: #433f48;
      font-size: 28rpx;
    }
    .count {
      font-size: 26rpx;
      color: #7a7a7a;
      text-align: right;
      margin: 10rpx 0 60rpx;
    }
    .tip-box {
      color: #757575;
      font-size: 24rpx;
      margin-bottom: 48rpx;
      padding-left: 40rpx;
      position: relative;
      &::after {
        content: "";
        background-color: #449367;
        width: 14rpx;
        height: 14rpx;
        border-radius: 50%;
        position: absolute;
        top: 10rpx;
        left: 10rpx;
      }
    }
  }
  .submit {
    position: fixed;
    bottom: 100rpx;
    left: 50%;
    transform: translateX(-50%);
    background-color: #449367;
    width: 451rpx;
    height: 96rpx;
    font-size: 30rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6rpx;
  }
  .disabled-btn {
    background-color: #ddd;
    color: #999;
  }
}
</style>
