<template>
  <view class="add-form">
    <u-form class="form" :model="form" ref="form" :rules="rules">
      <u-form-item class="form-item-bank-name" prop="bankName" borderBottom>
        <view class="item">
          <u-text color="#505bde" bold text="开户银行"></u-text>
          <u-cell
            :title="form.bankName || '请选择开户银行'"
            :border="false"
            @click="showBankList = true"
            isLink
            :clickable="false"
          ></u-cell>
          <u-picker
            @close="showBankList = false"
            @cancel="showBankList = false"
            @confirm="onSelectBank"
            :show="showBankList"
            title="请选择开户银行"
            :loading="loadingBank"
            confirmColor="#505bde"
            keyName="bankName"
            closeOnClickOverlay
            :columns="bankNameList"
          ></u-picker>
        </view>
      </u-form-item>
      <u-form-item prop="accountName" borderBottom>
        <view class="item">
          <u-text color="#505bde" bold text="银行卡号"></u-text>
          <u-input
            type="number"
            placeholder="请输入您的银行卡号,16-19位数字"
            v-model="form.accountName"
          >
            <!--              <template slot="suffix">-->
            <!--                <u-image @click="showPassWord = !showPassWord" width="24px" height="24px" :src="require(`@/static/icons/eye-${showPassWord?'open':'close'}.svg`)"></u-image>-->
            <!--                &lt;!&ndash;                <u-icon  :name="showPassWord ? 'eye-off' : 'eye-fill'" size="24"></u-icon>&ndash;&gt;-->
            <!--              </template>-->
          </u-input>
        </view>
      </u-form-item>
      <u-form-item prop="password" borderBottom>
        <view class="item">
          <u-text color="#505bde" bold text="支付密码"></u-text>
          <u-code-input
            style="margin: 20rpx auto auto"
            dot
            v-model="form.password"
          ></u-code-input>
        </view>
      </u-form-item>
    </u-form>
    <u-button class="login-button" @click="save" :disabled="isDisabled"
      >确认绑定</u-button
    >
    <custom-modal
      :confirm="handleConfirm"
      isCenter
      title="未实名认证"
      message="请先进行实名认证"
      confirmText="前往认证"
      :show.sync="showTip"
    ></custom-modal>
  </view>
</template>

<script>
import customModal from "@/components/custom-modal/index.vue";
import { queryBankList, savePayModel } from "../../../api/api";

const pwdReg = /^[0-9]{6}$/;
const bank = /^[1-9][0-9]{15,18}/;
export default {
  components: { customModal },
  props: {
    identityInfo: {
      type: Object,
    },
    GET_BANK_LIST: {
      type: Function,
    },
  },
  data() {
    return {
      form: {
        accountName: "",
        bankName: "",
        password: "",
      },
      show: true,
      rules: {
        accountName: [
          {
            required: true,
            message: "此为必填字段",
            // blur和change事件触发检验
            trigger: ["blur", "change"],
          },
          {
            pattern: bank,
            transform(value) {
              return String(value);
            },
            message: "银行卡号为16-19位数字",
            trigger: ["blur", "change"],
          },
        ],
        bankName: [
          {
            required: true,
            message: "此为必填字段",
            // blur和change事件触发检验
            trigger: ["blur"],
          },
        ],
        password: [
          {
            required: true,
            message: "此为必填字段",
            // blur和change事件触发检验
            trigger: ["blur", "change"],
          },
          {
            pattern: pwdReg,
            transform(value) {
              return String(value);
            },
            message: "资金密码为6位数字",
            trigger: ["blur", "change"],
          },
        ],
      },
      showPassWord: false,
      showTip: false,
      loading: false,
      bankNameList: [],
      loadingBank: false,
      showBankList: false,
    };
  },
  computed: {
    isDisabled() {
      const { accountName, bankName, password } = this.form;
      const { loading } = this;
      const isAccount = bank.test(accountName);
      const isBankName = bankName;
      const isPassword = pwdReg.test(password);
      return !(isAccount && isBankName && isPassword && !loading);
    },
  },
  created() {
    this.getBankList();
  },
  methods: {
    onSelectBank({ value }) {
      this.form.bankName = value[0].bankName;
      this.showBankList = false;
    },
    getBankList() {
      this.loadingBank = true;
      uni.showLoading({
        title: "加载中...",
        mask: true,
      });
      queryBankList()
        .then((res) => {
          this.loadingBank = false;
          uni.hideLoading();
          if (res.code.toString() === "0") {
            this.bankNameList = [res.data];
          }
        })
        .catch((_) => {
          console.error(_);
          this.loadingBank = false;
          uni.hideLoading();
        });
    },
    handleConfirm() {
      this.showTip = false;
      uni.navigateTo({
        url: "/pages/authentication/index",
      });
    },
    save() {
      if (this.identityInfo.real) {
        this.$refs.form.validate().then((valid) => {
          const params = {
            ...this.form,
            realName: this.identityInfo.realBO.realName,
          };
          this.loading = true;
          savePayModel(params)
            .then((res) => {
              if (res.code.toString() === "0") {
                this.GET_BANK_LIST();
                this.form = {
                  accountName: "",
                  bankName: "",
                  password: "",
                };
                this.$refs.form.resetFields();
                this.goBack();
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        });
      } else this.showTip = true;
    },
  },
};
</script>

<style lang="scss">
::v-deep .u-cell__body {
  //padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
}

::v-deep .form-item-bank-name .u-form-item__body {
  padding-bottom: 0;
}

.add-form {
  padding: 25px 20px;
  background: #fff;
  flex: 1;

  .item {
    width: 100%;
  }

  .login-button {
    background: #505bde;
    border-color: #505bde;
    box-sizing: border-box;
    color: #fff;
    margin-top: 30px;
  }

  .u-button--disabled {
    background: #cccccc 0% 0% no-repeat padding-box;
    border: none;
    opacity: 1;
  }
}
</style>
