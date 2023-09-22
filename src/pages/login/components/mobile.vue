<template>
  <view class="mobile-view">
    <u-form class="form" :model="form" ref="form" :rules="{}">
      <u-form-item prop="phone" borderBottom :rule="rules.phone">
        <view class="item">
          <u-text color="#505bde" text="手机号码"></u-text>
          <u-row>
            <u-col span="2">
              <u-text
                :text="form.areaCode"
                color="#505bde"
                suffixIcon="arrow-down"
                @click="showAreaCode = true"
                :iconStyle="{ fontSize: '14px', color: '#505bde' }"
              ></u-text>
            </u-col>
            <u-col span="10">
              <u-input
                clearable
                type="number"
                placeholder="请输入手机号码"
                v-model="form.phone"
              ></u-input>
            </u-col>
          </u-row>
        </view>
      </u-form-item>
      <u-form-item
        v-if="hasPassword"
        prop="password"
        borderBottom
        :rule="rules.password"
      >
        <view class="item">
          <u-text color="#505bde" text="密码"></u-text>
          <password-input v-model="form.password"></password-input>
        </view>
      </u-form-item>
      <slot :form="form" :isDisabled="isDisabled"></slot>
    </u-form>
    <u-picker
      @confirm="handleAreaCodeConfirm"
      @cancel="handleAreaCodeClose"
      @close="handleAreaCodeClose"
      :closeOnClickOverlay="true"
      :show="showAreaCode"
      :columns="areaCode"
    ></u-picker>
    <u-notify ref="uNotify"></u-notify>
  </view>
</template>

<script>
import { AREA_CODE } from "../../../config/api";
import PasswordInput from "../../../components/password-input/password-input";

export default {
  components: {
    PasswordInput,
  },
  props: {
    hasPassword: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showAreaCode: false,
      areaCode: AREA_CODE,
      form: {
        phone: "",
        password: "",
        areaCode: "+86",
      },
      rules: {
        phone: [
          {
            required: true,
            message: "此为必填字段",
            // blur和change事件触发检验
            trigger: ["blur", "change"],
          },
          {
            pattern: /^[0-9]*$/g,
            transform(value) {
              return String(value);
            },
            message: "只能包含数字",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          {
            required: true,
            message: "此为必填字段",
            trigger: ["blur", "change"],
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
          // {
          //   min: 8,
          //   message: '密码至少8位及以上',
          //   trigger: ['blur', 'change']
          // }
        ],
      },
    };
  },
  computed: {
    isDisabled() {
      let phoneReg = /^\d*$/g;
      let { phone, password, areaCode } = this.form;
      password = this.hasPassword ? password : true;
      return !(phone && password && areaCode && phoneReg.test(phone));
    },
  },
  onLoad(option) {
    const { type, account } = option;
    if (type === "mobile" && account) {
      this.form.phone = account;
    }
  },
  created() {
    const env = process.env.NODE_ENV;
    if (env === "development") {
      this.form = {
        phone: "18312345678",
        password: "Ab123456",
        areaCode: "+86",
      };
    }
  },
  methods: {
    handleAreaCodeClose() {
      this.showAreaCode = false;
    },
    handleAreaCodeConfirm(e) {
      console.log(e);
      this.form.areaCode = "+" + e.value[0].split("+")[1];
      this.showAreaCode = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
}

.mobile-view {
  margin: 20px 0 30px;
}
</style>
