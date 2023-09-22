<template>
  <view class="header-mine flex-box">
    <u-image
      width="60px"
      height="60px"
      src="/static/icons/avatar.svg"
    ></u-image>
    <view class="user-info">
      <view class="flex-box">
        <text class="user-info-name">{{ user && user.username || '' }}</text>
        <view class="flex-box-between user-info-auth-view">
          <view
            @click="pageTo"
            class="user-info-auth flex-box"
            :class="authInfo.status ? 'is-auth' : 'un-auth'"
          >
            {{ authInfo.text }}
          </view>
          <u-image
            width="24px"
            height="24px"
            src="/static/icons/right.svg"
          ></u-image>
        </view>
      </view>
      <!--手机号显示-->
      <view class="flex-box show-mobile" v-if="user && user.mobilePhone">
        <text class="user-label">手机号</text>
        <text class="user-value ml-5 mr-5 uni-flex-item" v-if="user">
          {{ show ? user.mobilePhone : formatPhone(user.mobilePhone) }}
        </text>
        <u-image
          @click="show = !show"
          width="24px"
          height="24px"
          :src="require(`@/static/icons/white-${show ? 'open' : 'close'}.svg`)"
        ></u-image>
      </view>
      <!--邮箱-->
      <view class="flex-box show-mobile" v-if="user && user.email">
        <text class="user-label">邮箱</text>
        <text class="user-value ml-5 mr-5 uni-flex-item" v-if="user">
          {{ show ? user.email : formatEmail(user.email) }}
        </text>
        <u-image
          @click="show = !show"
          width="24px"
          height="24px"
          :src="require(`@/static/icons/white-${show ? 'open' : 'close'}.svg`)"
        ></u-image>
      </view>
    </view>
    <view class="show-total">
      <view class="view-total flex-box-between">
        <view class="view-item" v-for="(item, i) in totalList" :key="i">
          <view class="item-label">{{ item.before }}{{ item.value }}{{ item.after }}</view>
          <text class="item-value">{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import {getOtcOrderInfo} from "@/api/api";

export default {
  data() {
    return {
      show: false,
      totalList: {
        otcOrderCount: {label: "OTC总单量", key: "", value: 0, after: "单"},
        otcOrderAmountSum: {label: "总交易额", key: "", value: 0, before: "￥"},
        otcOrderFinishedRate: {label: "完成率", key: "", value: 0, after: "%"}
      }
    };
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    ...mapState("user", ["identityInfo"]),
    user() {
      return this.userInfo.userInfo || {}
    },
    authInfo() {
      const {senior, real} = this.identityInfo;
      // console.log(this.identityInfo);
      let obj = {};
      if (senior) obj = {text: "高级认证", status: 1};
      else {
        if (real) obj = {text: "基础认证", status: 1};
        else obj = {text: "未认证", status: 0};
      }
      return obj;
    },
  },
  methods: {
    ...mapActions('user', ['GET_USER_INFO']),
    refresh() {
      Promise.all([this.refreshUserInfo(), this.refreshOtcOrderInfo()]).catch(res => {
        uni.stopPullDownRefresh()
      }).catch(_ => {
        console.error(_)
        uni.stopPullDownRefresh()
      }).finally(_ => {
        uni.stopPullDownRefresh()
      })
    },
    refreshUserInfo() {
      return new Promise((resolve, reject) => {
        this.GET_USER_INFO().then(res => {
          if (res.code.toString() === '0') {
            resolve(res)
          } else {
            reject(res)
          }
        }).catch(_ => {
          reject(_)
        })
      })
    },
    refreshOtcOrderInfo() {
      return new Promise((resolve, reject) => {
        getOtcOrderInfo().then(res => {
          if (res.code.toString() === '0') {
            Object.keys(this.totalList).forEach(key => {
              if (this.totalList[key]) this.totalList[key].value = Number(res.data[key]) || 0
            })
            resolve(res)
          } else {
            reject(res)
          }
        }).catch(_ => {
          reject(_)
        })
      })
    },
    formatPhone(phone) {
      return phone.replace(/^(\d{3})\d+(\d{4}$)/, "$1****$2");
    },
    formatEmail(email) {
      return email.replace(/^(\S{3})\S+(@[A-z\d]+\.[A-z\d]+)$/, "$1****$2");
    },
    pageTo() {
      this.router("pages/authentication/index");
    },
  },
};
</script>

<style lang="scss" scoped>
.header-mine {
  padding: 0 10px 56px 30px;
  background: #505bde;
  position: relative;

  .user-info {
    margin-left: 10px;
    flex: 1;

    &-name {
      max-width: 156px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 17px;
      color: #fff;
      margin-right: 20px;
    }

    &-auth-view {
      flex: 1;
      justify-content: flex-end;
    }

    &-auth {
      width: 64px;
      height: 21px;
      font-size: 12px;
      color: #fff;
      justify-content: center;
      border-radius: 5px;
    }

    .is-auth {
      background: #63b72e;
    }

    .un-auth {
      background: #ef3c3c;
    }
  }

  .show-mobile {
    margin-top: 6px;

    .user-label {
      color: #d3d6ff;
      opacity: 0.7;
      font-size: 14px;
      white-space: nowrap;
    }

    .user-value {
      color: #d3d6ff;
      opacity: 0.7;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .show-total {
    padding: 0 10px;
    position: absolute;
    width: 100%;
    left: 0;
    height: 61px;
    bottom: -30px;
    box-sizing: border-box;

    .view-total {
      //width: 100%;
      height: 100%;
      box-sizing: border-box;
      background: #fff;
      box-shadow: 0px 0px 10px #0000003d;
      border-radius: 5px;

      .view-item {
        width: 33.333%;
        text-align: center;

        .item-label {
          font-size: 15px;
          color: #333333;
        }

        .item-value {
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }
}
</style>
