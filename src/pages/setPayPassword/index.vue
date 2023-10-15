<template>
  <view class="info-page-bg self-body mobile-view">
    <u-navbar :safeAreaInsetTop="false" :title="'设置支付密码'" :leftIcon="''"  />
    <view class=" info-page-content  page-box">
      <u-form class="form" :model="form" ref="form" :rules="rules">
        <u-form-item prop="password" class="item">
          <view style="width:100%">
            <u-text color="#535353" text="支付密码 "></u-text>
            <u-input
              class="ipt"
              :type="showPassWord ? 'text' : 'password'"
              placeholder="请输入支付密码,6位数字"
              v-model="form.password"
            >
              <template slot="suffix">
                <u-icon
                  @click="showPassWord = !showPassWord"
                  :name="showPassWord ? 'eye-off' : 'eye-fill'"
                  :size="showPassWord ? 22 : 20" color="#787878"
                ></u-icon>
              </template>
            </u-input>
          </view>
        </u-form-item>
        <u-form-item prop="confirmPassword" class="item">
          <view style="width:100%">
            <u-text color="#535353" text="确认密码"></u-text>
            <u-input
              class="ipt"
              type="number"
              :type="showConfirmPassWord ? 'text' : 'password'"
              placeholder="请确认支付密码"
              v-model="form.confirmPassword"
            >
              <template slot="suffix">
                <u-icon
                  @click="showConfirmPassWord = !showConfirmPassWord"
                  :name="showConfirmPassWord ? 'eye-off' : 'eye-fill'"
                  :size="showPassWord ? 22 : 20" color="#787878"
                ></u-icon>
              </template>
            </u-input>
          </view>
        </u-form-item>
      </u-form>

      <u-button
        :disabled="isDisabled"
        class="login-button"
        @click="toNext"
        type="primary"
      >
        确认
      </u-button>
    </view>
  </view>
</template>

<script>
import { paypasswordSet } from "../../api/api";
import { updatUserInfo } from '@/utils/utils'

const pawReg = /^[0-9]{6}$/;
export default {
  name: "index",
  data() {
    return {
      showPassWord: false,
      showConfirmPassWord: false,
      loading: false,
      form: {
        password: "",
        confirmPassword: "",
      },
      rules: {
        password: [
          {
            required: true,
            message: "此为必填字段",
            trigger: ["blur", "change"],
          },
          {
            pattern: pawReg,
            message: "限制6位数字",
            trigger: ["blur", "change"],
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: "此为必填字段",
            trigger: ["blur", "change"],
          },
          {
            pattern: pawReg,
            message: "限制6位数字,并且密码保持一致",
            trigger: ["blur", "change"],
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return value === this.form.password;
            },
            message: "密码请保持一致",
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  computed: {
    isDisabled() {
      const { loading } = this;
      const { password, confirmPassword } = this.form;
      if (
        pawReg.test(password) &&
        pawReg.test(confirmPassword) &&
        password === confirmPassword &&
        !loading
      )
        return false;
      else return true;
    },
  },
  methods: {
    toNext() {
      this.loading = true;
      const {
        form: { password, confirmPassword },
      } = this;
      const params = {
        payPassword: password,
      };
      paypasswordSet(params)
        .then((res) => {
          if (res.code == 200) {
            uni.showToast({
              title: "设置成功",
              icon: "none",
              duration: 2000,
            });
            updatUserInfo()
            setTimeout(() => {
              uni.switchTab({
                url: "/pages/index/index",
              });
            }, 1000);
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.mobile-view {
}
.form {
  margin-top: -8rpx;
}
.page-box {
  padding-top: 32rpx;
}

.ipt {
  background-color: #f1f1f1;
  height: 72rpx;
  border-radius: 6rpx;
  margin-top: 35rpx;
  font-size: 28rpx;
}

.login-button {
  background: #449367;
  border-color: #449367;
  position: fixed;
  bottom: 100rpx;
  left: 50%;
  font-size: 30rpx;
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
  ::v-deep .u-form-item__body__right__message {
    margin-left: 0!important;
  }
}
</style>
