<template>
  <view class="address-content">
    <u-form class="form" :model="form" ref="form" :rules="rules">
      <u-form-item prop="coin" borderBottom>
        <view class="item">
          <view class="item-label">币种</view>
          <view class="flex-box-between">
            <text class="label">{{ form.coin }}</text>
            <u-image
              @click="show = true"
              width="24px"
              height="24px"
              src="@/static/icons/arrow_down.svg"
            ></u-image>
          </view>
        </view>
      </u-form-item>
      <u-form-item prop="address" borderBottom>
        <view class="item">
          <view class="item-label">地址</view>
          <u-input placeholder="请输入地址,5-100" v-model="form.address">
            <template slot="suffix">
              <u-image @click="toQrcode" width="24px" height="24px" src="@/static/icons/to-scan.svg"></u-image>
            </template>
          </u-input>
        </view>
      </u-form-item>
      <u-form-item prop="name" borderBottom>
        <view class="item">
          <view class="item-label">名称</view>
          <u-input
            clearable
            placeholder="请输入名称,2-30"
            v-model="form.name"
          ></u-input>
        </view>
      </u-form-item>
      <u-form-item prop="remark" borderBottom>
        <view class="item">
          <view class="item-label">描述</view>
          <u-input clearable placeholder="选填，可输入描述，最多20汉字" v-model="form.remark"></u-input>
        </view>
      </u-form-item>
    </u-form>
    <u-button :disabled="isDisabled" @click="request" class="login-button">确认添加</u-button>
    <u-popup :show="show">
      <view class="view-edit">
        <view class="edit-title flex-box-between">
          <text style="width: 30px;"></text>
          <text class="fs-14">选择币种</text>
          <u-image @click="show = false" width="24px" height="24px" src="@/static/icons/close.svg"></u-image>
        </view>
        <view class="edit-content">
          <view
            @click="selectCoin(item)"
            class="edit-coin label"
            :class="{'is-active':form.coin===item}"
            v-for="(item,index) in coinList"
            :key="index"
          >
            {{ item }}
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {getCurrency, saveAddressBook} from "../../api/api"

export default {
  name: "index",
  data () {
    return {
      coinList: [],
      form: {
        coin: "",
        address: "",
        name: "",
        remark: ""
      },
      rules: {
        coin: {
          type: "string",
          required: true,
          message: "请选择币种",
          trigger: ["change"],
        },
        address: {
          type: "string",
          max: 100,
          min: 5,
          required: true,
          message: "请输入正确的地址,5-100",
          trigger: ["blur", "change"],
        },
        name: {
          type: "string",
          max: 30,
          min: 2,
          required: true,
          message: "请输入正确的名称,2-30",
          trigger: ["blur", "change"],
        },
        remark: {
          max: 20,
          message: "最多为20个字符",
          trigger: ["blur", "change"],
        }
      },
      show: false,
      loading: false
    }
  },
  onShow () {
    this.getCurrency()
  },
  computed: {
    isDisabled () {
      const {coin, address, name, remark} = this.form
      const isCoin = coin
      const isAddress = address.length >= 5 && address.length <= 100
      const isName = name.length >= 2 && name.length <= 30
      const isRemark = remark.length <= 20
      const {loading} = this
      return !(isCoin && isAddress && isName && isRemark && !loading)
    }
  },
  methods: {
    selectCoin (item) {
      this.form.coin = item
      this.show = false
    },
    toQrcode () {
      // #ifndef H5
      console.log("开始扫一扫")
      uni.scanCode({
        scanType: ["qrCode"],
        success: (res) => {
          console.error(JSON.stringify(res))
          if (res.result) {
            this.form.address = res.result
          }
        },
        fail: (e) => {
          console.error(JSON.stringify(e))
        }
      })
      // #endif
      // #ifdef H5
      uni.showModal({
        title: "扫一扫",
        content: "H5不支持扫码,请下载APP",
        showCancel: false
      })
      // #endif
    },
    getCurrency () {
      getCurrency().then(res => {
        if (res.code.toString() === '0') {
          this.form.coin = res.data[0]
          this.coinList = res.data
        }
      })
    },
    request () {
      this.loading = true
      saveAddressBook(this.form).then((res) => {
        if (res.code.toString() === '0') {
          // this.GET_COIN_ADDRESS_LIST();
          // this.$refs.uNotify.show({
          //   type: "success",
          //   message: "新增成功",
          //   safeAreaInsetTop: true,
          // });
          // this.router({
          //   url: "pages/coinAddress/index",
          //   params: {
          //     coin: this.form.coin
          //   }
          // })
          this.goBack()
        }
        this.loading = false
      })
        .catch(() => {
          this.loading = false
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.address-content {
  padding: 20px;
  height: 100%;
  background: #fff;
  box-sizing: border-box;

  .item {
    width: 100%;
  }

  .item-label {
    margin-bottom: 10px;
    font-size: 14px;
    color: #505bde;
  }
}

.view-edit {
  background: #fff;

  .edit-title {
    color: #fff;
    padding: 13px 16px;
    background: #505bde;
    font-size: 17px;
    text-align: center;
  }

  .edit-content {
    padding: 23px 10px 13px;
    background: #f8f8f8;

    .edit-coin {
      background: #fff;
      padding: 13px 16px;
      text-align: left;
      border-radius: 5px;
      margin-bottom: 6px;
      border: 1px solid #fff;
    }

    .is-active {
      border-color: #505bde;
      color: #505bde;
    }
  }
}
</style>
