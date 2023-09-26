<template>
  <view class="first-rest-pwd">
    <view class="page-box">
      <u-form :model="form" ref="form" :rules="rules">
        <u-form-item class="item" prop="oldPassWord">
          <view class="item">
            <u-text text="旧支付密码"></u-text>
            <u-input class="ipt" :type="showPassWord ? 'text' : 'password'" placeholder="请输入支付旧密码"
              v-model="form.oldPassWord">
              <template slot="suffix">
                <u-icon @click="showPassWord = !showPassWord" :name="showPassWord ? 'eye-off' : 'eye-fill'"
                  size="24"></u-icon>
              </template>
            </u-input>
          </view>
        </u-form-item>
        <u-form-item class="item" prop="newPassWord1">
          <view class="item">
            <u-text text="新支付密码"></u-text>
            <u-input class="ipt" :type="showPassWord ? 'text' : 'password'" placeholder="请输入新支付密码"
              v-model="form.newPassWord1">
              <template slot="suffix">
                <u-icon @click="showPassWord = !showPassWord" :name="showPassWord ? 'eye-off' : 'eye-fill'"
                  size="24"></u-icon>
              </template>
            </u-input>
          </view>
        </u-form-item>
        <u-form-item class="item" prop="newPassWord2">
          <view class="item">
            <u-text text="确认新支付密码"></u-text>
            <u-input class="ipt" :type="showPassWord ? 'text' : 'password'" placeholder="请输入新支付密码"
              v-model="form.newPassWord2">
              <template slot="suffix">
                <u-icon @click="showPassWord = !showPassWord" :name="showPassWord ? 'eye-off' : 'eye-fill'"
                  size="24"></u-icon>
              </template>
            </u-input>
          </view>
        </u-form-item>
        <u-form-item>
          <u-button @click="handleNext" class="login-button" type="primary" text="提交"></u-button>
        </u-form-item>
      </u-form>
    </view>

    <!-- 短信验证弹窗 -->
   
  </view>
</template>

<script>
import { updateTxPassword, updateTxPasswordJudge } from "../../api/api";

export default {
  data() {
    const rule = [
      {
        required: true,
        message: '此为必填字段',
        trigger: ['blur', 'change'],
      },
      {
        pattern: /^[0-9]*$/g,
        transform(value) {
          return String(value);
        },
        message: '只能输入数字',
        trigger: ['blur', 'change']
      },
      {
        min: 6,
        max: 6,
        message: '支付密码必须6位',
        trigger: ['blur', 'change']
      }
    ]
    return {
      showPassWord: false,
      code: '',
      form: {
        oldPassWord: '',
        newPassWord1: '',
        newPassWord2: ''
      },
      rules: {
        'oldPassWord': rule,
        'newPassWord1': rule,
        'newPassWord2': rule
      },
    }
  },
  methods: {
    handleNext() {
      this.$refs.form.validate().then(res => {
        if (this.form.newPassWord1 === this.form.newPassWord2) {
          this.submit()
        } else {
          uni.$u.toast('新密码两次输入不一致！')
        }
      }).catch(errors => {
        // uni.$u.toast('校验失败')
      })
    },
    submit() {
      const params = {
        newPwd: this.form.newPassWord1,
        oldPwd: this.form.oldPassWord,
        confirmPwd: this.form.newPassWord2
      }
      // uni.$u.toast('密码修改成功')
    },
  }
}
</script>

<style lang="scss">
.first-rest-pwd {
  padding-top: 20rpx;
  background: #0e1216;
  height: 100%;

  .item {
    width: 100%;
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
}


</style>
