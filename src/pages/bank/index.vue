<template>
  <view class="bank-page flex-box">
    <notice-navbar customer title="支付管理"/>
    <view class="show-user">
      <text class="fs-14">用户名 : {{ userInfo.userInfo.nickname }}</text>
    </view>
    <view class="bank-content">
      <view class="view-box">
        <!--        未绑定银行卡-->
        <view class="un-bind" v-show="loaded && !bankList.length">
          <view class="flex-box un-bind-card">
            <u-image
              width="120px"
              height="120px"
              src="@/static/icons/un-bind.svg"
            ></u-image>
          </view>
          <view class="value un-bind-text">
            还没有绑定银行卡，请先进行绑定银行卡相关信息
          </view>
          <u-button class="to-button" @click="router('pages/addBank/index')">添加银行卡</u-button>
        </view>
        <bankListView
          v-show="bankList.length"
          :getList="GET_BANK_LIST"
          :bankList="bankList"
        />
      </view>
    </view>
  </view>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import bankListView from "./components/bank-list-view";
import noticeNavbar from "@/components/notice-navbar";

export default {
  name: "index",
  components: {noticeNavbar, bankListView},
  data() {
    return {
      loaded: false
    }
  },
  computed: {
    ...mapGetters('user', ['userInfo']),
    ...mapState('user', ['identityInfo', 'bankList']),
    user() {
      return this.userInfo.userInfo || {}
    },
  },
  onShow(options) {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })
    this.GET_IDENTITY_INFO().then(res => {
      if (this.identityInfo.real) {
        uni.showLoading({
          title: '加载中...',
          mask: true
        })

        this.GET_BANK_LIST().then(res => {
          this.loaded = true
          uni.hideLoading()
        }).catch(_ => {
          console.error(_)
          uni.hideLoading()
        })
      } else {
        uni.showModal({
          title: '温馨提示',
          content: '必须先进行实名认证才能绑定银行卡,是否前往实名认证?',
          success: res => {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/authentication/index'
              })
            } else if (res.cancel) {
              this.goBack()
            }
          }
        })
      }
    }).catch(_ => {
      console.error(_)
      uni.hideLoading()
    })
  },
  onPullDownRefresh() {
    this.GET_BANK_LIST().then(res => {
      uni.stopPullDownRefresh()
    }).catch(_ => {
      console.error(_)
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    ...mapActions('user', ['GET_BANK_LIST', 'GET_IDENTITY_INFO']),
  }
};
</script>

<style lang="scss" scoped>
.bank-page {
  min-height: 100%;
  flex-direction: column;

  .show-user {
    background: #fff;
    padding: 15px 16px;
    color: #505bde;
    width: 100%;
    box-sizing: border-box;

    .fs-14 {
      font-size: 14px;
    }
  }

  .bank-content {
    flex: 1;
    width: 100%;
    position: relative;

    .view-box {
      position: absolute;
      width: 100%;
      //height: 100%;
      //left: 0;
      //top: 0;
      //overflow-y: scroll;
      background: #fff;

      .un-bind {
        padding: 30px 20px;

        &-card {
          justify-content: center;
          margin-bottom: 30px;
        }

        &-text {
          text-align: center;
          margin-bottom: 50px;
        }

        .to-button {
          height: 40px;
          background: #505bde;
          border-color: #505bde;
          color: #fff;
          margin-top: 60rpx !important;
        }
      }
    }
  }
}
</style>
