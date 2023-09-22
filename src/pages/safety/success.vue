<template>
  <view class="page">
    <u-navbar
      style="width: 100%"
      title="完成"
      bgColor="#505bde"
      leftIcon=""
      titleStyle="color:#ffffff;"
      :fixed="false"
      rightIcon=""
    ></u-navbar>
    <u-icon class="page-icon" size="120rpx" name="/static/icons/icon-transfer-success.svg"></u-icon>
    <template v-if="type === 'retrievePassword'">
      <text class="page-label">变更成功</text>
      <text class="page-content">您的密码变更成功</text>
      <u-button class="page-btn" color="#505bde" text="重新登陆" @click="toLogin"></u-button>
    </template>
    <template v-else>
      <text class="page-label">设置成功</text>
      <text class="page-content">您的 {{ actionName }} 设置成功</text>
      <u-button class="page-btn" color="#505bde" text="返回" @click="toBack"></u-button>
    </template>
  </view>
</template>

<script>
export default {
  name: "success",
  data() {
    return {
      actionName: '',
      type: '',
    }
  },
  watch: {
    type() {
      switch (this.type) {
        case 'email':
          this.actionName = '邮箱'
          break
        case 'phone':
          this.actionName = '手机号'
          break
        case 'login':
          this.actionName = '登陆密码'
          break
        case 'pay':
          this.actionName = '支付密码'
          break
        case 'google':
          this.actionName = 'Google验证码'
          break
      }
    }
  },
  onLoad(query) {
    this.type = query.type
  },
  methods: {
    toBack() {
      uni.switchTab({
        url: '/pages/mine/index'
      })
    },
    toLogin() {
      uni.reLaunch({
        url: '/pages/login/index'
      })
    }
  }
}
</script>

<style lang="scss">
.page {
  min-height: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  &-icon {
    margin-top: 32rpx;
  }

  &-label {
    margin-top: 40rpx;
    font-size: 34rpx;
    color: #63b72e;
    font-weight: bold;
  }

  &-content {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #999999;
  }

  &-btn {
    margin-top: 60rpx;
    width: 670rpx;
  }
}
</style>
