<template>
  <u-overlay class="custom-modal flex-box" :show="show">
    <view class="modal-content">
      <view class="modal-title">{{ title }}</view>
      <view class="view-content">
        <slot name="append"></slot>
        <view
          class="view-message"
          :class="{ 'is-center': isCenter }"
          v-show="message"
        >
          {{ message }}
        </view>
        <slot name="suffix"></slot>
        <view class="flex-box-between view-footer">
          <u-button
            v-show="showCancelButton"
            class="modal-button cancel-button uni-flex-item"
            @click="handleCancel"
          >
            {{ cancelText }}
          </u-button>
          <u-button
            :disabled="isDisabled"
            class="confirm-button uni-flex-item"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </u-button>
        </view>
      </view>
    </view>
  </u-overlay>
</template>

<script>
export default {
  name: "index",

  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "title",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    confirmText: {
      type: String,
      default: "确认",
    },
    message: {
      type: String,
      default: "请先完成后方能进行下一笔购买订单。",
    },
    // 是否显示取消按钮
    showCancelButton: {
      type: Boolean,
      default: true,
    },
    cancel: {
      type: Function,
    },
    confirm: {
      type: Function,
    },
    isCenter: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    beforeClose: {
      type: Function,
    },
  },
  methods: {
    handleCancel() {
      if (this.cancel) {
        this.cancel();
      } else {
        if (this.beforeClose) {
          this.beforeClose();
        } else {
          this.$emit("update:show", false);
        }
      }
    },
    handleConfirm() {
      if (this.confirm) {
        this.confirm();
      } else {
        if (this.beforeClose) {
          this.beforeClose();
        } else {
          this.$emit("update:show", false);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-modal {
  justify-content: center;
  padding: 0 25px;

  .modal-content {
    width: 100%;
    box-sizing: border-box;
  }

  .modal-title {
    padding: 13px;
    font-size: 17px;
    background: #505bde;
    color: #fff;
    border-radius: 5px 5px 0px 0px;
    text-align: center;
  }

  .view-content {
    background: #fff;
    padding: 16px 16px 56px;
    position: relative;
    border-radius: 0px 0px 5px 5px;
    min-height: 150px;
    box-sizing: border-box;

    .view-message {
      font-size: 15px;
      color: #333;
    }

    .view-footer {
      position: absolute;
      bottom: 16px;
      width: 100%;
      left: 0;
      padding: 0 16px;
      box-sizing: border-box;
    }

    .modal-button {
      width: 140px;
    }

    .cancel-button {
      color: #505bde;
      margin-right: 13px;
      border: 1px solid #5057e6;
    }

    .confirm-button {
      flex: 1;
      background: #505bde;
      border-color: #505bde;
      color: #fff;
    }

    .u-button--disabled {
      background: #cccccc 0% 0% no-repeat padding-box;
      border: none;
      opacity: 1;
    }

    .is-center {
      text-align: center;
    }
  }
}
</style>
