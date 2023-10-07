<!-- 我的 -->
<template>
  <view class="page-mine">
    <!-- 顶部 -->
    <u-sticky offsetTop="0" customNavHeight="0">
      <view class="top">
        <view>我的</view>
        <u-image
          @click="navClick({ route: '/pages/customer/index' })"
          class="icon"
          src="/static/images/index/kefu.png"
          width="46rpx"
          height="40rpx"
        ></u-image>
        <u-image
          @click="navClick({ route: '/pages/message/index' })"
          class="icon icon2"
          src="/static/images/index/msg.png"
          width="40rpx"
          height="36rpx"
        ></u-image>
      </view>
    </u-sticky>

    <view class="page-content">
      <!-- 基础信息 -->
      <my-info :userInfo="userInfo" :idenInfo="idenInfo" />

      <!-- 导航 -->
      <view class="tabs">
        <view
          class="tab"
          v-for="item in tabs"
          :key="item.key"
          @click="navClick(item)"
        >
          <u-image
            class="icon"
            :src="item.icon"
            width="62rpx"
            height="58rpx"
          ></u-image>
          <text>{{ item.name }}</text>
        </view>
      </view>

      <!-- 选项 -->
      <view class="navs">
        <view
          class="nav"
          v-for="item in navs"
          :key="item.key"
          @click="navClick(item)"
        >
          <u-image
            class="icon"
            :src="item.icon"
            width="40rpx"
            height="40rpx"
          ></u-image>
          <view class="name">{{ item.name }}</view>
          <view class="content">
            <!-- 当前版本 -->
            <template v-if="item.key == 6">
              <view class="version">3.1.4</view>
              <view class="update">点击更新</view>
            </template>
          </view>
          <u-image
            class="icon"
            src="/static/images/mine/right.png"
            width="15rpx"
            height="30rpx"
          ></u-image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import myInfo from "./components/my-info.vue";
import { memberInfo, certificateQuery } from "@/api/api";
import storage from "../../utils/storage";

export default {
  data() {
    return {
      tabs: [
        {
          key: 1,
          name: "资金明细",
          icon: "/static/images/mine/tab-1.png",
          route: "/pages/funds/index",
        },
        {
          key: 2,
          name: "收款方式",
          icon: "/static/images/mine/tab-2.png",
          route: "/pages/collection/index",
        },
        {
          key: 3,
          name: "地址管理",
          icon: "/static/images/mine/tab-3.png",
          route: "/pages/coinAddress/index",
        },
      ],
      navs: [
        // { key: 1, name: 'USDT钱包', icon: '/static/images/mine/nav-1.png', route: '/pages/usdt/index' },
        {
          key: 2,
          name: "实名认证",
          icon: "/static/images/mine/nav-2.png",
          route: "/pages/identification/index",
        },
        {
          key: 3,
          name: "账户安全",
          icon: "/static/images/mine/nav-3.png",
          route: "/pages/safety/index",
        },
        {
          key: 4,
          name: "帮助中心",
          icon: "/static/images/mine/nav-4.png",
          route: "/pages/helpInfo/index",
        },
        {
          key: 5,
          name: "设置",
          icon: "/static/images/mine/nav-5.png",
          route: "/pages/setting/index",
        },
        { key: 6, name: "当前版本", icon: "/static/images/mine/nav-6.png" },
      ],

      userInfo: {}, // 用户数据
      idenInfo: {}, // 认证状态
    };
  },
  components: {
    myInfo,
  },
  onLoad() {
    this.getUserinfo();
    this.getIdenInfo();
  },
  onShow() {
    this.userInfo = storage.get("userInfo") || {};
    this.idenInfo = storage.get("idenInfo") || {};
  },
  methods: {
    // 获取认证信息
    getIdenInfo() {
      certificateQuery().then((res) => {
        if (res.code == 200) {
          this.idenInfo = res.data || {
            type: 0,
            auditStatus: 0,
          };
          storage.set("idenInfo", this.idenInfo);
        }
      });
    },
    // 获取个人信息
    getUserinfo() {
      this.userInfo = storage.get("userInfo") || {};
      memberInfo().then((res) => {
        this.userInfo = res.data || {};
        storage.set("userInfo", res.data);
        setTimeout(() => {
          if (!res.data.payPasswordStatus) {
            // 未设置支付密码
            uni.reLaunch({
              url: "/pages/setPayPassword/index",
            });
          }
        }, 0);
      });
    },

    // 点击选项
    navClick(item) {
      if (item.route) {
        uni.navigateTo({
          url: item.route,
        });
      }
    },
  },
};
</script>

<style lang="scss">
.page-mine {
  padding-bottom: 100rpx;
  background-color: #fff;
  background: linear-gradient(
    to bottom,
    #0c1114 588rpx,
    #fff 589rpx,
    #fff 100%
  );

  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 60rpx;
    color: #fff;
    font-size: 36rpx;
    background-color: #0c1114;
    position: relative;
    .icon {
      position: absolute;
      right: 40rpx;
    }
    .icon2 {
      right: 130rpx;
    }
  }

  .page-content {
    margin: 0 25rpx;

    .tabs {
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 50rpx;
      font-size: 28rpx;
      color: #5d5d5d;
      margin-top: 60rpx;
      border-bottom: 12rpx solid #f0f0f0;
      .tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        .icon {
          margin-bottom: 20rpx;
        }
      }
    }

    .navs {
      padding: 10rpx 40rpx 0 40rpx;
      background-color: #fff;
      .nav {
        height: 116rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #cecece;
        padding: 0 20rpx 0 30rpx;
        .name {
          font-size: 28rpx;
          color: #343434;
          margin-left: 40rpx;
        }
        .content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 28rpx;
          .version {
            color: #b0adad;
            margin-right: 20rpx;
          }
          .update {
            color: #343434;
            position: relative;
            margin-right: 20rpx;
            &::after {
              content: "";
              width: 8rpx;
              height: 8rpx;
              background-color: #449367;
              border-radius: 50%;
              position: absolute;
              right: -12rpx;
              top: -4rpx;
            }
          }
        }
      }
    }
  }
}
</style>
