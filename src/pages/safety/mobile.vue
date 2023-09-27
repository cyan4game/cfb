<template>
  <view class="mobile-view">
    <view class="page-box">
      <u-form class="form" :model="form" ref="form">

        <u-form-item v-if="userInfo.phoneNumber && step == 1">
          <view class="item">
            <u-text color="#7A7A7A" text="手机号"></u-text>
            <view style="margin-top: 40rpx;">{{ userInfo.phoneNumber }}</view>
          </view>
        </u-form-item>

        <!-- 验证旧手机 -->
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

        <!-- 绑定新手机 -->
        <template v-if="step == 2">
          <u-form-item prop="email">
            <view class="item">
              <u-text color="#7A7A7A" text="新手机号"></u-text>
              <u-row class="item-content ipt">
                <u-col span="2">
                  <u-text class="item-area" :text="form.areaCode" color="#505bde" suffixIcon="arrow-down"
                    @click="showAreaCode = true" :iconStyle="{
                      fontSize: '14px',
                      color: '#505bde',
                    }"></u-text>
                </u-col>
                <u-col offset="1" span="9">
                  <u-input clearable :type="'number'" placeholder="请输入新手机号" v-model="form.newPhone"></u-input>
                </u-col>
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


    <!-- 区号 -->
    <u-picker @confirm="handleAreaCodeConfirm" @cancel="handleAreaCodeClose" @close="handleAreaCodeClose"
      :closeOnClickOverlay="true" :show="showAreaCode" :columns="areaCode"></u-picker>
  </view>
</template>

<script>
import { AREA_CODE } from "@/config/api";
import storage from '@/utils/storage'
import { phoneBind, sendSMS, phoneOld } from '@/api/api'
import { updatUserInfo } from '@/utils/utils'

const pawReg = /^[0-9]{6}$/
export default {
  name: "index",
  data() {
    return {
      step: 1, // 1-验证旧手机 2-绑定新手机
      userInfo: {},
      loading: false,
      showAreaCode: false,
      areaCode: AREA_CODE,
      form: {
        areaCode: '+86',
        newPhone: '',
        code: ""
      },
      timedown: 0,
      timeInterval: null
    }
  },
  computed: {
    isDisabled() {
      const { loading } = this
      const { areaCode, newPhone, code } = this.form;
      if (loading) return true
      if (this.step == 1) {
        if (this.form.code) return false
        return true
      }
      return !(this.form.areaCode && this.form.newPhone && this.form.code)
    }
  },
  onShow() {
    this.userInfo = storage.get('userInfo') || {}
  },
  mounted() {
    if (this.userInfo.phoneNumber) {
      this.step = 1
    } else {
      this.step = 2
    }
  },
  methods: {
    handleAreaCodeClose() {
      this.showAreaCode = false;
    },
    handleAreaCodeConfirm(e) {
      this.form.areaCode = "+" + e.value[0].split("+")[1];
      this.showAreaCode = false;
    },
    // 发送验证码
    sendCode() {
      if (this.timedown) return
      if (this.loading) eturn
      let form = {
        countryCode: this.userInfo.countryCode || '+86',
        phoneNumber: this.userInfo.phoneNumber
      }
      if (this.step == 2) {
        // 新手机需要验证区号和号码
        if (!this.form.newPhone) return uni.showToast({
          title: '请输入手机号码',
          icon: 'none',
          duration: 2000
        });
        form = {
          countryCode: this.form.areaCode,
          phoneNumber: this.form.newPhone
        }
      }
      this.loading = true
      sendSMS(form).then(res => {
        if (res.code == 200) {
          uni.showToast({
            title: '短信已发送',
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
      // 验证旧手机
      this.loading = true
      if (this.step == 1) {
        phoneOld({
          countryCode: this.userInfo.countryCode || '+86',
          phone: this.userInfo.phoneNumber,
          phoneCode: this.form.code,
          memberId: this.userInfo.id,
        }).then(res => {
          if (res.code == 200) {
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
        phoneBind({
          countryCode: this.form.areaCode,
          phone: this.form.newPhone,
          phoneCode: this.form.code,
          memberId: this.userInfo.id,
        }).then(async res => {
          if (res.code == 200) {
            uni.showToast({
              title: '绑定成功',
              icon: 'none',
              duration: 2000
            })
            await  updatUserInfo()
            uni.navigateBack();
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
  padding-top: 20rpx;
  height: 100%;
  background: #0e1216;
  box-sizing: border-box;
}

.page-box {
  background: #fff;
  border-top-left-radius: 22rpx;
  border-top-right-radius: 22rpx;
  padding: 52rpx 28rpx;
  height: 100%;
}

.ipt {
  background-color: #F1F1F1;
  height: 72rpx;
  border-radius: 6rpx;
  margin-top: 35rpx;
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
