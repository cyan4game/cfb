<template>
  <view class="first-rest-pwd">
    <u-form :model="form" ref="form" :rules="rules">
      <u-form-item class="item" prop="oldPassWord" borderBottom>
        <view class="item">
          <u-text text="旧密码"></u-text>
          <u-input :type="showPassWord ? 'text' : 'password'" placeholder="请输入旧密码" v-model="form.oldPassWord">
            <template slot="suffix">
              <u-icon @click="showPassWord = !showPassWord" :name="showPassWord ? 'eye-off' : 'eye-fill'" :size="showPassWord ? 22 : 20" color="#787878"></u-icon>
            </template>
          </u-input>
        </view>
      </u-form-item>
      <u-form-item class="item" prop="newPassWord1" borderBottom>
        <view class="item">
          <u-text text="新密码"></u-text>
          <u-input :type="showPassWord1 ? 'text' : 'password'" placeholder="请输入新密码" v-model="form.newPassWord1">
            <template slot="suffix">
              <u-icon @click="showPassWord1 = !showPassWord1" :name="showPassWord1 ? 'eye-off' : 'eye-fill'" :size="showPassWord ? 22 : 20" color="#787878"></u-icon>
            </template>
          </u-input>
        </view>
      </u-form-item>
      <u-form-item class="item" prop="newPassWord2" borderBottom>
        <view class="item">
          <u-text text="确认新密码"></u-text>
          <u-input :type="showPassWord2 ? 'text' : 'password'" placeholder="请输入新密码" v-model="form.newPassWord2">
            <template slot="suffix">
              <u-icon @click="showPassWord2 = !showPassWord2" :name="showPassWord2 ? 'eye-off' : 'eye-fill'" :size="showPassWord ? 22 : 20" color="#787878"></u-icon>
            </template>
          </u-input>
        </view>
      </u-form-item>
      <u-form-item>
        <u-button class="login-button" @click="submit" type="primary" text="确认变更"></u-button>
      </u-form-item>
    </u-form>
    <u-notify ref="uToast"></u-notify>
  </view>
</template>

<script>
import {updateLoginPwd} from "../../api/api";
import {mapActions} from "vuex";

export default {
  data() {
    const rule = [
      {
        required: true,
        message: '此为必填字段',
        trigger: ['blur', 'change'],
      },
      // {
      //   pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$/g,
      //   // 正则检验前先将值转为字符串
      //   transform(value) {
      //     return String(value);
      //   },
      //   message: '必须包含字母和数字',
      //   trigger: ['blur', 'change']
      // },
      {
        min: 6,
        message: '密码至少6位及以上',
        trigger: ['blur', 'change']
      }
    ]
    return {
      showPassWord: false,
      showPassWord1: false,
      showPassWord2: false,
      form: {
        oldPassWord: '',
        newPassWord1: '',
        newPassWord2: ''
      },
      rules: {
        'oldPassWord': rule,
        'newPassWord1': rule,
        'newPassWord2': rule
      }
    }
  },
  methods: {
    ...mapActions('user', ['LOG_OUT']),
    submit() {

      this.$refs.form.validate().then(res => {
        // uni.$u.toast('校验通过')
        if (this.form.newPassWord1 === this.form.newPassWord2) {
          const params = {
            confirmPwd: this.form.newPassWord2,
            newPwd: this.form.newPassWord1,
            oldPwd: this.form.oldPassWord
          }
          updateLoginPwd(params).then(async res => {
            if (res.code.toString() === '0') {
              const {code} = await this.LOG_OUT()
              if (code == 0) {
                this.$refs.uToast.show({type: 'success', message: "登录密码更换成功,请重新登录"})
                setTimeout(() => {
                  this.router({
                    url: 'pages/login/index'
                  })
                }, 1000)

              }
            }
          })

        } else {
          uni.$u.toast('新密码两次输入不一致！')
        }

      }).catch(errors => {
        // uni.$u.toast('校验失败')
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
}
</style>
