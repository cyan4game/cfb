<template>
  <view class="auth-view">
    <noticeNavbar title="基础认证">
      <template #left>
        <u-image
          src="/static/icons/back.svg"
          width="24px"
          height="24px"
        ></u-image>
      </template>
      <template #right>
        <u-image @click="pageTo('pages/customer/index')"
                 src="/static/icons/customer.svg"
                 width="24px"
                 height="24px"
        ></u-image>
      </template>
    </noticeNavbar>
    <view class="show-name flex-box">
      <text>用户名 :</text>
      <text>{{ user.username }}</text>
    </view>
    <view class="base-content">
      <u-form class="form" :model="form" ref="form" :rules="rules">
        <u-form-item prop="realName" borderBottom>
          <view class="item">
            <u-text color="#505bde" text="证件姓名"></u-text>
            <u-input placeholder="请输入您的证件姓名，限制2-6汉字" v-model="form.realName">
              <!--              <template slot="suffix">-->
              <!--                <u-image @click="showPassWord = !showPassWord" width="24px" height="24px" :src="require(`@/static/icons/eye-${showPassWord?'open':'close'}.svg`)"></u-image>-->
              <!--                &lt;!&ndash;                <u-icon  :name="showPassWord ? 'eye-off' : 'eye-fill'" size="24"></u-icon>&ndash;&gt;-->
              <!--              </template>-->
            </u-input>
          </view>
        </u-form-item>
        <u-form-item prop="idNumber" borderBottom>
          <view class="item">
            <u-text color="#505bde" text="身份证号"></u-text>
            <u-input placeholder="请输入您的身份证号" v-model="form.idNumber">
              <!--              <template slot="suffix">-->
              <!--                <u-image @click="showPassWord = !showPassWord" width="24px" height="24px" :src="require(`@/static/icons/eye-${showPassWord?'open':'close'}.svg`)"></u-image>-->
              <!--                &lt;!&ndash;                <u-icon  :name="showPassWord ? 'eye-off' : 'eye-fill'" size="24"></u-icon>&ndash;&gt;-->
              <!--              </template>-->
            </u-input>
          </view>
        </u-form-item>

      </u-form>
      <p class="tips-bottom">完成实名认证方可进行otc与转帐交易</p>
      <u-button style="margin-top: 10px;" class="login-button" @click="submit" :disabled="isDisabled">确认绑定</u-button>
    </view>
  </view>
</template>

<script>
import noticeNavbar from "@/components/notice-navbar/index";
import {mapActions, mapGetters, mapState} from "vuex";
import {realIdentity} from "../../api/api";

let realNameReg = /^[\u4e00-\u9fa5]{2,6}$/
let idNumberReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
export default {
  name: "baseAuth",
  components: {noticeNavbar},
  data() {
    return {
      form: {
        idNumber: "",
        realName: ""
      },
      rules: {
        realName: [
          {
            required: true,
            pattern: realNameReg,
            message: '真实姓名为2-6位中文',
            trigger: ['blur', 'change']
          },
        ],
        idNumber: [
          {
            required: true,
            pattern: idNumberReg,
            message: '请输入正确格式身份证号',
            trigger: ['blur', 'change']
          },
        ]
      }
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    ...mapState("user", ["identityInfo"]),
    user() {
      return this.userInfo.userInfo || {}
    },
    isDisabled() {
      const {idNumber, realName} = this.form;
      return !realNameReg.test(realName) || !idNumberReg.test(idNumber)
    }
  },
  methods: {
    ...mapActions('user', ['GET_IDENTITY_INFO', 'GET_USER_INFO']),
    submit() {
      const params = {...this.form};
      realIdentity(params).then(res => {
        if (res.code.toString() === '0') {
          Promise.all([this.GET_IDENTITY_INFO(), this.GET_USER_INFO()]).then(res => {
            this.router({type: "back"})
          })
        }

      })
    },
    pageTo(url) {
      this.router(url)
    }

  }
};
</script>

<style lang="scss" scoped>
@import "style";
</style>
