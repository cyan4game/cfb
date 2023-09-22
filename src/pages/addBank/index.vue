<template>
  <view class="bank-view">
    <notice-navbar customer title="添加银行卡"/>
    <view class="show-user">
      <text class="fs-14">用户名 : {{ userInfo.userInfo.nickname }}</text>
    </view>
    <view class="show-real-name">
      <view class="label mb-10">证件姓名 (同实名认证姓名)</view>
      <view class="value" v-if="identityInfo.real">
        {{ identityInfo.realBO.realName }}
      </view>
      <view v-else class="un-real error">未实名认证</view>
    </view>
    <addForm :identityInfo="identityInfo" :GET_BANK_LIST="GET_BANK_LIST" />
  </view>
</template>

<script>
import noticeNavbar from "@/components/notice-navbar";
import { mapActions, mapGetters, mapState } from "vuex";
import addForm from "./components/add-form";
export default {
  name: "index",
  components: { noticeNavbar, addForm },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    ...mapState("user", ["identityInfo"]),
  },
  created() {
    this.GET_IDENTITY_INFO()
  },
  onPullDownRefresh() {
    this.GET_IDENTITY_INFO().then(res => {
      uni.stopPullDownRefresh()
    }).catch(_ => {
      console.error(_)
      uni.stopPullDownRefresh()
    })
  },
  onShow(options) {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })
    this.GET_IDENTITY_INFO().then(res => {
      uni.hideLoading()
      if (this.identityInfo.real) {
        // uni.showLoading({
        //   title: '加载中...',
        //   mask: true
        // })

        // this.GET_BANK_LIST().then(res => {
        //   this.loaded = true
        //   uni.hideLoading()
        // }).catch(_ => {
        //   console.error(_)
        //   uni.hideLoading()
        // })
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
  methods: {
    ...mapActions('user', ['GET_IDENTITY_INFO', 'GET_BANK_LIST'])
  }
};
</script>

<style lang="scss" scoped>
.bank-view {
  min-height: 100%;
  flex-direction: column;
  //overflow-y: scroll;
  display: flex;

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
  .show-real-name {
    margin: 6px 0;
    padding: 20px;
    background: #fff;
  }
  .un-real {
    font-size: 14px;
  }
}
</style>
