<!-- 收款方式-支付宝 -->
<template>
  <view class="info-page-bg self-body page-collection-alipay">
    <u-navbar :safeAreaInsetTop="false" :title="'银行卡'" @leftClick="() => $routers.back()" />

    <view class="info-page-content content-box">
      <view class="item">
        <text>姓名</text>
        <input
          disabled
          class="item-ipt"
          placeholder="请输入银行卡姓名"
          type="text"
          v-model.trim="form.realName"
        />
      </view>

      <view class="item">
        <text>银行卡账号</text>
        <input
          :disabled="form.id && !editing"
          class="item-ipt"
          placeholder="请输入银行卡账号"
          type="text"
          v-model.trim="form.accountName"
        />
      </view>

      <view class="item">
        <text>开户银行</text>
        <input
          class="item-ipt"
          disabled
          placeholder="请选择开户银行"
          type="text"
          v-model.trim="form.bankName"
        />
        <u-image
          class="icon"
          src="/static/images/index/more.png"
          width="16rpx"
          height="9rpx"
        ></u-image>
      </view>

      <view class="item">
        <text>银行分行</text>
        <input
          :disabled="form.id && !editing"
          class="item-ipt"
          placeholder="请输入分行名称"
          type="text"
          v-model.trim="form.branchName"
        />
      </view>

      <view style="height: 240rpx"></view>
    </view>

    <u-button
      v-if="!form.id"
      @click="submit"
      :disabled="
        !(
          form.realName &&
          form.bankName &&
          form.accountName &&
          form.branchName
        ) || loading
      "
      class="info-page-btn btn"
      type="primary"
      text="确定"
    ></u-button>

    <!-- form.id 已经绑定了 -->
    <view class="btns" v-if="form.id">
      <u-button
        v-if="!editing"
        @click="editing = true"
        class="btn2"
        type="primary"
        text="编辑"
      ></u-button>

      <u-button
        v-if="editing"
        @click="editing = false"
        class="btn1"
        type="info"
        text="取消"
      ></u-button>
      <u-button
        v-if="editing"
        @click="submit"
        :disabled="
          !(
            form.realName &&
            form.bankName &&
            form.accountName &&
            form.branchName
          ) || loading
        "
        class="btn2"
        type="primary"
        text="修改"
      ></u-button>
    </view>
  </view>
</template>

<script>
import storage from "@/utils/storage";
import {
  _upload,
  memberPaymodelBind,
  queryByMemberAndPaytype,
} from "@/api/api";

export default {
  name: "collectionBank",
  data() {
    return {
      editing: false,
      loading: false,
      userInfo: {},
      form: {
        payType: 3,
        realName: "", // 真实姓名
        bankName: "", // 银行名称
        accountName: "", // 账号 银行卡是卡号；微信是微信号；支付宝是支付宝账号；云闪付是
        branchName: "", // 支行名称
      },
    };
  },
  onShow() {
    this.userInfo = storage.get("userInfo") || {};
    this.idenInfo = storage.get("idenInfo") || {};
    this.form.realName = this.idenInfo.realName;
    this.getInfo();
  },
  methods: {
    // 获取绑定详情
    getInfo() {
      queryByMemberAndPaytype({
        // memberId: this.userInfo.id,
        payType: this.form.payType,
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.form.id = res.data.id;
          this.form.realName = res.data.realName;
          this.form.bankName = res.data.bankName;
          this.form.accountName = res.data.accountName;
          this.form.branchName = res.data.branchName;
        }
      });
    },
    // 提交
    submit() {
      this.loading = true;
      memberPaymodelBind({
        ...this.form,
        // memberId: this.userInfo.id
      })
        .then((res) => {
          if (res.code == 200) {
            uni.showToast({
              title: "绑定成功",
              icon: "none",
              duration: 2000,
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 500);
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

<style scoped lang="scss">
.page-collection-alipay {
  .content-box {
    .item {
      height: 134rpx;
      border-bottom: 1px solid #cecece;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #454545;
      font-size: 32rpx;
      padding-left: 40rpx;
      .item-ipt {
        flex: 1;
        margin-left: 40rpx;
        font-size: 28rpx;
      }
      .icon {
        margin: 0 40rpx 0 20rpx;
      }
    }
    .upload {
      width: 670rpx;
      height: 218rpx;
      padding: 0 75rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-top: 65rpx;
      color: #454545;
      font-size: 32rpx;
      border-radius: 6rpx;
      border: 1px solid #747474;
      box-sizing: border-box;
      .upload-info {
        margin-left: 74rpx;
      }
    }
    .qrcode {
      width: 670rpx;
      height: 670rpx;
      background-color: #e4e4e4;
      margin-top: 65rpx;
    }
  }
  .btn {
    position: fixed;
    bottom: 60rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 60rpx;
    font-size: 28rpx;
    width: 100%;
    box-sizing: border-box;
    padding: 0 40rpx;
    .btn1 {
      flex: 1;
      height: 96rpx;
      margin-right: 40rpx;
    }
    .btn2 {
      flex: 1;
      height: 96rpx;
      background-color: #449367;
      border-radius: 6rpx;
      color: #fff;
      border: none;
    }
  }
}
</style>
