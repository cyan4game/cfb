<template>
  <view :class="'password-input password-input-' + border">
    <input
      class="password-input-input"
      :password="!show"
      type="text"
      placeholder="请输入密码"
      v-model="modelValue"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
      @confirm="onConfirm"
      @keyboardheightchange="onkeyboardheightchange"
    />
    <u-icon @click="show = !show" :name="`/static/icons/eye-${show ? 'open' : 'close'}.svg`" size="24"/>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    border: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入密码'
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    modelValue: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit("input", v);
      }
    }
  },
  methods: {
    // 当键盘输入时，触发input事件
    onInput(e) {
      // let { value = "" } = e.detail || {};
      // 格式化过滤方法
      // const formatter = this.formatter || this.innerFormatter
      // const formatValue = formatter(value)
      // 为了避免props的单向数据流特性，需要先将innerValue值设置为当前值，再在$nextTick中重新赋予设置后的值才有效
      // this.innerValue = value
      this.$nextTick(() => {
        // this.innerValue = formatValue;
        this.valueChange();
      })
    },
    // 输入框失去焦点时触发
    onBlur(event) {
      this.$emit("blur", event.detail.value);
      // 尝试调用u-form的验证方法
      uni.$u.formValidate(this, "blur");
    },
    // 输入框聚焦时触发
    onFocus(event) {
      this.focused = true;
      this.$emit("focus");
    },
    // 内容发生变化，进行处理
    valueChange() {
      this.$nextTick(() => {
        this.$emit("input", this.modelValue);
        // 标识value值的变化是由内部引起的
        this.$emit("change", this.modelValue);
        // 尝试调用u-form的验证方法
        uni.$u.formValidate(this, "change");
      });
    },
    // 点击完成按钮时触发
    onConfirm(event) {
      this.$emit("confirm", this.innerValue);
    },
    // 键盘高度发生变化的时候触发此事件
    // 兼容性：微信小程序2.7.0+、App 3.1.0+
    onkeyboardheightchange() {
      this.$emit("keyboardheightchange");
    },
  }
}
</script>

<style lang="scss">
.password-input {
  display: flex;
  padding: 12rpx 18rpx;
  box-sizing: border-box;
  border-radius: 8rpx;

  &-border {
    border: 1px solid #dddddd;
  }

  &-bottom {
    border-bottom: 1px solid #dddddd;
  }

  &-input {
    flex: 1;
    font-size: 30rpx;
  }
}
</style>
