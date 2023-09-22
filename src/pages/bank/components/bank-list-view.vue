<template>
  <view class="bank-list">
    <view class="bank-list-item" v-for="(item, index) in bankList" :key="index">
      <view class="list-header flex-box-between">
        <view class="flex-box">
          <u-image
            width="24px"
            height="24px"
            src="@/static/icons/bank.svg"
          ></u-image>
          <text class="label ml-5">{{ item.bankName }}</text>
        </view>
        <u-image
          @click="editBank(item)"
          width="24px"
          height="24px"
          src="@/static/icons/more.svg"
        ></u-image>
      </view>
      <view class="list-content">
        <view class="label mb-10">{{ item.realName }}</view>
        <view class="flex-box-between">
          <text class="value">{{ item.accountName }}</text>
          <text class="default-card" v-show="item.status === '2'">默认卡</text>
        </view>
      </view>
    </view>
    <view class="to-button-box">
      <u-button class="to-button" @click="toAdd">
        添加银行卡
      </u-button>
    </view>
    <u-popup :show="show" closeOnClickOverlay @close="show = false">
      <view class="view-edit">
        <view class="edit-title">操作</view>
        <view class="edit-content">
          <u-button class="edit-content-btn" style="margin-top: 0" color="#505bde" @click="setDefault">设为默认</u-button>
          <u-button class="edit-content-btn" color="#ef3c3c" @click="deleteList">删除此卡</u-button>
          <u-button class="edit-content-btn" @click="show = false">取消</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {updateDefaultPayModel, deletePayModel} from "../../../api/api";

export default {
  name: "bank-list",
  props: {
    bankList: {
      type: Array,
      required: true,
    },
    getList: {
      type: Function,
    },
  },

  data() {
    return {
      bankInfo: {},
      show: false,
    };
  },
  methods: {
    toAdd() {
      uni.navigateTo({
        url: '/pages/addBank/index'
      })
    },
    editBank(item) {
      this.show = true;
      this.bankInfo = item;
    },
    // 设置为默认银行卡
    setDefault() {
      updateDefaultPayModel({id: this.bankInfo.id}).then((res) => {
        if (res.code.toString() === '0') {
          this.getList();
        }
      });
      this.show = false;
    },
    deleteList() {
      deletePayModel({id: this.bankInfo.id}).then((res) => {
        if (res.code.toString() === '0') {
          this.getList();
        }
      });
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.bank-list {
  background: #f8f8f8;
  padding: 10px 10px 120rpx;
  height: 100%;
  box-sizing: border-box;

  &-item {
    padding: 0 10px;
    margin-bottom: 10px;
    background: #fff;
    border-radius: 5px;
  }

  .list-header {
    border-bottom: 1px solid #f8f8f8;
    padding: 16px 0;
  }

  .list-content {
    padding: 16px 0;

    .default-card {
      font-size: 14px;
      color: #505bde;
    }
  }
}

.view-edit {
  background: #fff;

  .edit-title {
    color: #fff;
    padding: 28rpx 0;
    background: #505bde;
    font-size: 32rpx;
    line-height: 32rpx;
    height: 32rpx;
    text-align: center;
    box-sizing: content-box;
  }

  .edit-content {
    padding: 40rpx;
    text-align: center;

    &-btn {
      margin-top: 40rpx;
    }
  }
}

.to-button-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  //background-color: #FFFFFF;
  background-color: #f8f8f8;
  padding: 20rpx;
  box-sizing: border-box;
}

.to-button {
  height: 80rpx;
  background: #505bde;
  border-color: #505bde;
  color: #fff;
}
</style>
