<!-- 个人资料 -->
<template>
  <view class="info-page-bg self-body mine-info">
    <u-navbar :safeAreaInsetTop="false" :title="'个人资料'" @leftClick="() => $routers.back()" />

    <view class="info-page-content content-box">
      <!-- 信息面板 -->
      <view class="info-box">
        <view class="title">信息管理</view>
        <view class="item" @click="editAvatar">
          <text class="name">头像</text>
          <view class="item-box">
            <u-image
              v-if="!userInfo.avatar"
              class="avatar"
              src="/static/images/mine/avatar.png"
              width="60rpx"
              height="60rpx"
            ></u-image>
            <u-image
              v-if="userInfo.avatar"
              class="avatar"
              :src="userInfo.avatar"
              width="60rpx"
              height="60rpx"
            ></u-image>
          </view>
          <u-image
            class="right"
            src="/static/images/mine/right.png"
            width="11rpx"
            height="20rpx"
          ></u-image>
        </view>
        <view class="item" @click="goNickname">
          <text class="name">昵称</text>
          <text class="item-box value">{{
            userInfo.nickName || "未设置昵称"
          }}</text>
          <u-image
            class="right"
            src="/static/images/mine/right.png"
            width="11rpx"
            height="20rpx"
          ></u-image>
        </view>
        <view class="item">
          <text class="name">账户ID</text>
          <view class="value copy-box">
            <text>{{ userInfo.id }}</text>
            <u-image
              @click="copy"
              class="copy"
              src="/static/images/mine/copy.png"
              width="26rpx"
              height="31rpx"
            ></u-image>
          </view>
        </view>
      </view>
    </view>

    <!-- 次数提示 -->
    <confirm-dialog
      :content="`其他用户将会看到您更改后的头像。您今年还可以更改${userInfo.avatarYearUpdateLastCount}次头像`"
      ref="tipDialog"
      :title="'更改头像'"
      :btn="'好的'"
      :borderBtn="'取消'"
      :btnHandle="chooseFile"
    />
  </view>
</template>

<script>
import storage from "@/utils/storage";
import { copyTxt, updatUserInfo } from "@/utils/utils";
import { _upload, avatarSettings } from "@/api/api";

export default {
  data() {
    return {
      userInfo: {},
    };
  },
  created() {
    this.userInfo = storage.get("userInfo") || {};
  },
  onShow() {
    this.userInfo = storage.get("userInfo") || {};
  },
  methods: {
    // 选择文件
    editAvatar() {
      if (!this.userInfo.avatarYearUpdateLastCount)
        return uni.showToast({
          title: "头像可更改次数：0",
          icon: 'none',
          duration: 2000,
        });
      this.$refs.tipDialog.open();
    },
    // 选择文件
    chooseFile() {
      this.$refs.tipDialog.close();
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.uploadAvatar(res.tempFiles[0]);
        },
      });
    },
    // 上传头像
    uploadAvatar(file) {
      uni.showLoading({
        title: "",
        mask: true,
      });
      _upload(
        file,
        (res) => {
          try {
            const datas = JSON.parse(res.data);
            if (datas.code == 200) {
              // 设置头像
              setTimeout(() => {
                this.setAvatar(datas.data);
              }, 200);
            } else {
              uni.showToast({
                title: "上传失败，请重试",
                icon: "none",
                duration: 2000,
              });
            }
          } catch {
            uni.showToast({
              title: "上传失败",
              icon: "none",
              duration: 2000,
            });
          }
        },
        () => {
          uni.showToast({
            title: "网络异常，请重试",
            icon: "none",
            duration: 2000,
          });
        },
        () => {
          uni.hideLoading();
        }
      );
    },
    // 设置头像
    setAvatar(url) {
      uni.showLoading({
        title: "",
        mask: true,
      });
      avatarSettings({
        avatar: url,
      })
        .then((res) => {
          if (res.code == 200) {
            this.userInfo.avatar = url || "";
            this.userInfo.avatarYearUpdateLastCount--;
            storage.set("userInfo", this.userInfo);
            updatUserInfo();
            uni.showToast({
              title: "更新成功",
              icon: 'none',
              duration: 2000,
            });
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    // 复制
    copy() {
      copyTxt(this.userInfo.id);
      uni.showToast({
        title: "已复制",
        icon: "none",
        duration: 2000,
      });
    },
    // 修改昵称
    goNickname() {
      uni.navigateTo({
        url: "/pages/mine/editName",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.mine-info {
  height: 100%;

  .content-box {
    background-color: #f1f1f1;
  }
  .info-box {
    position: relative;
    background-color: #fff;
    border-radius: 9rpx;
    padding: 44rpx 62rpx;

    .title {
      color: #484848;
      font-size: 32rpx;
      margin-bottom: 40rpx;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80rpx;
      color: #8c8c8c;
      font-size: 26rpx;
      .item-box {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .right {
        margin-left: 20rpx;
      }
      .avatar {
        border-radius: 50%;
        overflow: hidden;
      }

      .value {
        color: #484848;
      }

      .copy-box {
        display: flex;
        align-items: center;

        .copy {
          margin-left: 10rpx;
        }
      }
    }
  }
}
</style>
