<script>
import storage from "./utils/storage";
import { mapActions } from "vuex";

export default {
  globalData: {
    // 判断切换页面的交易类型
    switchTranType: null,
  },
  onLaunch() {
    console.log("App启动");
    this.checkUpdate();
    // #ifdef APP-PLUS
    plus.navigator.setFullscreen(true);//隐藏状态栏
    const jpushModule = uni.requireNativePlugin("JG-JPush");

    if (!jpushModule) return;
    if (uni.getSystemInfoSync().platform === "ios") {
      // 请求定位权限
      let locationServicesEnabled = jpushModule.locationServicesEnabled();
      let locationAuthorizationStatus =
        jpushModule.getLocationAuthorizationStatus();
      console.log("locationAuthorizationStatus", locationAuthorizationStatus);
      if (locationServicesEnabled && locationAuthorizationStatus < 3) {
        jpushModule.requestLocationAuthorization((result) => {
          console.log("定位权限", result.status);
        });
      }

      jpushModule.requestNotificationAuthorization((result) => {
        let status = result.status;
        if (status < 2) {
          uni.showToast({
            icon: "none",
            title: "您还没有打开通知权限",
            duration: 3000,
          });
        }
      });

      jpushModule.addGeofenceListener((result) => {
        let code = result.code;
        let type = result.type;
        let geofenceId = result.geofenceId;
        let userInfo = result.userInfo;
        uni.showToast({
          icon: "none",
          title: "触发地理围栏",
          duration: 3000,
        });
      });
    }

    jpushModule.initJPushService();
    jpushModule.setLoggerEnable(true);
    jpushModule.addConnectEventListener((result) => {
      let connectEnable = result.connectEnable;
      uni.$emit("connectStatusChange", connectEnable);
    });

    jpushModule.addNotificationListener((result) => {
      let notificationEventType = result.notificationEventType;
      let messageID = result.messageID;
      let title = result.title;
      let content = result.content;
      let extras = result.extras;

      // uni.showToast({
      //   icon: "none",
      //   title: JSON.stringify(result),
      //   duration: 3000
      // })

      console.log("极光推送: addNotificationListener", result);
    });

    jpushModule.addCustomMessageListener((result) => {
      let type = result.type;
      let messageType = result.messageType;
      let content = result.content;

      // uni.showToast({
      //   icon: "none",
      //   title: JSON.stringify(result),
      //   duration: 3000
      // })

      console.log("极光推送: addCustomMessageListener", result);
    });

    jpushModule.addLocalNotificationListener((result) => {
      let messageID = result.messageID;
      let title = result.title;
      let content = result.content;
      let extras = result.extras;

      // uni.showToast({
      //   icon: "none",
      //   title: JSON.stringify(result),
      //   duration: 3000
      // })

      console.log("极光推送: addLocalNotificationListener", result);
    });
    // #endif
  },
  onShow: function () {
    const token = storage.get("token");
    if (token) {
      // this.GET_MEMBER_ASSETS();
      // this.GET_USER_INFO();
    }
    this.INIT_SOCKET();
  },
  onHide: function () {
    console.log("App Hide");
  },
  methods: {
    ...mapActions("socket", ["INIT_SOCKET"]),
    ...mapActions("user", ["GET_USER_INFO", "GET_MEMBER_ASSETS"]),
    checkUpdate() {
      // #ifdef APP-PLUS
      plus.runtime.getProperty(plus.runtime.appid, (res) => {
        this.$store.state.version = res.version;
        console.log("当前版本:", res.version);
        queryVersionInfo({
          appType: 1,
          versionNo: res.version,
        })
          .then((res) => {
            if (Number(res.code) === 0) {
              this.$store.state.versionList = res.data;
              if (res.data.length) {
                console.log("有新的版本,跳转到更新页面");
                setTimeout(() => {
                  uni.navigateTo({
                    url: "/pages/update",
                  });
                }, 2000);
              }
            }
          })
          .catch((_) => {});
      });
      // #endif
    },
    getRegistrationID() {
      jpushModule.getRegistrationID((result) => {
        let registerID = result.registerID;
        console.log(registerID);
        // uni.$u.toast('极光推送注册id: ' + registerID)
        this.registrationID = registerID;
      });
    },
  },
};
</script>

<style>
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import "./common/uni.css";

html {
  overflow: hidden;
}

uni-page[data-page="pages/page-market/index"] uni-page-head-hd,
uni-page[data-page="pages/payment/success"] uni-page-head-hd,
uni-page[data-page="pages/payment/error"] uni-page-head-hd,
uni-page[data-page="pages/transfer/error"] uni-page-head-hd,
uni-page[data-page="pages/transfer/success"] uni-page-head-hd {
  display: none !important;
}
uni-page {
  overflow: auto;
}

/*uni-page[data-page="pages/transfer/record"] uni-page-head-hd {*/
/*  display: block !important;*/
/*}*/

::v-deep .u-button--disabled {
  background: #cccccc 0 0 no-repeat padding-box !important;
  border: none !important;
  opacity: 1 !important;
}
uni-page-body,
page,
#app {
  height: 100%;
  min-height: 100%;
  background: #f8f8f8;
}

.status_bar {
  max-width: 500px;
  height: var(--status-bar-height);
  width: 100%;
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

/*每个页面公共css */
uni-modal,
uni-toast {
  z-index: 999999;
}
.u-navbar__content {
  height: calc(104rpx + env(safe-area-inset-top))!important;
  background-color: #0c1114!important;
}
.u-navbar__content__left .uicon-arrow-left{
  color: #fff!important;
}
.u-navbar__content__title {
  color: #fff!important;
  font-size: 19px!important;
  font-weight: 400!important;
}
.self-body {
  /* padding-top: calc(85rpx + var(--status-bar-height)); */
  padding-top: 104rpx;
}
.info-page-bg {
  /* 详情页背景 */
  height: 100%;
  background-color: #0c1114;
  box-sizing: border-box;
  /* padding-top: 20rpx; */
}
.info-page-content {
  /* 详情页内容 */
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: #fff;
  border-top-right-radius: 22rpx;
  border-top-left-radius: 22rpx;
  padding: 40rpx;
}
.info-page-btn {
  display: flex!important;
  width: 451rpx!important;
  height: 96rpx!important;
  background-color: #449367;
  color: #fff!important;
  border-radius: 6rpx!important;
  align-items: center;
  justify-content: center;
  font-size: 30rpx!important;
  border: none!important;
}
.info-page-disabled {
  color: #323233!important;
  background-color: #ccc!important;
}

.uni-scroll-view {
  &::-webkit-scrollbar {
    display: none !important;
  }
}
.uni-tabbar {
  height: 116rpx;
  box-shadow: 0 -12rpx 36rpx 0px rgba(144, 144, 144, 0.39);
}
.uni-tabbar .uni-tabbar__icon {
  width: 44rpx !important;
  height: 44rpx !important;
}

/* 选择按钮 */
.check {
  border: 1px solid #c7c7c7;
  width: 41rpx;
  height: 41rpx;
  border-radius: 50%;
  margin-right: 10rpx;
  box-sizing: border-box;
  padding: 6rpx;
}
.checked {
  border: 1px solid #449367;
  position: relative;
  
}
.checked .in {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #449367;
    display: block;
  }
</style>
