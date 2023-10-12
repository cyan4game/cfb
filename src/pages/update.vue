<template>
  <view class="update">
    <u-image
      class="update-icon"
      height="128rpx"
      width="320rpx"
      src="/static/images/logo.png"
    ></u-image>
    <!--    <text class="update-name">财富宝</text>-->
    <u-cell-group class="update-list">
      <u-cell title="当前版本" :value="version"></u-cell>
      <u-cell title="最新版本" @click="onUpdate">
        <template slot="value">
          {{ newVersion }}
          <u-badge
            v-if="version !== newVersion"
            class="update-badge"
            numberType="overflow"
            max="99"
            value="NEW"
          ></u-badge>
        </template>
      </u-cell>
    </u-cell-group>
    <view class="update-info">
      <view class="update-info-list" v-for="(v, i) in versionList" :key="i">
        <text class="update-info-version">{{ v.versionNo }}</text>
        <view></view>
        <text class="update-info-text">{{ v.remark }}</text>
      </view>
    </view>
    <u-popup :show="showDownload" mode="center">
      <view class="update-download">
        <text class="update-download-schedule">下载中...</text>
        <u-line-progress
          class="update-download-progress"
          :percentage="progress"
          activeColor="#176af0"
        ></u-line-progress>
        <text class="update-download-info">
          {{ Math.floor(totalBytesWritten / 1024) }}KB /
          {{ Math.floor(totalBytesExpectedToWrite / 1024) }}KB
        </text>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState } from "vuex";
import { queryVersionInfo } from "../api/api";

export default {
  data() {
    return {
      showDownload: false,
      progress: 0,
      totalBytesWritten: 0,
      totalBytesExpectedToWrite: 0,
      downloadTask: null,
    };
  },
  computed: {
    ...mapState(["version", "versionList"]),
    newVersion() {
      if (this.versionList.length) {
        return this.versionList[0].versionNo;
      } else {
        return this.version;
      }
    },
    force() {
      if (this.versionList.length) {
        return !!this.versionList.filter((v) => Number(v.forceUpdate) === 1)
          .length;
      } else {
        return false;
      }
    },
    packageUpdate() {
      if (this.versionList.length) {
        return !!this.versionList.filter((v) => Number(v.updateType) === 2)
          .length;
      } else {
        return false;
      }
    },
  },
  watch: {
    versionList() {
      if (this.hasNew) {
        this.onUpdate();
      }
    },
  },
  created() {
    this.onUpdate();
  },
  onPullDownRefresh() {
    this.onRefresh();
  },
  onBackPress(options) {
    return false;
  },
  methods: {
    onRefresh() {
      queryVersionInfo({
        appType: 1,
        versionNo: this.version,
      })
        .then((res) => {
          uni.stopPullDownRefresh();
          if (Number(res.code) === 0) {
            this.$store.state.versionList = res.data;
          }
        })
        .catch((_) => {
          uni.stopPullDownRefresh();
          console.error(_);
        });
    },
    onUpdate() {
      this.version !== this.newVersion &&
        uni.showModal({
          title: "有新的版本",
          content: "马上下载更新",
          showCancel:
            this.versionList.filter(
              (v) => Number(v.forceUpdate) === 1 || Number(v.updateType) === 2
            ).length === 0,
          success: (res) => {
            if (res.confirm) {
              this.onDownload();
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          },
        });
    },
    onDownload() {
      const packageUpdateList = this.versionList.filter(
        (v) => Number(v.updateType) === 2
      );
      if (packageUpdateList.length) {
        // 整包更新
        const versionData = packageUpdateList[0];
        let url;
        if (uni.getSystemInfoSync().platform === "ios") {
          url = versionData.downloadUrlIos;
        } else if (uni.getSystemInfoSync().platform === "android") {
          url = versionData.downloadUrlAndroid;
        }
        // 如果没有新报下载地址,打开官网
        plus.runtime.openURL(url || "https://www.zhaohpay.com/");
        return;
      }

      const versionData = this.versionList[0];
      this.downloadTask = uni.downloadFile({
        url: versionData.hotUpdateUrl,
        success: (downloadResult) => {
          this.showDownload = false;
          if (downloadResult.statusCode === 200) {
            plus.runtime.install(
              downloadResult.tempFilePath,
              {
                force: false,
              },
              () => {
                console.log("install success...");
                // plus.runtime.restart()
                uni.showModal({
                  title: "更新完成",
                  content: "请重新打开APP",
                  showCancel: false,
                  success: (res) => {
                    if (res.confirm) {
                      if (uni.getSystemInfoSync().platform === "ios") {
                        plus.ios
                          .import("UIApplication")
                          .sharedApplication()
                          .performSelector("exit");
                      } else if (
                        uni.getSystemInfoSync().platform === "android"
                      ) {
                        plus.runtime.quit();
                      }
                    } else if (res.cancel) {
                      console.log("用户点击取消");
                    }
                  },
                });
              },
              (e) => {
                console.error("install fail...");
              }
            );
          }
        },
      });

      this.downloadTask.onProgressUpdate(
        ({ progress, totalBytesWritten, totalBytesExpectedToWrite }) => {
          this.progress = progress;
          this.totalBytesWritten = totalBytesWritten;
          this.totalBytesExpectedToWrite = totalBytesExpectedToWrite;
        }
      );

      this.showDownload = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.update {
  flex: 1;
  min-height: 100%;
  background-color: #ffffff;
  width: 100%;
  padding-top: 100rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;

  &-name {
    font-size: 48rpx;
    margin-top: 20rpx;
  }

  &-list {
    width: 100%;
    margin-top: 100rpx;
    display: block !important;
    flex: unset;
  }

  &-badge {
    margin-left: 20rpx;
  }

  &-download {
    width: 600rpx;
    padding: 20rpx;
    text-align: center;

    &-schedule {
      font-weight: bold;
      font-size: 28rpx;
      color: #176af0;
    }

    &-progress {
      margin-top: 20rpx;
    }

    &-info {
      font-size: 28rpx;
      color: #666666;
      width: 100%;
      display: block;
      text-align: right;
    }
  }

  &-info {
    width: 100%;
    padding: 40rpx;
    text-align: left;
    box-sizing: border-box;

    &-list {
      margin-bottom: 20rpx;
    }

    &-text {
      font-size: 28rpx;
    }

    &-version {
      font-weight: bold;
      font-size: 32rpx;
    }
  }
}
</style>
