<template>
  <view class="info-page-bg mobile-view">
    <view class="info-page-content page-box">
      <u-form class="form" :model="form" ref="form">

        <u-form-item v-if="userInfo.phoneNumber && step == 1">
          <view class="item">
            <u-text color="#7A7A7A" text="邮箱"></u-text>
            <view style="margin-top: 40rpx;">{{ userInfo.email }}</view>
          </view>
        </u-form-item>

        <!-- 验证旧邮箱 -->
        <template v-if="step == 1">
          <u-form-item prop="code">
            <view class="item">
              <u-text color="#7A7A7A" text="验证码"></u-text>
              <view style="display: flex;align-items: center;">
                <u-input class="ipt" type="number" :type="'text'" placeholder="请输入验证码" v-model="form.code">
                </u-input>
                <view class="code-box" @click="sendCode">{{ timedown ? `${timedown}秒` : '获取验证码' }}</view>
              </view>
            </view>
          </u-form-item>
        </template>

        <!-- 绑定新邮箱 -->
        <template v-if="step == 2">
          <u-form-item prop="email">
            <view class="item">
              <u-text color="#7A7A7A" text="新邮箱"></u-text>
              <u-row class="item-content ipt">
                <u-input clearable :type="'text'" placeholder="请输入新邮箱" v-model="form.email"></u-input>
              </u-row>
            </view>
          </u-form-item>


          <u-form-item prop="code">
            <view class="item">
              <u-text color="#7A7A7A" text="验证码"></u-text>
              <view style="display: flex;align-items: center;">
                <u-input class="ipt" type="number" :type="'text'" placeholder="请输入验证码" v-model="form.code">
                </u-input>
                <view class="code-box" @click="sendCode">{{ timedown ? `${timedown}秒` : '获取验证码' }}</view>
              </view>
            </view>
          </u-form-item>
        </template>


      </u-form>

      <u-button :disabled="isDisabled" class="login-button" @click="toNext" type="primary">
        提交
      </u-button>
    </view>

  </view>
</template>

<script>
import storage from '@/utils/storage'
import { emailBind, sendEmailCode, emailOld } from '@/api/api'
import { updatUserInfo } from '@/utils/utils'

const pawReg = /^[0-9]{6}$/
export default {
  name: "index",
  data() {
    return {
      step: 1, // 1-验证旧邮箱 2-绑定新邮箱
      userInfo: {},
      loading: false,
      form: {
        email: '',
        code: ""
      },
      timedown: 0,
      timeInterval: null
    }
  },
  computed: {
    isDisabled() {
      const { loading } = this
      const { email, code } = this.form;
      if (loading) return true
      if (this.step == 1) {
        if (this.form.code) return false
        return true
      }
      return !(this.form.email && this.form.code)
    }
  },
  onShow() {
    this.userInfo = storage.get('userInfo') || {}
  },
  mounted() {
    if (this.userInfo.email) {
      this.step = 1
    } else {
      this.step = 2
    }
  },
  methods: {
    // 发送验证码
    sendCode() {
      if (this.timedown) return
      if (this.loading) eturn
      let form = {
        email: this.userInfo.email
      }
      if (this.step == 2) {
        // 新邮箱
        if (!this.form.email) return uni.showToast({
          title: '请输入新邮箱',
          icon: 'none',
          duration: 2000
        });
        form = {
          email: this.form.email,
        }
      }
      this.loading = true
      sendEmailCode(form).then(res => {
        if (res.code == 200) {
          uni.showToast({
            title: '邮件已发送',
            icon: 'none',
            duration: 2000
          });
          this.timedown = 59
          this.timeInterval = setInterval(() => {
            this.timedown--
            if (this.timedown == 0) {
              clearInterval(this.timeInterval)
            }
          }, 1000)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    toNext() {
      // 验证旧邮箱
      this.loading = true
      if (this.step == 1) {
        emailOld({
          email: this.userInfo.email,
          emailCode: this.form.code,
        }).then(res => {
          if (res.code == 200) {
            uni.showToast({
              title: '验证成功，请绑定新邮箱',
              icon: 'none',
              duration: 2000
            });
            clearInterval(this.timeInterval)
            this.timedown = 0
            this.form.code = ''
            this.step = 2
          }
        }).finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 1000)
        })
      }
      // 绑定新手机
      if (this.step == 2) {
        this.loading = true
        emailBind({
          email: this.form.email,
          emailCode: this.form.code,
        }).then(async res => {
          if (res.code == 200) {
            uni.showToast({
              title: '绑定成功',
              icon: 'none',
              duration: 2000
            })
            // 手动设置本地缓存
            storage.set('userInfo', {
              ...this.userInfo,
              email: this.form.email,
            })
            // 同步个人信息
            updatUserInfo()
            setTimeout(() => {
              uni.navigateBack();
            }, 500)
          }
        }).finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 1000)
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mobile-view {
}

.page-box {
}

.ipt {
  background-color: #F1F1F1;
  height: 72rpx;
  border-radius: 6rpx;
  margin-top: 35rpx;
  font-size: 28rpx;
}

.code-box {
  height: 74rpx;
  border: 1px solid #7A7A7A;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
  margin-top: 35rpx;

}

.login-button {
  background: #449367;
  border-color: #449367;
  position: fixed;
  bottom: 100rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 451rpx;
  height: 96rpx;
}

.u-button--disabled {
  background: #cccccc 0% 0% no-repeat padding-box;
  border: none;
  opacity: 1;
}

.item {
  width: 100%;
}

.item-content {
  height: 96rpx;
}

.item-area {
  padding-left: 20rpx;
  border-right: 1px solid #848484;
}
</style>
