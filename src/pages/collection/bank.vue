<!-- 收款方式-支付宝 -->
<template>
  <view class="info-page-bg self-body page-collection-alipay">
    <u-navbar
      :safeAreaInsetTop="false"
      :title="'银行卡'"
      @leftClick="() => $routers.back()"
    />

    <view class="info-page-content content-box">
      <view class="item">
        <text class="subtitle">姓名</text>
        <input
          
          class="item-ipt"
          placeholder="请输入银行卡姓名"
          type="text"
          v-model.trim="form.idName"
        />
      </view>

      <view class="item">
        <text class="subtitle">银行卡账号</text>
        <input
          :disabled="form.id && !editing"
          class="item-ipt"
          placeholder="请输入银行卡账号"
          type="text"
          v-model.trim="form.accountName"
        />
      </view>

      <view class="item">
        <text class="subtitle">开户银行</text>
        <view class="item-ipt" v-if="form.id && !editing">{{ form.bankName }}</view>
        <picker v-else class="item-ipt" @change="bindPickerChange" :range-key="'name'" :value="bankIndex" :range="bankList">
						<view>{{ form.bankName || '请选择开户银行'}}</view>
					</picker>
        <u-image
          class="icon"
          src="/static/images/index/more.png"
          width="16rpx"
          height="9rpx"
        ></u-image>
      </view>

      <view class="item">
        <text class="subtitle">银行分行</text>
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
          form.idName &&
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
            form.idName &&
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
import { _upload, memberPayModelUpdate, queryPayBindInfo, bankList } from "@/api/api";

export default {
  name: "collectionBank",
  data() {
    return {
      editing: false,
      loading: false,
      userInfo: {},
      form: {
        payType: 3,
        idName: "", // 真实姓名
        bankName: "", // 银行名称
        accountName: "", // 账号 银行卡是卡号；微信是微信号；支付宝是支付宝账号；云闪付是
        branchName: "", // 支行名称
      },
      bankList: [], // 银行列表
      bankIndex: '',
    };
  },
  onShow() {
    this.userInfo = storage.get("userInfo") || {};
    this.idenInfo = storage.get("idenInfo") || {};
    this.form.idName = this.idenInfo.idName;
    this.getInfo();
  },
  onLoad() {
    this.getBankList()
  },
  methods: {
    bindPickerChange(e) {
      const i = e.target.value
      this.bankIndex = i
      this.form.bankName = this.bankList[i].name
    },
    // 获取银行列表
    getBankList() {
      bankList().then(res => {
        console.error('银行', res)
        if (res.code == 200) {
          this.bankList = res.data || []
          if (this.form.bankName) {
            this.bankIndex = this.bankList.findIndex(item => item.name == this.form.bankName)
          }
        }
      })
    },
    // 获取绑定详情
    getInfo() {
      uni.showLoading({
        title: "",
        mask: true,
      });
      queryPayBindInfo()
        .then((res) => {
          if (res.code == 200 && res.data) {
            const target = res.data.find(
              (item) => item.payType == this.form.payType
            );
            if (target) {
              this.form.id = target.id;
              this.form.idName = target.username;
              this.form.accountName = target.account;
              this.form.branchName = target.branchBankName;
              this.form.bankName = target.bankName;
              if (this.bankList.length) {
              this.bankIndex = this.bankList.findIndex(item => item.name == this.form.bankName)
            }
            }
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    // 提交
    submit() {
      this.loading = true;
      memberPayModelUpdate({
        ...this.form,
        id: this.form.id || null,
        account: this.form.accountName,
        username: this.form.idName,
        payType: this.form.payType,
        branchBankName: this.form.branchName,
        bankName: this.form.bankName,
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
      .subtitle {
        width: 160rpx;
      }
      .item-ipt {
        flex: 1;
        margin-left: 40rpx;
        font-size: 28rpx;
        height: 100%;
        display: flex;
        align-items: center;
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
