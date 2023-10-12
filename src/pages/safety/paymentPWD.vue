<template>
  <view class="info-page-bg self-body first-rest-pwd">
    <u-navbar :safeAreaInsetTop="false" :title="'变更支付密码'" @leftClick="() => $routers.back()" />
    <view class="info-page-content page-box">
      <u-form :model="form" ref="form" :rules="rules">
        <u-form-item class="item" prop="oldPassWord">
          <view class="item">
            <u-text text="旧支付密码"></u-text>
            <u-input class="ipt" :type="showPassWord ? 'text' : 'password'" placeholder="请输入支付旧密码"
              v-model="form.oldPassWord">
              <template slot="suffix">
                <u-icon @click="showPassWord = !showPassWord" :name="showPassWord ? 'eye-off' : 'eye-fill'"
                :size="showPassWord ? 22 : 20" color="#787878"></u-icon>
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
                :size="showPassWord ? 22 : 20" color="#787878"></u-icon>
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
                <u-icon  @click="showPassWord = !showPassWord" :name="showPassWord ? 'eye-off' : 'eye-fill'"
                  :size="showPassWord ? 22 : 20" color="#787878"></u-icon>
              </template>
            </u-input>
          </view>
        </u-form-item>
        <u-form-item>
          <u-button :disabled="isDisabled" @click="handleNext" class="login-button" type="primary" text="提交"></u-button>
        </u-form-item>
      </u-form>
    </view>

    <!-- 验证弹窗 -->
    <verify-dialog ref="vd" @success="successHandle" />
  </view>
</template>

<script>
import { paypasswordModify } from "@/api/api";

const pawReg = /^[0-9]{6}$/
export default {
  data() {
    const rule = [
      {
        required: true,
        message: '此为必填字段',
        trigger: ['blur', 'change'],
      },
      {
        pattern: pawReg,
        transform(value) {
          return String(value);
        },
        message: '支付密码必须6位数字',
        trigger: ['blur', 'change']
      },
    ]
    return {
      loading: false,
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
        'newPassWord2': [...rule, {
          // 自定义验证函数，见上说明
          validator: (rule, value, callback) => {
            // 上面有说，返回true表示校验通过，返回false表示不通过
            // uni.$u.test.mobile()就是返回true或者false的
            return value === this.form.newPassWord1
          },
          message: '密码请保持一致',
          // 触发器可以同时用blur和change
          trigger: ['change', 'blur'],
        }]
      },
    }
  },
  computed: {
    isDisabled() {
      const { loading } = this
      const { oldPassWord, newPassWord1, newPassWord2 } = this.form;
      if (oldPassWord && pawReg.test(newPassWord1) && pawReg.test(newPassWord2) && newPassWord1 === newPassWord2 && !loading) return false
      else return true
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
      this.$refs.vd.open()
    },
    successHandle(codes) {
      const params = {
        payPassword: this.form.newPassWord1,
        oldPayPassword: this.form.oldPassWord,
        ...codes,
      }
      paypasswordModify(params).then(res => {
        if (res.code == 200) {
          uni.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1000)
        }
      }).finally(() => {
        setTimeout(() => {
          this.loading = false
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss">
.first-rest-pwd {

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


  .ipt {
    background-color: #F1F1F1;
    height: 72rpx;
    border-radius: 6rpx;
    margin-top: 35rpx;
    font-size: 28rpx;
  }
}
</style>
