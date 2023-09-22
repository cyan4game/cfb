<template>
  <view class="first-rest-pwd">
    <u-form v-if="status === 0" :model="form" ref="form" :rules="rules">
      <u-form-item v-if="isVisible" class="item" prop="oldPassWord" borderBottom>
        <view class="item">
          <u-text text="旧支付密码"></u-text>
          <u-input :type="showPassWord ? 'text' : 'password'" placeholder="请输入支付旧密码" v-model="form.oldPassWord">
            <template slot="suffix">
              <u-icon @click="showPassWord = !showPassWord" :name="showPassWord ? 'eye-off' : 'eye-fill'" size="24"></u-icon>
            </template>
          </u-input>
        </view>
      </u-form-item>
      <u-form-item class="item" prop="newPassWord1" borderBottom>
        <view class="item">
          <u-text text="新支付密码"></u-text>
          <u-input :type="showPassWord ? 'text' : 'password'" placeholder="请输入新支付密码" v-model="form.newPassWord1">
            <template slot="suffix">
              <u-icon @click="showPassWord = !showPassWord" :name="showPassWord ? 'eye-off' : 'eye-fill'" size="24"></u-icon>
            </template>
          </u-input>
        </view>
      </u-form-item>
      <u-form-item class="item" prop="newPassWord2" borderBottom>
        <view class="item">
          <u-text text="确认新支付密码"></u-text>
          <u-input :type="showPassWord ? 'text' : 'password'" placeholder="请输入新支付密码" v-model="form.newPassWord2">
            <template slot="suffix">
              <u-icon @click="showPassWord = !showPassWord" :name="showPassWord ? 'eye-off' : 'eye-fill'" size="24"></u-icon>
            </template>
          </u-input>
        </view>
      </u-form-item>
      <u-form-item>
        <u-button @click="handleNext" class="login-button" type="primary" text="提交"></u-button>
      </u-form-item>
    </u-form>
    <!--    <view v-else-if="status === 1">-->
    <!--      <u&#45;&#45;text margin="0 0 20px 0" text="请输入Google验证码"></u&#45;&#45;text>-->
    <!--      <u-code-input v-model="code" :maxlength="6"></u-code-input>-->
    <!--      <u-button @click="submit" class="btn" type="primary" text="提交"></u-button>-->
    <!--    </view>-->
  </view>
</template>

<script>
import {updateTxPassword, updateTxPasswordJudge} from "../../api/api";

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
      status: 0,
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
      isVisible: false
    }
  },
  created() {
    this.getVisible()
  },
  methods: {
    handleNext() {
      this.$refs.form.validate().then(res => {
        // uni.$u.toast('校验通过')
        if (this.form.newPassWord1 === this.form.newPassWord2) {
          // uni.$u.route({
          //   url: 'pages/login/firstSetPaymentPWD'
          // })
          // this.status = 1
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
      updateTxPassword(params).then(res => {
        if (res.code.toString() === '0') {
          uni.$u.toast('密码修改成功')
          uni.navigateBack()
        }
      })
    },
    getVisible() {
      updateTxPasswordJudge().then(res => {
        if (res.code.toString() === '0') {
          this.isVisible = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss">
.first-rest-pwd {
  padding: 20px;

  .item {
    width: 100%;
  }

  .btn {
    margin-top: 20px;
  }
}
</style>
