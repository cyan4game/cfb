<template>
  <view class="bank-view-popup">
    <view class="flex-box-between bank-title">
      <view></view>
      <text class="popup-title">选择银行卡</text>
      <u-image
        @click="handleAreaCodeClose"
        width="24px"
        height="24px"
        src="/static/icons/close.svg"
      ></u-image>
    </view>
    <view class="content-view">
      <view
        @click="changeBank(i)"
        class="flex-box bank-list"
        :class="{ 'bank-list-active': i === index }"
        v-for="(item, i) in bankList"
        :key="i"
      >
        <view class="bank-label">{{ item.realName }}</view>
        <view class="bank-label bank-name">{{ item.bankName }}</view>
        <view class="bank-value">{{ item.accountName }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "bank-view",
  props: {
    bankList: {
      type: Array,
      required: true,
    },
    handleAreaCodeClose: {
      type: Function,
    },
    index: {
      type: Number,
    },
  },
  methods: {
    changeBank(item) {
      this.$emit("update:index", item);
      this.handleAreaCodeClose();
    },
  },
};
</script>

<style lang="scss" scoped>
.bank-view-popup {
  min-height: 300px;
  background: #f8f8f8;
  .bank-title {
    color: #fff;
    padding: 13px 16px;
    background: #505bde;
    .popup-title {
      font-size: 17px;
    }
  }
  .content-view {
    background: #f8f8f8;
    padding: 10px;
    .bank-list {
      background: #fff;
      padding: 13px 16px;
      margin-bottom: 5px;
      box-sizing: border-box;
      &-active {
        border: 1px solid #505bde;
        border-radius: 5px;
      }
      .bank-label {
        font-size: 14px;
        color: #333;
      }
      .bank-name {
        margin: 0 5px;
      }
      .bank-value {
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style>
